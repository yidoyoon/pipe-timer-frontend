<template>
  <div class="row q-ma-sm justify-between">
    <div>
      <q-btn
        @click="removeStack = !removeStack"
        color="negative"
        label="remove stack"
      />
    </div>
    <div>
      <q-btn @click="cancel" color="white" text-color="black" label="cancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';

const selectorStore = useSelectorStore();
const { removeStack } = storeToRefs(selectorStore);

const cancel = () => {
  selectorStore.editNow = '';
};
</script>
