import type { SessionRepository } from "~/authContext/domain/repository/session";
import { useQuery } from "@tanstack/vue-query";
import { httpSession } from "~/authContext/infrastructure/gateway/http-session";

export function useSession() {
  const { isSuccess } = useQuery({
    queryKey: ["userSession"],
    queryFn: async () => {
      const sessionRepository: SessionRepository = new httpSession();
      const { result, err } = await sessionRepository.get();
      if (err !== null) throw err;
      return result;
    },
    retry: 1,
    retryDelay: 5000,
    refetchInterval: 120000,
  });

  return { isSuccess };
}
