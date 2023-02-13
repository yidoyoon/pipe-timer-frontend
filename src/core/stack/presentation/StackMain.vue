<template>
  <div v-if="stackInBuilder.stacksToFrag" class="highlight-stack">
    <BuilderMain />
  </div>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 40vh"
  >
    <div v-if="listStacks.length">
      <div
        v-for="stack in listStacks"
        :key="stack"
        class="row justify-start wrap q-pa-md"
        style="border-bottom: solid 0.1rem grey"
      >
        <StackLoader :stack="stack" @remove="removeStacks" />
      </div>
    </div>
    <div
      v-if="isEmptyObj(stackInBuilder) && selectorStore.editNow !== 'builder'"
      class="text-h6 text-weight-bold"
    >
      스택이 비어있습니다. 타이머를 활용해 스택을 생성해주세요.
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import BuilderMain from 'src/core/builder/presentation/BuilderMain.vue';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import StackLoader from 'src/core/stack/presentation/components/StackLoader.vue';
import { isEmptyObj } from 'src/util/is-empty-object.util';

const stackStore = useStackStore();
const stacksStoreRefs = storeToRefs(stackStore);
const selectorStore = useSelectorStore();
const builderStore = useBuilderStore();
const builderStoreRefs = storeToRefs(builderStore);
const { stackInBuilder } = builderStoreRefs;

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

<style scoped lang="scss">
.highlight-stack {
  border: solid $fourth;
}

.flex-break {
  flex: 1 0 100% !important;
}
</style>
