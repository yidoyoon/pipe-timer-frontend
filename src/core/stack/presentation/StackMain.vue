<template>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 50vh"
  >
    <div
      v-for="stack in listStacks"
      :key="stack"
      class="row justify-between"
    >
      <StackLoader :stack="stack" @remove="removeStacks" />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore }    from 'src/core/stack/infra/store/stack.store';
import StackLoader          from 'src/core/stack/presentation/components/StackLoader.vue';

const stackStore = useStackStore();
const stacksStoreRefs = storeToRefs(stackStore);

stackStore.fetchAll();

const { listStacks } = stacksStoreRefs;

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
