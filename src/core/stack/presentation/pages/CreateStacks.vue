<template>
  stacksList:<br /><br />
  {{ stacks }}
  <br />
  canSave: {{ canSaveStacks }} <br />
  isLoading: {{ isLoadingFrags }}
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Stacks } from 'src/core/stack/domain/stacks.model';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';

const stacksStore = useStacksStore();
const stacksStoreRefs = storeToRefs(stacksStore);
const timefragStore = useTimefragStore();
const timefragStoreRefs = storeToRefs(timefragStore);

timefragStore.fetchAll();
// stacksStore.fetchAll();

const { listStacks, stacks, canSaveStacks, isLoading } = stacksStoreRefs;
const { listFrags, timefrags, canSaveFrags, isLoadingFrags } = timefragStoreRefs;

const addTimeStacks = () => {
  stacksStore.add(new Stacks({}));
};
const upsertTimeStacks = (stacks: Stacks) => {
  stacksStore.edit(stacks);
};
const removeStacks = (id: string) => {
  stacksStore.remove(id);
};
</script>
