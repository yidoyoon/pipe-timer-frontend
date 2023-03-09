<template>
  <q-drawer v-model="drawer" :width="220">
    <q-scroll-area
      style="
        height: calc(100% - 33px);
        margin-top: 33px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-space style="height: 200px"></q-space>
          <q-route-tab name="timers" icon="alarm" label="timers" to="/" />
        </q-tabs>
      </q-list>
    </q-scroll-area>

    <q-img
      class="absolute-top"
      src="https://img.yibyeongyong.com/public/dummy-logo-black.svg"
      style="zoom: 11%; border-right: 1px solid #ddd"
    />
  </q-drawer>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref }       from 'vue';

const $q = useQuasar()

const drawer = $q.screen.gt.sm ? ref(true) : ref(false);
const tab = ref('timers');
</script>
