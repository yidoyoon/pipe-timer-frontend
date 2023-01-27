<template>
  <div class="row q-pa-md justify-between">
    <div>
      <q-btn @click="toBuilderBtn" color="negative" label="Remove" />
    </div>
    <div>
      <q-btn outline @click="toBuilderBtn" label="Move to Builder" />
      <q-btn
        outline
        @click="toBuilderBtn"
        label="Rename Stack"
        class="q-mx-md"
      />
    </div>
    <div>
      <q-btn
        @click="saveEdit"
        color="blue"
        label="Save Stack"
        :disable="!canSaveTimers"
        class="q-mx-md"
      />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>
    <q-tooltip v-if="!canSaveTimers" class="text-body2">
      진행중인 설정이 남아있거나, 데이터 로딩이 완료되지 않았습니다.
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useQuasar }   from 'quasar';
import {useStackStore} from 'src/core/stack/infra/store/stack.store.ts';

const $q = useQuasar();
const stackStore = useStackStore();

const toBuilderBtn = () => {};
</script>
