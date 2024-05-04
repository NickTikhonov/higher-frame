import { fetchMetadata } from "frames.js/next";
import { type NextServerPageProps } from "frames.js/next/types";
 
export async function generateMetadata({ params }: NextServerPageProps) {
  let dareId = NaN
  const id = params.id;
  if (typeof id === "string") {
    dareId = parseInt(id, 10);
  }

  return {
    title: "My Page",
    // ...
    other: {
      // ...
      ...(await fetchMetadata(
        // provide a full URL to your /frames endpoint
        new URL(
          `/frames?id=${dareId}`,
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        )
      )),
    },
  };
}
 
export default function Page() {
  return <span>My existing page</span>;
}