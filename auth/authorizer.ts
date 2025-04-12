import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { serve } from "@hono/node-server";
import { subjects } from "./subjects";

const app = issuer({
  providers: {
    google: GoogleProvider({
      clientID: process.env.NUXT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET || "",
      scopes: ["email"],
    }),
    github: GithubProvider({
      clientID: process.env.NUXT_GITHUB_CLIENT_ID || "",
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET || "",
      scopes: ["email"],
    }),
  },
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  success: async (ctx, value) => {
    if (value.provider === "github") {
      ///
      const access = value.tokenset.access;
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access}`, // Bearer token format for Google
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user info from Google: ${response.statusText}`
        );
      }
      const userInfo = await response.json();
      console.log(userInfo);
      ///
      return ctx.subject("user", {
        userID: "githubID",
        email: "dsds@fdfd.com",
      });
    }
    if (value.provider === "google") {
      const access = value.tokenset.access;
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access}`, // Bearer token format for Google
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user info from Google: ${response.statusText}`
        );
      }
      const userInfo = await response.json();
      const email = userInfo.email;
      console.log("found email", email);
      return ctx.subject("user", {
        userID: "123",
        email: userInfo.email,
      });
    }

    throw new Error("Invalid provider");
  },
});

serve({ fetch: app.fetch, port: 4000 });
