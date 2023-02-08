<!--TODO: Font 컬러 설정 추가, 입력값 필터링 추가-->
<template>
  <!--  TODO: rTimer가 undefined일 경우 에러 문구 표시-->
  <draggable
    v-if="rTimers[0] !== undefined"
    :list="rTimers"
    item-key="id"
    :group="{ name: 'timers', pull: clone, put: false }"
    v-bind="dragOptions"
    @start="drag = true"
    @end="computeInitIdx"
    :clone="timerWrapper"
    :move="checkIndex"
  >
    <template #item="{ element, index }">
      <div>
        {{ element }}
        <q-card
          class="my-card text-white cursor-pointer no-shadow q-ma-sm"
          style="background: black"
          v-ripple
          @dblclick="
            importFrom === 'EditorMain'
              ? editTimer(element)
              : toPomodoro(element)
          "
        >
          <q-card-section>
            Name: {{ element.name }} <br />
            Duration: {{ element.duration }} <br />
          </q-card-section>
        </q-card>

        <q-dialog v-model="editPrompt" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Edit timer</div>
            </q-card-section>

            <!--            TODO: Input 값 검증 수행-->
            <q-card-section class="q-pt-none" style="width: 20rem">
              <q-input
                label="Timer name"
                dense
                v-model="name"
                @keyup.enter.prevent="update"
                @keyup.esc.prevent="cancel(index)"
              />
              <q-input
                label="Duration"
                dense
                v-model="duration"
                @keyup.enter.prevent="update"
                @keyup.esc.prevent="cancel(index)"
              />
              <!--              <q-input-->
              <!--                label="Duration"-->
              <!--                dense-->
              <!--                v-model="duration"-->
              <!--                @keyup.enter.prevent="update(element)"-->
              <!--                @keyup.esc.prevent="cancel(index)"-->
              <!--              />-->
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup @click="cancel(index)" />
              <q-btn
                flat
                label="Confirm"
                color="green"
                v-close-popup
                @click="update"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { IStacksToFrag, ITimer } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import draggable from 'vuedraggable';

const timerStore = useTimerStore();
const selectorStore = useSelectorStore();
const pomodoroStore = usePomodoroStore();

const { isLoadingTimer } = storeToRefs(timerStore);
const { importFrom } = storeToRefs(selectorStore);
const { listTimers } = storeToRefs(timerStore);

const $q = useQuasar();

const props = defineProps<{ timers: ITimer[] }>();

const drag = ref(false);


const fragId = ref('');
const name = ref('');
const duration = ref(0);
const color = ref('');
const order = ref(-2);
const isEditing = ref(false);

const futureIdx = ref(0);

// TODO: rTimers에 null 값 추가되는 원인 파악, 방지방안 구현
let rTimers = reactive(listTimers);

watch([rTimers, pomodoroStore.timer, fragId], () => {
  rTimers = reactive(listTimers);
});

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const editPrompt = ref(false);

const remove = (index: number) => {
  $q.notify({
    progress: true,
    message: '해당 스택을 삭제할까요?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          isLoadingTimer.value = false;
          emit('remove', props.timers[index].fragId);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const cancel = (index: number) => {
  name.value = props.timers[index].name;
  duration.value = props.timers[index].duration;
  color.value = props.timers[index].color;

  editPrompt.value = false;
};
const clone = (e: any) => {
  e.draggedContext.duration = 10;
  return e;
};

const checkIndex = (e: any) => {
  futureIdx.value = e.draggedContext.futureIndex;
};

const timerWrapper = (e: any) => {
  const stacksToFrag: IStacksToFrag = {
    stacksToFragId: null,
    order: 0,
    frag: e as ITimer,
  };
  drag.value = false;
  return stacksToFrag;
};

let backupTimer = {} as ITimer;

const update = () => {
  const newTimer = {} as ITimer;

  newTimer.fragId = fragId.value;
  newTimer.name = name.value;
  newTimer.duration = duration.value;
  newTimer.color = color.value;
  newTimer.order = order.value;
  newTimer.isEditing = isEditing.value;

  timerStore.edit(newTimer);

  editPrompt.value = false;
};

const editTimer = (timer: ITimer) => {
  editPrompt.value = true;

  fragId.value = timer.fragId;
  name.value = timer.name;
  duration.value = timer.duration;
  color.value = timer.color;
  order.value = timer.order;
  isEditing.value = timer.isEditing;

  // backupTimer = props.timers[index];
};

// TODO: 드래그와 동시에 order 계산하도록 구현
const computeInitIdx = (e: any) => {
  // window.console.log(e.newDraggableIndex);
  // const setIdx = (e: any) => {
  //   window.console.log(e.to);
  //   builderStore.stackInBuilder.stacksToFrag[e.newDraggableIndex].frag.order =
  //     e.newDraggableIndex;
  // };
  // setIdx(e);

  drag.value = false;
};

// Pomodoro related
const toPomodoro = (timer: ITimer) => {
  // Session storage for saving initial state of stack, timer
  try {
    $q.sessionStorage.set('timer-data', timer);
    pomodoroStore.timer = {} as ITimer;
    pomodoroStore.timer = { ...timer };
    pomodoroStore.mode = 'timer';
    pomodoroStore.state = 'pause';
    pomodoroStore.round = 0;
  } catch (e) {
    console.log(e);
  }
};

const dragOptions = {
  animation: 200,
  group: { name: 'timers', pull: 'clone', put: false },
  disabled: false,
  ghostClass: 'ghost',
};
</script>

<!--TODO: Font 컬러 설정 추가, 입력값 필터링 추가-->
