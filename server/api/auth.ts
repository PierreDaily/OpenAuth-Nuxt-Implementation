import { createClient } from "@openauthjs/openauth/client";
import { sendRedirect } from "h3";

export const client = createClient({
  clientID: "nuxt-v3-client",
  issuer: "http://localhost:4000", // url to the OpenAuth server
});

export default defineEventHandler(async (event) => {
  const redirect_uri = "http://localhost:3000/api/callback";
  const { url } = await client.authorize(redirect_uri, "code");

  console.log(url);
  sendRedirect(event, url);
});
