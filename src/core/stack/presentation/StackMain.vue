<template>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 50vh;"
  >
    <div class="row">
      <div v-for="stacks in listStacks" :key="stacks">
        <StackLoader :stacks="stacks" @remove="removeStacks" />
        <q-space style="height: 1rem"></q-space>
      </div>
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import StackLoader  from 'src/core/stack/presentation/components/StackLoader.vue';

const stackStore = useStackStore();
const stacksStoreRefs = storeToRefs(stackStore);

stackStore.fetchAll();

const { listStacks, stacks, stacksIds, timersInStack, listStacksData } =
  stacksStoreRefs;

const removeStacks = (id: string) => {
  stackStore.remove(id);
};


const contentStyle = {
  backgroundColor: 'transparent',
  color: 'black',
};

const contentActiveStyle = {
  backgroundColor: 'transparent',
  color: 'black',
};

const thumbStyle = {
  bottom: '0px',
  borderRadius: '0px',
  backgroundColor: 'grey',
  height: '1rem',
  opacity: '0.5',
};
</script>
