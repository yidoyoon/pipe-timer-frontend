<template>
  <div class="q-pa-md q-gutter-sm row justify-between">
    <q-btn @click="resetButton" color="negative" label="Reset" />
    <div>
      <q-btn
        @click="saveEdit"
        color="blue"
        label="Save"
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

<script setup lang="ts"></script>
