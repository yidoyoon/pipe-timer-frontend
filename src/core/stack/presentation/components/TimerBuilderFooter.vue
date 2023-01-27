<!--<template>-->
<!--  <div v-if="props.editNow === ''">-->
<!--    <DefaultFooter></DefaultFooter>-->
<!--  </div>-->
<!--  <div v-else-if="props.editNow === 'stack'">-->
<!--    <StackFooter></StackFooter>-->
<!--  </div>-->
<!--  <div v-else-if="props.editNow === 'builder'">-->
<!--    <BuilderFooter></BuilderFooter>-->
<!--  </div>-->
<!--  <div v-else-if="props.editNow === 'timer'">-->
<!--    <TimerFooter></TimerFooter>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { api } from 'boot/axios';-->
<!--import { storeToRefs } from 'pinia';-->
<!--import { useQuasar } from 'quasar';-->
<!--import { useTimerStore } from 'src/core/timer/infra/store/timer.store';-->
<!--import { toRef, watchEffect } from 'vue';-->


<!--const timefragStore = useTimerStore();-->
<!--const { canSaveTimers } = storeToRefs(timefragStore);-->

<!--const $q = useQuasar();-->

<!--const props = defineProps<{ editNow: string }>();-->
<!--const editNowRef = toRef(props, 'editNow');-->

<!--// watchEffect(() => {-->
<!--//   if (editNowRef.value === 'builder') {-->
<!--//   } else if (editNowRef.value === 'stack') {-->
<!--//   } else if (editNowRef.value === 'frag') {-->
<!--//   }-->
<!--// });-->

<!--const rollbackToInitialState = () => {-->
<!--  const initialState = timefragStore.getInitState();-->
<!--  if (!!initialState) {-->
<!--    const data = JSON.parse(<string>(<unknown>initialState));-->
<!--    timefragStore.$reset();-->
<!--    timefragStore.$patch(data);-->
<!--  }-->
<!--};-->

<!--const cancelEdit = () => {-->
<!--  $q.notify({-->
<!--    progress: true,-->
<!--    message: '저장하지 않은 내용은 모두 사라집니다. 계속 하시겠습니까?',-->
<!--    color: 'indigo-5',-->
<!--    multiLine: true,-->
<!--    actions: [-->
<!--      {-->
<!--        label: '확인',-->
<!--        color: 'negative',-->
<!--        handler: rollbackToInitialState,-->
<!--      },-->
<!--      { label: '취소', color: 'white' },-->
<!--    ],-->
<!--  });-->
<!--};-->

<!--// TODO: 최종 저장 전, 인증 정보를 확인하고 진행-->
<!--const saveCurrentState = () => {-->
<!--  const res = api.post('frag/commit', timefragStore.listTimers);-->
<!--  if (!res) {-->
<!--    $q.notify({-->
<!--      message: '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',-->
<!--      color: 'negative',-->
<!--    });-->
<!--  } else {-->
<!--    $q.notify({-->
<!--      message: '저장을 완료했습니다.',-->
<!--      color: 'positive',-->
<!--    });-->
<!--  }-->
<!--  timefragStore.setInitialState();-->
<!--};-->

<!--// TODO: 저장을 성공하면 Initial state 갱신-->
<!--const saveEdit = () => {-->
<!--  $q.notify({-->
<!--    progress: true,-->
<!--    message: '수정 완료된 사항들을 저장합니다. 계속 하시겠습니까?',-->
<!--    color: 'indigo-5',-->
<!--    multiLine: true,-->
<!--    actions: [-->
<!--      {-->
<!--        label: '확인',-->
<!--        color: 'negative',-->
<!--        handler: saveCurrentState,-->
<!--      },-->
<!--      { label: '취소', color: 'white' },-->
<!--    ],-->
<!--  });-->
<!--};-->

<!--const resetButton = () => {-->
<!--  $q.notify({-->
<!--    progress: true,-->
<!--    message: '모든 데이터를 초기화합니다. 계속 하시겠습니까?',-->
<!--    color: 'indigo-5',-->
<!--    multiLine: true,-->
<!--    actions: [-->
<!--      {-->
<!--        label: '확인',-->
<!--        color: 'negative',-->
<!--        handler: resetAll,-->
<!--      },-->
<!--      { label: '취소', color: 'white' },-->
<!--    ],-->
<!--  });-->
<!--};-->

<!--const resetAll = () => {-->
<!--  timefragStore.$reset();-->
<!--};-->

<!--// TODO: 셋팅 페이지 등에 Frag데이터 초기화 기능에 사용-->
<!--// const resetState = () => {-->
<!--//   timefragStore.$reset();-->
<!--//   timefragStore.fetchAll();-->
<!--// };-->
<!--</script>-->
