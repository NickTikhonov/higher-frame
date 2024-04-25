import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";

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

const handleRequest = frames(async (ctx) => {
  let id = NaN
  const idParam = ctx.searchParams.id
  if (typeof idParam === "string") {
    id = parseInt(idParam, 10);
  }
  const randomInt = Math.floor(Math.random() * 1000000);
  return {
    image: `/images/my-image?randomInt=${randomInt}&id=${id}`,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
