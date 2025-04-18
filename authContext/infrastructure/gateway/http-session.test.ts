import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { httpSession } from "./http-session";
import { generateUrl } from "~/lib/host";

const mockSession = {
  userID: "test-id",
  email: "test@test.com",
};

const handlers = [
  http.get(generateUrl("/api/session"), () => {
    return HttpResponse.json(mockSession);
  }),
];

const server = setupServer(...handlers);

describe("httpSession", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("should resolve to a user session with a null error", async () => {
    const sessionProvider = new httpSession();
    const { result, err } = await sessionProvider.get();
    expect(result).toEqual(mockSession);
    expect(err).toBeNull();
    server.close();
  });

  it("should resolve to a null user session with an error", async () => {
    const errHandler = http.get(generateUrl("/api/session"), () => {
      return HttpResponse.json({ error: "any error message" }, { status: 401 });
    });
    server.use(errHandler);
    server.listen();
    const sessionProvider = new httpSession();
    const { result, err } = await sessionProvider.get();
    expect(result).toBeNull();
    expect(err).toEqual(new Error("couldn't get user info"));
    server.close();
  });
});
