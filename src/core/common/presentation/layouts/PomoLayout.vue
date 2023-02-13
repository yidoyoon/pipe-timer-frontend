<template>
  <q-layout view="lHr lpR lFr">
    <!--    Invisible header-->
    <ButtonHeader />

    <!--    Left splitter-->
    <q-splitter
      v-model="splitterModel"
      :limits="[14, 14]"
      style="height: 100vh"
    >
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-route-tab
            to="/"
            name="pomodoro"
            icon="alarm"
            label="Pomodoro"
            style="height: 20vh"
          />
          <q-separator />
          <q-route-tab
            to="/guide"
            name="guide"
            icon="help"
            label="guide"
            exact
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="pomodoro">
            <q-page-container>
              <q-page style="min-height: auto;">
                <router-view />
              </q-page>
            </q-page-container>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <!--    RightDrawer-->
    <RightDrawer :rightDrawerOpen="rightDrawerOpen" />

    <!--    Right drawer button-->
    <q-page-sticky
      position="right"
      :offset="[20, 5]"
      class="z-top"
    >
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
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
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
