<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';

const timefragStore = useTimefragStore();
const { canSave } = storeToRefs(timefragStore);

const $q = useQuasar();

// Cancel 버튼
// 초기 데이터 fetch시, InitialState를 저장함으로써 백엔드로의 데이터 요청 트래픽을 최소화
// 그러나, Initial State가 변조되면 계속해서 잘못된 데이터로 초기화될 가능성이 있음
// TODO: 로컬데이터 변조 차단방안  구현
const rollbackToInitialState = () => {
  const initialState = timefragStore.getInitialState();
  if (!!initialState) {
    const data = JSON.parse(<string>(<unknown>initialState));
    timefragStore.$reset()
    timefragStore.$patch(data);
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
        handler: rollbackToInitialState,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

// TODO: 셋팅 페이지 등에 Frag데이터 초기화 기능에 사용
// const resetState = () => {
//   timefragStore.$reset();
//   timefragStore.fetchAll();
// };

</script>
<template>
  <div class="q-pa-md q-gutter-sm row justify-end">
    <q-btn
      @click="cancelEdit"
      color="white"
      text-color="black"
      label="cancel"
    />
    <q-btn color="blue" label="Save" :disable="!canSave" />
    <q-tooltip v-if="!canSave" class="text-body2">
      진행중인 설정이 남아있거나, 데이터 로딩이 완료되지 않았습니다.
    </q-tooltip>
  </div>
</template>
