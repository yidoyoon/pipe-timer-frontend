<template>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 30vh"
  >
    <CreateStacks></CreateStacks>
  </q-scroll-area>
</template>

<script setup lang="ts">
import CreateStacks from 'src/core/stack/presentation/pages/CreateStacks.vue';

const contentStyle = {
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#555',
};

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'black',
};

const thumbStyle = {
  bottom: '0px',
  borderRadius: '0px',
  backgroundColor: 'grey',
  height: '0.5rem',
  opacity: '0.5',
};
</script>

<style scoped></style>
