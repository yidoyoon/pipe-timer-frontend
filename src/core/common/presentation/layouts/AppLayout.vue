<template>
  <q-layout view="lHr lpR lFr">
    <!--    Right drawer button-->
    <q-page-sticky position="top-right" class="z-top">
      <q-btn @click="toggleRightDrawer" icon="menu" flat color="black" dense />
    </q-page-sticky>

    <!--    Invisible header-->
    <q-header>
      <ButtonHeader />
    </q-header>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <!--    TODO: 미니모드 적용-->
    <!--    LeftDrawer-->
    <LeftDrawer :leftDrawerOpen="leftDrawerOpen" />

    <!--    RightDrawer-->
    <RightDrawer :rightDrawerOpen="rightDrawerOpen" />

    <q-footer style="background-color: transparent">
      <BottomDrawer v-if=$q.platform.is.desktop />
      <q-tabs v-else class="text-teal" v-model="tab" vertical>
        <q-route-tab name="timers" icon="alarm" label="timers" to="/" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import BottomDrawer from 'src/core/common/presentation/components/BottomDrawer.vue';
import LeftDrawer   from 'src/core/tabs/presentation/TabsMain.vue';
import RightDrawer  from 'src/core/timers/presentation/TimerMain.vue';
import ButtonHeader from 'src/core/common/presentation/components/ButtonHeader.vue';

const $q = useQuasar();

const tab = ref('');
const rightDrawerOpen = $q.platform.is.desktop ? ref(true) : ref(false);
const leftDrawerOpen = $q.platform.is.desktop ? ref(true) : ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
