/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-key */
import { farcasterHubContext } from "frames.js/middleware";
import { Button, createFrames } from "frames.js/next";
import { db } from "~/server/db";
import { appUrl } from "./images/my-image/lib";

const frames = createFrames({
  basePath: '/frames',
  middleware: [
    farcasterHubContext({
      // remove if you aren't using @frames.js/debugger or you just don't want to use the debugger hub
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
  ],
});

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const handleRequest = frames(async (ctx) => {
  console.log(ctx.searchParams)
  const idParam = ctx.searchParams.id
  const id = idParam ? parseInt(idParam, 10) : -1
  const gen = ctx.searchParams.gen ?? false
  const imgUrl = ctx.message?.inputText
  const validImgUrl = isValidUrl(imgUrl ?? "")

  console.log("Serving frame for id", id, "gen", gen, "imgUrl", imgUrl, "validImgUrl", validImgUrl)

  if (!gen) {
    return {
      image: `/images/my-image?imgId=${id}`,
      buttons: [
        <Button action="link" target={`https://warpcast.com/~/compose?text=higher&embeds[]=${appUrl()}/img/${id}`}>
          Share
        </Button>,
        <Button action="post" target={{ query: { gen: 'y' }}}>
          Generate
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      }
    };
  } else {
    if (!validImgUrl) {
      return {
        image: (
          <div tw="w-full h-full flex flex-col bg-black items-center justify-center text-white">
            Enter an image URL to generate
          </div>
        ),
        buttons: [
          <Button action="post" target={{ query: { gen: 'y' }}}>
            Submit
          </Button>,
        ],
        textInput: "Enter Image URL",
        imageOptions: {
          aspectRatio: "1:1",
        }
      };
    }

    const newImg = await db.higherImg.create({
      data: {
        img: imgUrl!,
        authorFid: ctx.message?.requesterFid ?? 0
      }
    })

    return {
      image: `/images/my-image?imgId=${newImg.id}`,
      buttons: [
        <Button action="link" target={`https://warpcast.com/~/compose?text=higher&embeds[]=${appUrl()}/img/${newImg.id}`}>
          Share
        </Button>,
        <Button action="post" target={{query: {gen: 'y'}}}>
          Generate Another
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      }
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
