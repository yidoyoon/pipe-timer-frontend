<template>
  <div>UserData: {{ allData }}</div>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/core/users/infra/store/user.store';

const userStore = useUserStore();
const allData = userStore.user;
</script>
