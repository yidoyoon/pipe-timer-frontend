<template>
  <div
    v-if="!isEmptyObj(timer) || !isEmptyObj(routine)"
    class="row fit justify-center"
  >
    <q-scroll-area class="full-width" style="height: 140px">
      <q-card class="no-shadow my-card" style="background: transparent">
        <q-card-section class="q-py-md relative-position" style="top: 4px">
          <div class="row justify-center">
            <!--        Routine-->
            <div
              v-if="panelStore.mode === 'routine'"
              class="row justify-start no-wrap"
              style="height: 100px; white-space: nowrap"
            >
              <div
                v-for="(t, index) in routine.routineToTimer"
                :key="t.timer.timerId"
                class="q-pa-none row no-wrap"
              >
                <q-card
                  class="inner-my-card text-white flat"
                  style="background: black; width: 150px"
                  :style="
                    index === round
                      ? highlightBorder(t.timer)
                      : notCurrent(t.timer)
                  "
                >
                  <q-card-section v-show="'timer' in t" class="q-img-container">
                    <div>{{ t.timer.name }}</div>
                    <div>
                      <q-icon name="timer" />
                      {{ timeFormatter(t.timer.duration).value }}<br />
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
              v-else-if="panelStore.mode === 'timer'"
              class="row justify-center no-wrap"
              style="height: 5rem; white-space: nowrap"
            >
              <!--            TODO: width 단위 수정-->
              <div class="q-pa-none row no-wrap">
                <q-card
                  class="inner-my-card text-white flat"
                  style="width: 24.8vh"
                  :style="highlightBorder(panelStore.timer)"
                >
                  <q-card-section class="q-img-container">
                    <div>{{ panelStore.timer.name }}</div>
                    <div>
                      <q-icon name="timer" />
                      {{ timeFormatter(panelStore.timer.duration).value }}<br />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </div>
  <div v-else class="row justify-center items-center text-h6">
    우측의 타이머 혹은 하단의 루틴에서 설정하고자 하는 항목을 더블클릭 하세요.
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { storeToRefs }   from 'pinia';
import { usePanelStore } from 'src/core/panel/infra/store/panel.store';
import { ITimer }        from 'src/core/timers/domain/timer.model';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { computed } from 'vue';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const panelStore = usePanelStore();
const { routine, timer } = storeToRefs(usePanelStore());
let { round } = storeToRefs(usePanelStore());

const arrowDrawer = (index: number) => {
  return !!routine.value && index !== routine.value.routineToTimer.length - 1;
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
