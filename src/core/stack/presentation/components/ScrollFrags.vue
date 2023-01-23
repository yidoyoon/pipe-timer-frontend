<template>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :content-style="contentStyle"
      :content-active-style="contentActiveStyle"
      style="
        width: 25vw;
        height: 60vh;
        position: static;
        top: 10vw;
        right: 2vw;
      "
    >
      <CreateTimefrag></CreateTimefrag>
    </q-scroll-area>
</template>

<script setup lang="ts">
import CreateTimefrag from 'src/core/timefrag/presentation/pages/CreateTimefrag.vue';

const contentStyle = {
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#555',
};

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'black',
};

const thumbStyle = {
  right: '2px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: '0.75',
};
</script>

<style scoped></style>
