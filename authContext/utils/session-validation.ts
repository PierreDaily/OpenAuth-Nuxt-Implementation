import * as v from "valibot";

const sessionSchema = v.object({
  userID: v.string(),
  email: v.pipe(v.string(), v.nonEmpty(), v.email()),
});

export function validateSession(data: unknown): {
  userID: string;
  email: string;
} {
  return v.parse(sessionSchema, data);
}
