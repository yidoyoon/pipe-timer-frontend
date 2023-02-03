<template>
  <q-scroll-area class="full-height">
    <div class="row q-pa-sm full-height">
      <TimerCore
        :timers="listTimers"
        @upsert="upsertTimer"
        @remove="removeTimer"
        class="col-12"
      />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { storeToRefs } from 'pinia';
import { Timer } from 'src/core/timer/domain/timer.model';
import TimerCore from 'src/core/timer/presentation/components/TimerCore.vue';

const timerStore = useTimerStore();
const timefragStoreRefs = storeToRefs(timerStore);

timerStore.fetchAll();

const { listTimers } = timefragStoreRefs;

const upsertTimer = (timer: Timer) => {
  timerStore.edit(timer);
};
const removeTimer = (id: string) => {
  timerStore.remove(id);
};
</script>
