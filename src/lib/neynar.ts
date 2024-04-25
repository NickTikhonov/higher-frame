/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import sdk from '@api/neynar';
import { env } from '~/env';

type CastDetails = {
  authorFid: number;
  authorUsername: string;
  authorPfp: string;
  castText: string;
  castHash: string;
  recastCount: number;
  likeCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function neynarCastDetails(warpcastUrl: string): Promise<CastDetails> {
  const res = await sdk.cast({
    identifier: warpcastUrl,
    type: 'url',
    api_key: env.NEYNAR_API_KEY
  })

  const cast = res.data.cast as any;

  return {
    authorFid: cast.author.fid,
    authorUsername: cast.author.username,
    authorPfp: cast.author.pfp_url,
    castText: cast.text,
    castHash: cast.hash,
    recastCount: cast.reactions.recasts_count,
    likeCount: cast.reactions.likes_count 
  }
}