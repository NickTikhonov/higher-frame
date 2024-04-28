import { env } from "~/env"
import fs from 'fs/promises';
import path from 'path';

export function appUrl() {
  const host = env.NEXT_PUBLIC_HOST_URL
  if (host.startsWith("localhost")) {
    return `http://${host}`
  } else {
    return `https://${host}`
  }
}

export function appHost() {
  return env.NEXT_PUBLIC_HOST_URL
}

export async function getFontBuffer(publicPath: string) {
  const sfFontPath = path.resolve(process.cwd(), publicPath);
  const sfFontBuffer = await fs.readFile(sfFontPath);
  const sfFontArrayBuffer = Uint8Array.from(sfFontBuffer).buffer;

  return sfFontArrayBuffer;
}