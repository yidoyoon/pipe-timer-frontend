<template>
  <div class="q-pa-sm row justify-end">
    <div>
      <q-btn
        @click="saveTimerBtn"
        color="blue"
        label="Save Timer"
        icon="timer"
        class="q-mx-sm"
      />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>
    <!--    <q-tooltip v-if="!canSaveTimers" class="text-body2">-->
    <!--      진행중인 설정이 남아있거나, 데이터 로딩이 완료되지 않았습니다.-->
    <!--    </q-tooltip>-->
  </div>
</template>

<script setup lang="ts">
// Cancel 버튼
// 초기 데이터 fetch시, InitialState를 저장함으로써 백엔드로의 데이터 요청 트래픽을 최소화
// 그러나, Initial State가 변조되면 계속해서 잘못된 데이터로 초기화될 가능성이 있음
// TODO: 로컬데이터 변조 차단방안 구현
import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore }    from 'src/core/stack/infra/store/stack.store';
import { useTimerStore }    from 'src/core/timer/infra/store/timer.store';
const stackStore = useStackStore();

const stackStoreRefs = storeToRefs(stackStore);
const timerStore = useTimerStore();
const timerStoreRefs = storeToRefs(timerStore);
const builderStore = useBuilderStore();
const builderStoreRefs = storeToRefs(builderStore);
const selectorStore = useSelectorStore();

const { editNow } = storeToRefs(selectorStore);
const { listStacks, canSaveStack } = stackStoreRefs;

const $q = useQuasar();

const resetToInitial = () => {
  const initialState = stackStore.getInitState();
  if (!!initialState) {
    const data = JSON.parse(<string>(<unknown>initialState));
    stackStore.$reset();
    stackStore.$patch(data);
  }
};

const cancelEdit = () => {
  $q.notify({
    progress: true,
    message: '저장하지 않은 내용은 모두 사라집니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: resetToInitial,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

// TODO: 최종 저장 전, 인증 정보를 확인하고 진행
const saveTimer = () => {
  timerStore.saveTimer();
};

// TODO: 저장을 성공하면 Initial state 갱신
const saveTimerBtn = () => {
  $q.notify({
    progress: true,
    message: '수정 완료된 사항들을 저장합니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: saveTimer,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const resetButton = () => {
  $q.notify({
    progress: true,
    message: '모든 데이터를 초기화합니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: resetAll,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const resetAll = () => {
  stackStore.$reset();
};
</script>
