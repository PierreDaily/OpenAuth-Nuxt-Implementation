import { useQuery } from "@tanstack/vue-query";
import { httpSession } from "~/authContext/infrastructure/gateway/http-session";

export function useSession() {
  const { isSuccess } = useQuery({
    queryKey: ["userSession"],
    queryFn: async () => {
      const getSession = new httpSession().get;
      const { result, err } = await getSession();
      if (err !== null) throw err;
      return result;
    },
    retry: 1,
    retryDelay: 5000,
    refetchInterval: 120000,
  });

  return { isSuccess };
}
