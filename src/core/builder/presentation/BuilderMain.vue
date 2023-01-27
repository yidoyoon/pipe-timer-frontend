<template>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 30vh"
    class="row"
  >
    <div class="row">
      <BuilderCore
        :stacks="stack"
        @upsert="upsertTimeStacks"
        @remove="removeStacks"
      />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { IStack, Stacks } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import BuilderCore from 'src/core/builder/presentation/components/BuilderCore.vue';
import { ref } from 'vue';

const stackStore = useStackStore();
const stackStoreRefs = storeToRefs(stackStore);
const timerStore = useTimerStore();
const timerStoreRefs = storeToRefs(timerStore);

timerStore.fetchAll();
stackStore.fetchAll();

const $q = useQuasar();

const { listStacks, isEditingStacks } = stackStoreRefs;

const prompt = ref(false);
const stackName = ref('');
const stack = ref({} as IStack);

const upsertTimeStacks = (stacks: Stacks) => {
  stackStore.edit(stacks);
};
const removeStacks = (id: string) => {
  stackStore.remove(id);
};

const contentStyle = {
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#555',
};

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'black',
};

const thumbStyle = {
  bottom: '0px',
  borderRadius: '0px',
  backgroundColor: 'grey',
  height: '0.5rem',
  opacity: '0.5',
};
</script>
