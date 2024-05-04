/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

import { appUrl, getFontBuffer } from "./lib";
import { db } from "~/server/db";

const sfFont = getFontBuffer('public/assets/sfrounded.ttf')
const sfFontBold = getFontBuffer('public/assets/sfrounded-bold.ttf')
 
export async function GET(req: NextRequest) {
  const [sfRoundedFont, sfRoundedBoldFont] = await Promise.all([
    sfFont,
    sfFontBold
  ]);
  const imgOpts = {
    fonts: [
      {
        name: 'sf-rounded',
        data: sfRoundedFont,
      },
      {
        name: 'sf-rounded-bold',
        data: sfRoundedBoldFont,
      },
    ]
  };
  const fontStyles = {
    fontFamily: 'sf-rounded',
    fontSize: '43px',
    color: 'white',
  };

  const bold = {
    fontFamily: 'sf-rounded-bold',
  }

  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const imgIdParam = searchParams.get("imgId"); 
  const imgId = imgIdParam ? parseInt(imgIdParam, 10) : -1;
  const img = await db.higherImg.findUnique({
    where: { id: imgId },
  })

  if (!img) {
    const imageResponse = new ImageResponse(
      (
        <div tw="w-full h-full flex flex-col bg-black items-center justify-center" style={fontStyles}> 
          Not Found
        </div>
      ),
      { 
        width: 1200, 
        height: 1200,
        fonts: imgOpts.fonts,
      }
    );

    // Set the cache control headers to ensure the image is not cached
    imageResponse.headers.set("Cache-Control", "public, max-age=0");

    return imageResponse;
  }

  const imageResponse = new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col items-center justify-center relative" style={fontStyles}> 
        <img src={img.img} tw="w-full h-full absolute top-0 left-0" style={{ objectFit: 'cover' }} />
        <img src={`${appUrl()}/arrow.png`} tw="w-full h-full absolute top-0 left-0" style={{ objectFit: 'contain' }} />
      </div>
    ),
    { 
      width: 1200, 
      height: 1200,
      fonts: imgOpts.fonts,
    }
  );

  // Set the cache control headers to ensure the image is not cached
  imageResponse.headers.set("Cache-Control", "public, max-age=0");

  return imageResponse;
}