/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    type Embed,
    FarcasterNetwork,
    HashScheme,
    makeLinkAdd,
    makeLinkRemove,
    makeCastAdd,
    makeReactionAdd,
    makeReactionRemove, 
    Message,
    MessageData,
    NobleEd25519Signer,
    getSSLHubRpcClient,
    ReactionType,
    Protocol,
  } from '@farcaster/hub-nodejs';
  import { blake3 } from '@noble/hashes/blake3';

import { env } from '~/env';

export async function castWithPrivateKey(fid: number, castText: string, privateKey: string) {
  const signer = getSigner(privateKey);
  const castMessage = await createCastMessage({
    signer,
    text: castText,
    fid
  });

  if (!castMessage) {
    return null;
  }

  const res = await submitHubMessage(castMessage);
  return res;
}

export async function recastWithPrivateKey(fid: number, castHash: string, castAuthorFid: number, privateKey: string) {
  const signer = getSigner(privateKey);
  const recastMessage = await createReactionMessage({
    signer,
    castHash,
    castAuthorFid,
    type: ReactionType.RECAST,
    fid
  });

  if (!recastMessage) {
    return null;
  }

  const res = await submitHubMessage(recastMessage);
  return res;
}

export async function likeWithPrivateKey(fid: number, castHash: string, castAuthorFid: number, privateKey: string) {
  const signer = getSigner(privateKey);
  const likeMessage = await createReactionMessage({
    signer,
    castHash,
    castAuthorFid,
    type: ReactionType.LIKE,
    fid
  });

  if (!likeMessage) {
    return null;
  }

  const res = await submitHubMessage(likeMessage);
  return res;
}

export async function getUsername(fid: number): Promise<string|undefined> {
  await waitForHubReady();
  const user = await hubClient.getUserData({
    fid,
    userDataType: 6
  })
  const userData = user.unwrapOr(null);
  return userData?.data?.userDataBody?.value
}

export async function getPfp(fid: number): Promise<string|undefined> {
  await waitForHubReady();
  const user = await hubClient.getUserData({
    fid,
    userDataType: 1
  })
  const userData = user.unwrapOr(null);
  return userData?.data?.userDataBody?.value
}

// Retrieves the user's Ethereum address by FID
// If multiple verifications exist, takes the earliest verification by timestamp.
// Returns null if none attached.
export async function getEthereumAddress(fid: number): Promise<string | null> {
  await waitForHubReady();
  const user = await hubClient.getVerificationsByFid({
    fid
  })
  const userData = user.unwrapOr(null);
  if (!userData) {
    return null
  }
  const ethereumVerifications = userData
    .messages
    .map(m => ({ body: m.data?.verificationAddAddressBody, timestamp: m.data?.timestamp }))
    .filter(d => d.body !== undefined && d.timestamp !== undefined && d.body.protocol === Protocol.ETHEREUM);
  
  if (ethereumVerifications.length === 0) {
    return null
  }
  const earliest = ethereumVerifications.reduce((a, b) => a.timestamp! < b.timestamp! ? a : b);
  const addressBuffer = earliest.body!.address
  // @ts-expect-error toString should work here
  return '0x' + addressBuffer.toString('hex')
}

export async function getCastDetails(authorFid: number, castHash: string) {
  await waitForHubReady();
  const cast = await hubClient.getCast({
    fid: authorFid,
    hash: new Uint8Array(Buffer.from(castHash.slice(2), 'hex'))
  });
  return cast.unwrapOr(null);
}

export async function getReactions(authorFid: number, castHash: string) {
  await waitForHubReady();
  const cast = await hubClient.getReactionsByCast({
    targetCastId: {
      fid: authorFid,
      hash: new Uint8Array(Buffer.from(castHash.slice(2), 'hex'))
    },
    reactionType: ReactionType.LIKE,
  });
  return cast.unwrapOr(null);
}

// Low level shit 👇

const hubClient = getSSLHubRpcClient(env.HUB_GRPC_URL, {});
  
