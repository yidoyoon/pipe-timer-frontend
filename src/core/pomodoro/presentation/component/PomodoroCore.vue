<template>
  <div class="row dense justify-center" style="height: 35vh">
    <!--    <div class="q-my-sm">-->
    <!--      &lt;!&ndash;      {{ stack }}&ndash;&gt;-->
    <!--      Name: {{ stack.name }} <br />-->
    <!--      duration: {{ hour }}hour {{ min }}min {{ sec }}seconds <br />-->
    <!--      Total Duration: {{ getTotalDuration }}-->
    <!--    </div>-->
    Round: {{ round }} <br>
    Current Duration: {{ currDuration }} <br>
    Total Duration: {{ getTotalDuration }} <br>

    <q-space class="flex-break"></q-space>
    <q-card class="no-shadow my-card flat" style="background: transparent">
      <q-card-section class="q-py-none">
        <div
          v-if="stack.stacksToFrag !== undefined"
          class="row justify-between no-wrap"
          style="height: 5rem; white-space: nowrap"
        >
          <div
            v-for="(t, index) in stack.stacksToFrag"
            :key="t.frag.fragId"
            class="q-pa-none row no-wrap"
          >
            <q-card
              class="inner-my-card text-white flat"
              style="background: black; display: inline-block; width: 12vw"
            >
              <q-card-section v-show="'frag' in t" class="q-img-container">
                <div>Name: {{ t['frag']['name'] }}</div>
                <div>Duration: {{ t['frag']['duration'] }}<br /></div>
              </q-card-section>
            </q-card>
            <div class="row items-center">
              <q-icon
                v-if="arrowDrawer(index)"
                name="arrow_right"
                style="font-size: 4rem; color: grey"
              ></q-icon>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { storeToRefs } from 'pinia';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { ref } from 'vue';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { getCurrentDuration, getTotalDuration, stack } = usePomodoroStore();
const { round } = storeToRefs(usePomodoroStore());

const totalDuration = getCurrentDuration;
const currDuration = getCurrentDuration;

const sec = dayjs.duration(getCurrentDuration, 'seconds').seconds();
const min = dayjs.duration(getCurrentDuration, 'seconds').minutes();
const hour = dayjs.duration(getCurrentDuration, 'seconds').hours();

const arrowDrawer = (index: number) => {
  return !!stack && index !== stack.stacksToFrag.length - 1;
};
</script>

<style scoped lang="scss">
.flex-break {
  flex: 1 0 100% !important;
  height: 0;
}
</style>
