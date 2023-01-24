<template>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 50vh"
    class="no-scroll-y col-9"
    :scroll-x="true"
    :scroll-y="false"
  >
    Stack Storage Component Here
  </q-scroll-area>
</template>

<script setup lang="ts">
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
  height: '1rem',
  opacity: '0.5',
};
</script>
