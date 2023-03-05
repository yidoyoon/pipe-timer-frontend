<template>
  <q-drawer v-model="drawer" show-if-above :width="220" :breakpoint="400">
    <q-scroll-area
      style="
        height: calc(100% - 33px);
        margin-top: 33px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
        >
          <q-space style="height: 200px"></q-space>
          <q-route-tab name="timers" icon="alarm" label="timers" to="/" />
        </q-tabs>
<!--        <q-item clickable v-ripple>-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="inbox" />-->
<!--          </q-item-section>-->

<!--          <q-item-section> Inbox </q-item-section>-->
<!--        </q-item>-->

<!--        <q-item active clickable v-ripple>-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="star" />-->
<!--          </q-item-section>-->

<!--          <q-item-section> Star </q-item-section>-->
<!--        </q-item>-->

<!--        <q-item clickable v-ripple>-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="send" />-->
<!--          </q-item-section>-->

<!--          <q-item-section> Send </q-item-section>-->
<!--        </q-item>-->

<!--        <q-item clickable v-ripple>-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="drafts" />-->
<!--          </q-item-section>-->

<!--          <q-item-section> Drafts </q-item-section>-->
<!--        </q-item>-->
      </q-list>
    </q-scroll-area>

    <q-img
      class="absolute-top"
      src="https://img.yibyeongyong.com/public/dummy-logo-black.svg"
      style="zoom: 11%; border-right: 1px solid #ddd;"
    />
  </q-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
const tab = ref('timers')
</script>
