<template>
  <q-layout view="lHr lpR lFr">
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
    <LeftDrawer :rightDrawerOpen="rightDrawerOpen" />

    <!--    RightDrawer-->
    <RightDrawer :rightDrawerOpen="rightDrawerOpen" />

    <!--    Right drawer button-->
    <q-page-sticky position="right" :offset="[20, 5]" class="z-top">
      <q-btn
        @click="toggleRightDrawer"
        :icon="
          rightDrawerOpen
            ? 'keyboard_double_arrow_right'
            : 'keyboard_double_arrow_left'
        "
        flat
        color="black"
        round
      />
    </q-page-sticky>

    <q-footer style="background-color: transparent">
      <BottomDrawer></BottomDrawer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import LeftDrawer from 'src/core/common/presentation/components/LeftDrawer.vue';
import BottomDrawer from 'src/core/pomodoro/presentation/BottomDrawer.vue';
import PomodoroMain from 'src/core/pomodoro/presentation/PomodoroMain.vue';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ref } from 'vue';
import ButtonHeader from 'src/core/common/presentation/components/ButtonHeader.vue';
import RightDrawer from 'src/core/common/presentation/components/RightDrawer.vue';

const { user } = storeToRefs(useUserStore());

const tab = ref('');
const splitterModel = ref(14);
const rightDrawerOpen = ref(true);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
