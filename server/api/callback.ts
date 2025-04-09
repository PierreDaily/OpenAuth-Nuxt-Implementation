import { subjects } from "~/auth/subjects";
import { client } from "./auth";

export default defineEventHandler(async (event) => {
  const redirect_uri = "http://localhost:3000/api/callback";
  const url = getRequestURL(event);
  const code = url.searchParams.get("code");
  if (code === null)
    throw createError({
      status: 400,
      message: "code query paramater is undefined",
    });
  const result = await client.exchange(code, redirect_uri);
  if (result.err)
    throw createError({
      status: 400,
      message: "oAuth code can't be exchange for tokens",
    });

  setCookie(event, "accessToken", result.tokens.access);
  setCookie(event, "refreshToken", result.tokens.refresh);

  const verified = await client.verify(subjects, result.tokens.access, {
    refresh: result.tokens.refresh,
  });
  if (verified.err) {
    throw createError({ status: 401, message: "invalid token" });
  }

  if (verified.tokens) {
    setCookie(event, "accessToken", verified.tokens?.access);
    setCookie(event, "refreshToken", verified.tokens?.refresh);
  }
  return verified.subject.properties;
});
