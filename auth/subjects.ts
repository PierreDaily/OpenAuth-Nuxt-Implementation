import { object, string, pipe, email, nonEmpty } from "valibot";
import { createSubjects } from "@openauthjs/openauth";

export const subjects = createSubjects({
  user: object({
    userID: string(),
    email: pipe(string(), nonEmpty(), email()),
  }),
});
