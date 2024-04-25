import { env } from "~/env"

export function appUrl() {
  const host = env.NEXT_PUBLIC_HOST_URL || "localhost:3000"
  if (host.startsWith("localhost")) {
    return `http://${host}`
  } else {
    return `https://${host}`
  }
}

export function appHost() {
  return env.NEXT_PUBLIC_HOST_URL
}