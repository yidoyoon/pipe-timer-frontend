<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';

const timefragStore = useTimefragStore();
const { canSave } = storeToRefs(timefragStore);

// TODO: Cancel=원상복구, SAVE=데이터베이스로 저장
// Clear all
const cancelEntire = () => {
  timefragStore.reset();
};


</script>
<template>
  <div class="q-pa-md q-gutter-sm row justify-end">
    <q-btn
      @click="cancelEntire"
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
