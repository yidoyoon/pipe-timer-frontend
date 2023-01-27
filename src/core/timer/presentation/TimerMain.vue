<template>
  <!--  <div class="row justify-end q-pb-sm">-->
  <!--    <q-btn dense icon="add" round color="positive" @click="addTimefrag" />-->
  <!--  </div>-->
  <div class="row q-py-lg justify-center full-height">
    <div v-for="timer in listTimers" :key="timer">
      <CreateTimer
        :timer="timer"
        @upsert="upsertTimer"
        @remove="removeTimer"
      />
    </div>
  </div>
  <!--    <q-footer>-->
  <!--      <save-timer />-->
  <!--    </q-footer>-->
</template>

<script setup lang="ts">
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { storeToRefs } from 'pinia';
import { Timer } from 'src/core/timer/domain/timer.model';
import CreateTimer from 'src/core/timer/presentation/components/CreateTimer.vue';

const timefragStore = useTimerStore();
const timefragStoreRefs = storeToRefs(timefragStore);

timefragStore.fetchAll();

const { listTimers } = timefragStoreRefs;
const addTimefrag = () => {
  timefragStore.add(new Timer({}));
};
const upsertTimer = (timer: Timer) => {
  timefragStore.edit(timer);
};
const removeTimer = (id: string) => {
  timefragStore.remove(id);
};
</script>
