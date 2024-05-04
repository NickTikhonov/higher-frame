/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

import { appUrl } from "./lib";
import { db } from "~/server/db";
 
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const imgIdParam = searchParams.get("imgId"); 
    const imgId = imgIdParam ? parseInt(imgIdParam, 10) : -1;
    const img = await db.higherImg.findUnique({
      where: { id: imgId },
    })

    console.log("Serving image for id", imgId, img)

    if (!img) {
      const imageResponse = new ImageResponse(
        (
          <div tw="w-full h-full flex flex-col bg-black text-white items-center justify-center"> 
            Not Found
          </div>
        ),
        { 
          width: 1200, 
          height: 1200,
        }
      );

      // Set the cache control headers to ensure the image is not cached
      imageResponse.headers.set("Cache-Control", "public, max-age=0");

      return imageResponse;
    }

    const imageResponse = new ImageResponse(
      (
        <div tw="w-full h-full flex flex-col items-center justify-center relative"> 
          <img src={img.img} tw="w-full h-full absolute top-0 left-0" style={{ objectFit: 'cover' }} />
          <img src={`${appUrl()}/arrow.png`} tw="w-full h-full absolute top-0 left-0" style={{ objectFit: 'contain' }} />
        </div>
      ),
      { 
        width: 1200, 
        height: 1200,
      }
    );

    // Set the cache control headers to ensure the image is not cached
    imageResponse.headers.set("Cache-Control", "public, max-age=0");

    return imageResponse;
  } catch(e: any) {
    console.error(e)
    return new Response("Internal Server Error", { status: 500 })
  }
}