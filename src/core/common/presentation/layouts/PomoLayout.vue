<template>
  <q-layout view="lHr lpR lFr">
    <!--    Invisible header-->
    <ButtonHeader @change-drawer="(e) => (rightDrawer = e)" />

    <!--    Left splitter-->
    <q-splitter
      v-model="splitterModel"
      style="height: 100vh"
      :limits="[10, 10]"
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
              <q-page>
                <router-view />
              </q-page>
            </q-page-container>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <!--    RightDrawer-->
    <RightDrawer v-if="!!user" :rightDrawerOpen="rightDrawerOpen" />

    <!--    Right drawer button-->
    <q-page-sticky
      v-if="!!user"
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

<!--    Open StackList-->
    <q-page-sticky
      v-if="!!user"
      position="bottom"
      class="z-top"
      style="left: 120px; bottom: 0.5rem"
    >
      <q-btn
        @click="toggleStackList"
        icon="keyboard_double_arrow_up"
        color="black"
        flat
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

const splitterModel = ref(10);
const tab = ref('');
const rightDrawerOpen = ref(true);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
