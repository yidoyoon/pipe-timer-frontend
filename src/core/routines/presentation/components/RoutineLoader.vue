<template>
  <q-card
    class="no-shadow my-card flat"
    style="background: transparent"
    @dblclick="toPanel(props.routine)"
  >
    <div class="text-subtitle1 text-black q-px-md">
      <b>Name: {{ props.routine.name }}</b>
    </div>
    <q-card-section class="q-py-none">
      <div
        v-if="props.routine.routineToTimer !== undefined"
        class="row justify-between no-wrap"
        style="height: 5rem; white-space: nowrap"
      >
        <div
          v-for="(t, index) in props.routine.routineToTimer"
          :key="t.timer.timerId"
          class="q-pa-none row no-wrap"
        >
          <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="toBuilder(props.routine)"
                :disable="
                  panelStore.state === 'start' || panelStore.state === 'pause'
                "
              >
                <q-item-section>수정</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                @click="remove"
                :disable="
                  panelStore.state === 'start' || panelStore.state === 'pause'
                "
              >
                <q-item-section style="color: #8b1c00">삭제</q-item-section>
              </q-item>
            </q-list>
            <q-tooltip
              v-if="
                panelStore.state === 'start' || panelStore.state === 'pause'
              "
              anchor="top middle"
              self="top middle"
            >
              타이머 혹은 루틴 작동 중엔 삭제가 불가능 합니다.<br>'Stop'을 눌러 완전히 정지한 후 진행해 주세요.
            </q-tooltip>
          </q-menu>

          <q-card
            class="inner-my-card text-white flat"
            style="display: inline-block; width: 12vw"
            :style="colorExtractor(t.timer)"
          >
            <q-card-section class="q-img-container">
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
    </q-card-section>
  </q-card>

  <!--  toBuilder prompt-->
  <q-dialog
    v-model="toBuilderWarnPrompt"
    persistent
    @keyup.enter="toBuilder(props.routine)"
    @keyup.esc.prevent="toBuilderWarnPrompt = false"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning"></q-icon>
          Warning
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          현재 빌더에 작업 중인 루틴이 있습니다. 저장하지 않은 작업 내용은
          삭제됩니다. 계속하시겠습니까?
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="red"
          v-close-popup
          @click="toBuilder(props.routine)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';

import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { usePanelStore } from 'src/core/panel/infra/store/panel.store';
import { IRoutine } from 'src/core/routines/domain/routine.model';
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import { LocalStorage, useQuasar } from 'quasar';
import { ITimer } from 'src/core/timers/domain/timer.model';
import { computed, ref } from 'vue';
import _ from 'lodash-es';

const $q = useQuasar();

const routineStore = useRoutineStore();
const builderStore = useBuilderStore();
const panelStore = usePanelStore();
const { isLoadingRoutine } = storeToRefs(routineStore);

const toBuilderPrompt = ref(false);
const toBuilderWarnPrompt = ref(false);

const props = defineProps<{ routine: IRoutine }>();
const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const remove = () => {
  $q.notify({
    progress: true,
    message: '루틴을 삭제하시겠습니까?',
    position: 'bottom',
    multiLine: true,
    icon: 'warning',
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          isLoadingRoutine.value = false;
          emit('remove', props.routine.id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const toBuilder = (routine: IRoutine) => {
  builderStore.$reset();
  builderStore.routineInBuilder = _.cloneDeep(routine);
  toBuilderPrompt.value = false;

  LocalStorage.set('builder-backup', builderStore.routineInBuilder);
};

const arrowDrawer = (index: number) => {
  return !!props.routine && index !== props.routine.routineToTimer.length - 1;
};

const colorExtractor = (timer: ITimer) => {
  return {
    background: timer.color,
  };
};

// Panel related
const toPanel = (routine: IRoutine) => {
  // Session storage for saving initial state of routines, timers
  try {
    $q.sessionStorage.set('panel-data', routine);
    panelStore.routine = _.cloneDeep(routine);
    panelStore.mode = 'routine';
    panelStore.state = 'pause';
    panelStore.round = 0;
  } catch (e) {
    // console.log(e);
  }
};

const timeFormatter = (duration: string | number) => {
  return computed(() => {
    return dayjs.duration(+duration, 'seconds').format('HH:mm:ss');
  });
};
</script>
