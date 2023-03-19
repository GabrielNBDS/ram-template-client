import { Response } from "@remix-run/node"

export function loader() {
  throw new Response("Not Found", { status: 404 })
}

export default function NotFound(){
  return <></>
}