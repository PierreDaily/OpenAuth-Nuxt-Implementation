<template>
  <div>{{ isSuccess ? false : true }}</div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
async function getSession() {
  const res = await fetch("/api/session");
  if (!res.ok) {
    throw new Error("couldn't get user info");
  }
  return await res.json();
}

const { isSuccess } = useQuery({
  queryKey: ["userSession"],
  queryFn: getSession,
});
</script>
