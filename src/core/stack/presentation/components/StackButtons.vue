<script setup lang="ts">
import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';

const stacksStore = useStacksStore();
const { canSaveStacks } = storeToRefs(stacksStore);

const $q = useQuasar();

// Cancel 버튼
// 초기 데이터 fetch시, InitialState를 저장함으로써 백엔드로의 데이터 요청 트래픽을 최소화
// 그러나, Initial State가 변조되면 계속해서 잘못된 데이터로 초기화될 가능성이 있음
// TODO: 로컬데이터 변조 차단방안 구현
const resetToInitial = () => {
  const initialState = stacksStore.getInitialState();
  if (!!initialState) {
    const data = JSON.parse(<string>(<unknown>initialState));
    stacksStore.$reset();
    stacksStore.$patch(data);
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
const saveCurrentState = () => {
  const res = api.post('frag/commit', stacksStore.listStacks);
  if (!res) {
    $q.notify({
      message: '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',
      color: 'negative',
    });
  } else {
    $q.notify({
      message: '저장을 완료했습니다.',
      color: 'positive',
    });
  }
  stacksStore.setInitialState();
};

// TODO: 저장을 성공하면 Initial state 갱신
const saveEdit = () => {
  $q.notify({
    progress: true,
    message: '수정 완료된 사항들을 저장합니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: saveCurrentState,
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
  stacksStore.$reset();
};
</script>
<template>
  <div class="q-pa-md q-gutter-sm row justify-between">
    <q-btn @click="resetButton" color="negative" label="Reset" />
    <div>
      <q-btn
        @click="saveEdit"
        color="blue"
        label="Save"
        :disable="!canSaveStacks"
        class="q-mx-md"
      />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>
    <q-tooltip v-if="!canSaveStacks" class="text-body2">
      진행중인 설정이 남아있거나, 데이터 로딩이 완료되지 않았습니다.
    </q-tooltip>
  </div>
</template>
