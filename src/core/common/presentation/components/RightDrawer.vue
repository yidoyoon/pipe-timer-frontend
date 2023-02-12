<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    borderd
    :width="200"
    :breakpoint="400"
  >
    <q-scroll-area
      style="
        height: 100%;
        /*height: calc(100% - 150px);*/
        /*margin-top: 150px;*/
        border-left: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-item-section>
          <q-item class="row justify-center">
            <q-item-label
              >Logged in as <b>{{ userStore.user.userName }}</b></q-item-label
            >
          </q-item>
        </q-item-section>
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon name="timer" />
          </q-item-section>
          <q-item-section>
            <q-item-label>타이머 리스트</q-item-label>
<!--            <q-item-label caption>Caption</q-item-label>-->
          </q-item-section>
        </q-item>
        <q-separator/>

        <TimerCore :timers="listTimers" class="col-12" />
      </q-list>
    </q-scroll-area>

    <!--    <q-img-->
    <!--      class="absolute-top"-->
    <!--      src="https://cdn.quasar.dev/img/material.png"-->
    <!--      style="height: 150px"-->
    <!--    >-->
    <!--      <div class="absolute-bottom bg-transparent">-->
    <!--        <q-avatar size="56px" class="q-mb-sm">-->
    <!--          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />-->
    <!--        </q-avatar>-->
    <!--        <div class="text-weight-bold">Razvan Stoenescu</div>-->
    <!--        <div>@rstoenescu</div>-->
    <!--      </div>-->
    <!--    </q-img>-->
  </q-drawer>
</template>

<script setup lang="ts">
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ref, watch } from 'vue';
import TimerCore from 'src/core/timer/presentation/components/TimerCore.vue';

const props = withDefaults(defineProps<{ rightDrawerOpen: boolean }>(), {
  rightDrawerOpen: true,
});

const timerStore = useTimerStore();

const userStore = useUserStore();

const { listTimers } = timerStore;

const rightDrawerOpen = ref(props.rightDrawerOpen);

timerStore.fetchAll();

watch(props, () => {
  rightDrawerOpen.value = props.rightDrawerOpen;
});
</script>
