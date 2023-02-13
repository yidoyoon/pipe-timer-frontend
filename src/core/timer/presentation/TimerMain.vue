<template>
  <q-scroll-area class="full-height">
    <div class="row q-pa-sm full-height">
      <TimerCore :timers="listTimers" class="col-12" />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import TimerCore from 'src/core/timer/presentation/components/TimerCore.vue';

const timerStore = useTimerStore();

timerStore.fetchAll();

const { listTimers } = timerStore;

// const upsertTimer = (timer: Timer) => {
//   timerStore.edit(timer);
// };
// const removeTimer = (id: string) => {
//   timerStore.remove(id);
// };
</script>
