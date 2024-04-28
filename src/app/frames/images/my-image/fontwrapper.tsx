import { ImageResponse } from "@vercel/og";
import { getFontBuffer } from "./lib";

export async function ImageWithFonts({ children }: { children: React.ReactNode }) {
  const sfFont = getFontBuffer('public/assets/sfrounded.ttf')
  const sfFontBold = getFontBuffer('public/assets/sfrounded-bold.ttf')

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
  const imageResponse = new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col" style={fontStyles}> 
        {children}
      </div>
    ),
    { 
      width: 1146, 
      height: 600,
      fonts: imgOpts.fonts,
    }
  );

  imageResponse.headers.set("Cache-Control", "public, max-age=0");
  return imageResponse;
}