<template>
  <div
    v-if="!isEmptyObj(timer) || !isEmptyObj(stack)"
    class="row fit justify-center"
  >
    <q-scroll-area class="full-width" style="height: 15vh">
      <q-card class="no-shadow my-card" style="background: transparent">
        <q-card-section class="q-py-md relative-position" style="top: 4px">
          <!--        Stack-->
          <div
            v-if="pomodoroStore.mode === 'stack'"
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
                style="background: black; width: 12vw"
                :style="
                  index === round ? highlightBorder(t.frag) : notCurrent(t.frag)
                "
              >
                <q-card-section v-show="'frag' in t" class="q-img-container">
                  <div>{{ t.frag.name }}</div>
                  <div>
                    <q-icon name="timer" />
                    {{ timeFormatter(t.frag.duration) }}<br />
                  </div>
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

          <!--        Timer-->
          <div
            v-else-if="pomodoroStore.mode === 'timer'"
            class="row justify-center no-wrap"
            style="height: 5rem; white-space: nowrap"
          >
            <div class="q-pa-none row no-wrap">
              <q-card
                class="inner-my-card text-white flat"
                style="width: 24.8vh"
                :style="highlightBorder(pomodoroStore.timer)"
              >
                <q-card-section class="q-img-container">
                  <div>{{ pomodoroStore.timer.name }}</div>
                  <div>
                    <q-icon name="timer" />
                    {{ timeFormatter(pomodoroStore.timer.duration) }}<br />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </div>
  <div v-else class="row justify-center items-center text-h6">
    우측의 타이머 혹은 하단의 스택에서 설정하고자 하는 항목을 더블클릭 하세요.
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { storeToRefs } from 'pinia';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { computed } from 'vue';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const pomodoroStore = usePomodoroStore();
const { stack, timer } = storeToRefs(usePomodoroStore());
let { round } = storeToRefs(usePomodoroStore());

const arrowDrawer = (index: number) => {
  return !!stack.value && index !== stack.value.stacksToFrag.length - 1;
};

const timeFormatter = (duration: string | number) => {
  return computed(() => {
    return dayjs.duration(+duration, 'seconds').format('HH:mm:ss');
  });
};

const highlightBorder = (timer: ITimer) => {
  return {
    border: 'solid teal 0.3rem',
    ...colorExtractor(timer),
  };
};

const notCurrent = (timer: ITimer) => {
  return {
    border: 'solid transparent 0.3rem',
    ...colorExtractor(timer),
  };
};

const colorExtractor = (timer: ITimer) => {
  return {
    background: timer.color,
  };
};
</script>
