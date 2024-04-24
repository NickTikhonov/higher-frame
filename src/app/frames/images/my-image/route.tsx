import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

import fs from 'fs/promises';
import path from 'path';
import { appUrl } from "./lib";

async function getFontArrayBuffer() {
  const sfFontPath = path.resolve(process.cwd(), 'public/assets/sfrounded.ttf');
  const sfFontBuffer = await fs.readFile(sfFontPath);

  // Convert the Node.js Buffer to an ArrayBuffer
  const sfFontArrayBuffer = Uint8Array.from(sfFontBuffer).buffer;

  return sfFontArrayBuffer;
}

async function getBoldFontArrayBuffer() {
  const sfFontPath = path.resolve(process.cwd(), 'public/assets/sfrounded-bold.ttf');
  const sfFontBuffer = await fs.readFile(sfFontPath);

  // Convert the Node.js Buffer to an ArrayBuffer
  const sfFontArrayBuffer = Uint8Array.from(sfFontBuffer).buffer;

  return sfFontArrayBuffer;
}

const sfFont = getFontArrayBuffer()
const sfFontBold = getBoldFontArrayBuffer()
 
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const randomInt = searchParams.get("randomInt"); // Retrieves the value of the 'skip' parameter
  console.log("GET /images/my-image", randomInt)

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

  const imageResponse = new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col" style={fontStyles}> 
        <img src={`${appUrl()}/bg2.png`} tw="absolute top-0 left-0 bottom-0 right-0 w-full h-full" />
        <div tw="w-full h-full flex flex-col justify-between p-10">
          <div tw="flex items-center" style={{fontFamily: "sf-rounded-bold"}}>
            <img tw="w-20 h-20 rounded-full mr-3" src="https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2FN3hRiGd.png" />
            <div>@nt dares to:</div>
          </div>
          <div tw="flex items-center">
            <div tw="text-[60px] pr-16" style={bold}>"Run a 10 hour unlonely stream at FarCon in a Chicken Suit"</div>
            <img tw="h-[300px] rounded-lg" src="https://images.halloweencostumes.co.uk/products/78268/1-2/rooster-costume-for-adults.jpg" />
          </div>
          <div tw="flex flex-col text-[30px]">
            <div tw="flex justify-between items-end">
              <div tw="flex flex-col">
                <div tw="text-[40px]" style={bold}>35% to goal (500 backers)</div>
                <div style={bold}>React to this cast to back @nt</div>
              </div>
              <div tw="flex flex-col items-end">
                <div style={bold}>130 / 500 backers</div>
                <div>backed by @bob, @jane and 130 others</div>
              </div>
            </div>
            <div style={{marginBottom: "10px", height: "20px", position: 'relative', display: 'flex', boxSizing: 'border-box'}}>
              <div tw="rounded-lg" style={{position: 'absolute', top: '0', left: '0', height: '20px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)'}}></div>
              <div tw="rounded-lg" style={{position: 'absolute', top: '0', left: '0', height: '20px', width: `${Math.floor(0.3 * 100)}%`, background: 'linear-gradient(90deg, rgba(255,154,0,1) 0%, rgba(255,184,0,1) 49%, rgba(255,0,194,1) 100%)'}}></div>
            </div>
          </div>
        </div>
      </div>
    ),
    { 
      width: 1146, 
      height: 600,
      fonts: imgOpts.fonts,
    }
  );
 
  // Set the cache control headers to ensure the image is not cached
  imageResponse.headers.set("Cache-Control", "public, max-age=0");
 
  return imageResponse;
}