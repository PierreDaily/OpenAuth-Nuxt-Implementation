<template>
  <div>{{ isSuccess ? true : false }}</div>
</template>

<script lang="ts" setup>
import { useSession } from "./hook";

const { isSuccess } = useSession();
</script>
