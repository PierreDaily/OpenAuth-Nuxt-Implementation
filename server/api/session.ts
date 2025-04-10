import { subjects } from "~/auth/subjects";
import { client } from "./auth";

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
      return verified.subject.properties;
    }
  }

  throw createError({ status: 401, message: "user isn't authorise" });
});
