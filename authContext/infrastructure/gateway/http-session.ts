import type { SessionRepository } from "~/authContext/domain/repository/session";
import { validateSession } from "~/authContext/utils/session-validation";

export class httpSession implements SessionRepository {
  async get() {
    try {
      const res = await fetch("/api/session");
      if (!res.ok || res.status === 401) {
        throw new Error("couldn't get user info");
      }
      const data = await res.json();
      const parsed = validateSession(data);
      return { result: parsed, err: null };
    } catch (err) {
      if (typeof err === "string" || err instanceof Error)
        return { result: null, err };
      return { result: null, err: "invalid error format" };
    }
  }
}
