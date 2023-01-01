<template>
  <q-page>
    <div>authUserData: {{ allData }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

const authStore = useAuthStore();
const allData = authStore.authUser;
</script>
