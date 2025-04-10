import { useQuery } from "@tanstack/vue-query";
import { object, string, pipe, email, nonEmpty, parse } from "valibot";

const schema = object({
  userID: string(),
  email: pipe(string(), nonEmpty(), email()),
});

export function useSession() {
  async function getSession() {
    const res = await fetch("/api/session");
    if (!res.ok || res.status === 401) {
      throw new Error("couldn't get user info");
    }
    const rawData = await res.json();
    const result = parse(schema, rawData);
    return result;
  }

  const { isSuccess } = useQuery({
    queryKey: ["userSession"],
    queryFn: getSession,
    retry: 1,
    retryDelay: 5000,
  });

  return { isSuccess };
}
