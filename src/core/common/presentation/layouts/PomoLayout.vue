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

    <!--    LeftDrawer-->
    <LeftDrawer class="gt-sm" :leftDrawerOpen="leftDrawerOpen" />

    <!--    RightDrawer-->
    <RightDrawer :rightDrawerOpen="rightDrawerOpen" />

    <q-footer style="background-color: transparent">
      <BottomDrawer class="gt-sm"></BottomDrawer>
      <q-tabs class="lt-md text-teal" v-model="tab" vertical>
        <q-route-tab name="timers" icon="alarm" label="timers" to="/" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import LeftDrawer from 'src/core/common/presentation/components/LeftDrawer.vue';
import BottomDrawer from 'src/core/pomodoro/presentation/BottomDrawer.vue';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ref } from 'vue';
import ButtonHeader from 'src/core/common/presentation/components/ButtonHeader.vue';
import RightDrawer from 'src/core/common/presentation/components/RightDrawer.vue';

const { user } = storeToRefs(useUserStore());
const $q = useQuasar();

const tab = ref('');
const rightDrawerOpen = $q.platform.is.desktop ? ref(true) : ref(false);
const leftDrawerOpen = ref(true);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
