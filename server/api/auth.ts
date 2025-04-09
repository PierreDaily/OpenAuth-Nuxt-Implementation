import { createClient } from "@openauthjs/openauth/client";
import { sendRedirect, getCookie } from "h3";
import { subjects } from "~/auth/subjects";

export const client = createClient({
  clientID: "nuxt-v3-client",
  issuer: "http://localhost:4000", // url to the OpenAuth server
});

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "accessToken");
  const refreshToken = getCookie(event, "refreshToken");

  if (accessToken && refreshToken) {
    const verified = await client.verify(subjects, accessToken, {
      refresh: refreshToken,
    });

    if (!verified.err) {
      if (verified.tokens) {
        setCookie(event, "accessToken", verified.tokens?.access);
        setCookie(event, "refreshToken", verified.tokens?.refresh);
      }
      return sendRedirect(event, "/");
    }
  }
  const redirect_uri = "http://localhost:3000/api/callback";
  const { url } = await client.authorize(redirect_uri, "code");

  return sendRedirect(event, url);
});