export function getSigner(privateKey: string): NobleEd25519Signer {
  privateKey = privateKey.slice(2);
  const ed25519Signer = new NobleEd25519Signer(Buffer.from(privateKey, 'hex'));
  return ed25519Signer;
}
  
export async function createReactionMessage({
  signer,
  castHash,
  castAuthorFid,
  type,
  remove,
  fid
}: {
  signer: NobleEd25519Signer;
  castHash: string;
  castAuthorFid: number;
  type: ReactionType;
  remove?: boolean;
  fid: number;
}) {

  const messageDataOptions = {
    fid,
    network: FarcasterNetwork.MAINNET
  };

  const maker = remove ? makeReactionRemove : makeReactionAdd;

  const message = await maker(
    {
      type,
      targetCastId: {
        hash: new Uint8Array(Buffer.from(castHash.slice(2), 'hex')),
        fid: castAuthorFid
      }
    },
    messageDataOptions,
    signer
  );

  return message.unwrapOr(null);
}
  
export async function createCastMessage({
  signer,
  text,
  embeds,
  parentCastHash,
  parentCastFid,
  parentUrl,
  mentions,
  mentionsPositions,
  fid
}: {
  signer: NobleEd25519Signer
  text: string;
  embeds?: Embed[];
  parentCastHash?: string;
  parentCastFid?: number;
  parentUrl?: string;
  mentions?: number[];
  mentionsPositions?: number[];
  fid: number;
}) {
  const messageDataOptions = {
    fid,
    network: FarcasterNetwork.MAINNET
  };

  const parentCastId =
    parentCastHash && parentCastFid
      ? {
          hash: new Uint8Array(Buffer.from(parentCastHash, 'hex')),
          fid: parentCastFid
        }
      : undefined;

  const message = await makeCastAdd(
    {
      text,
      embeds: embeds ?? [],
      embedsDeprecated: [],
      mentions: mentions ?? [],
      mentionsPositions: mentionsPositions ?? [],
      parentCastId,
      parentUrl
    },
    messageDataOptions,
    signer
  );

  if (message.isErr()) {
    console.error(message.error);
  }

  return message.unwrapOr(null);
}
  
  
export async function createFollowMessage({
  signer,
  targetFid,
  fid,
  remove
}: {
  signer: NobleEd25519Signer,
  targetFid: number;
  fid: number;
  remove?: boolean;
}) {
  const messageDataOptions = {
    fid: fid,
    network: FarcasterNetwork.MAINNET
  };

  const maker = remove ? makeLinkRemove : makeLinkAdd;

  const message = await maker(
    {
      type: 'follow',
      targetFid: targetFid
    },
    messageDataOptions,
    signer
  );

  return message.unwrapOr(null);
}

export async function makeMessage(messageData: MessageData, signer: NobleEd25519Signer) {
  const dataBytes = MessageData.encode(messageData).finish();

  const hash = blake3(dataBytes, { dkLen: 20 });

  const signature = await signer.signMessageHash(hash);
  if (signature.isErr()) return null;

  const signerKey = await signer.getSignerKey();
  if (signerKey.isErr()) return null;

  const message = Message.create({
    data: messageData,
    hash,
    hashScheme: HashScheme.BLAKE3,
    signature: signature.value,
    signatureScheme: signer.scheme,
    signer: signerKey.value
  });

  return message;
}

async function waitForHubReady(timeoutMs?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!timeoutMs) {
        timeoutMs = 1000;
    }
    hubClient.$.waitForReady(Date.now() + timeoutMs, (e: any) => {
      if (e) {
        console.error(`Failed to connect to hub`, e);
        reject(e)
      } else {
        resolve()
      }
    });
  })
}

export async function submitHubMessage(message: Message) {
  await waitForHubReady();
  const res = await hubClient.submitMessage(message)
  const unwrapped = res.unwrapOr(null);
    if (!unwrapped) {
      return null
    }
    return res
}