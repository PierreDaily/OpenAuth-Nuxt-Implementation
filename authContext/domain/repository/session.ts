import type { Session } from "../entity/session";

export interface SessionRepository {
  get(): Promise<
    | {
        result: Session;
        err: null;
      }
    | {
        result: null;
        err: Error | string;
      }
  >;
}
