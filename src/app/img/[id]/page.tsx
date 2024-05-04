import { fetchMetadata } from "frames.js/next";
import { type NextServerPageProps } from "frames.js/next/types";
import { appUrl } from "~/app/frames/images/my-image/lib";
 
export async function generateMetadata({ params }: NextServerPageProps) {
  let dareId = NaN
  const id = params.id;
  if (typeof id === "string") {
    dareId = parseInt(id, 10);
  }

  console.log("Generating frame for id", dareId)

  return {
    title: "My Page",
    // ...
    other: {
      // ...
      ...(await fetchMetadata(
        // provide a full URL to your /frames endpoint
        new URL(
          `/frames?id=${dareId}`,
          appUrl()
        )
      )),
    },
  };
}
 
export default function Page() {
  return <span>My existing page</span>;
}