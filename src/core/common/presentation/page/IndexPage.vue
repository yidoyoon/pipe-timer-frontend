<template>
  <q-page>
    <div>UserData: {{ allData }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/core/users/infra/store/user.store';

const userStore = useUserStore();
const allData = userStore.user;
</script>
