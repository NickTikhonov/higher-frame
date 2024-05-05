/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { appUrl } from "../frames/images/my-image/lib";

type CastId = {
  fid: number;
  hash: string;
};

type UntrustedData = {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  inputText?: string;
  state: string;
  transactionId: string;
  address: string;
  castId: CastId;
};

type TrustedData = {
  messageBytes: string;
};

type MessagePayload = {
  untrustedData: UntrustedData;
  trustedData: TrustedData;
};


export async function GET() {
  return NextResponse.json({
    "name": "Higher remix ↑",
    "icon": "flame",
    "description": "Add the arrow to any image cast and share in-frame",
    "aboutUrl": "https://warpcast.com/nt/0xfd32d8b7",
    "postUrl": "https://frames.ntik.me/action",
    "action": {
    "type": "post"
    }
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json() as MessagePayload

  const castHash = body.untrustedData.castId.hash
  const fid = body.untrustedData.fid
  if (!castHash || !fid) {
    return NextResponse.json({
      type: "message",
      message: "Invalid frame action"
    })
  }

  // Fetch neynar info -> image
  const url = `https://api.neynar.com/v2/farcaster/cast?identifier=${castHash}&type=hash`;
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', api_key: env.NEYNAR_API_KEY}
  };

  const res = await fetch(url, options)

  const json = await res.json() as { cast: { embeds: { url: string }[] } };
  const embeds = json.cast.embeds;
  const imageUrl = embeds.find(embed => embed.url)?.url;

  const img = await db.higherImg.create({
    data: {
      img: imageUrl!,
      authorFid: fid
    }
  })

  return NextResponse.json({
    type: "frame",
    frameUrl: `${appUrl()}/img/${img.id}`
  })


  // Create new image in db
  // Return message with frame URL
}