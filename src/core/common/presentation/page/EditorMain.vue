<template>
  <div class="fit row wrap justify-between q-pa-md">
    <div class="col-9 q-pa-sm">
      <StackMain class="area"></StackMain>
      <q-space style="height: 1rem"></q-space>
      <BuilderMain
        class="area"
        @click="selectBuilder"
        :style="isEditBuilder ? active : {}"
      ></BuilderMain>
    </div>
    <div class="col-3 q-pa-sm">
      <TimerMain class="area" @click="selectTimer"></TimerMain>
    </div>
  </div>
  <q-footer>
    <div v-if="editNow === ''">
      <DefaultFooter></DefaultFooter>
    </div>
    <div v-else-if="isEditBuilder ? editNow === 'builder' : (editNow = '')">
      <BuilderFooter></BuilderFooter>
    </div>
    <div v-else-if="editNow === 'stack'">
      <StackFooter></StackFooter>
    </div>
    <div v-else-if="editNow === 'timer'">
      <TimerFooter></TimerFooter>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import TimerMain from 'src/core/timer/presentation/TimerMain.vue';
import BuilderMain from 'src/core/builder/presentation/BuilderMain.vue';
import StackMain from 'src/core/stack/presentation/StackMain.vue';

import DefaultFooter from 'src/core/common/presentation/components/EditorMain/DefaultFooter.vue';
import BuilderFooter from 'src/core/common/presentation/components/EditorMain/BuilderFooter.vue';
import TimerFooter from 'src/core/common/presentation/components/EditorMain/TimerFooter.vue';
import StackFooter from 'src/core/common/presentation/components/EditorMain/StackFooter.vue';

const selectorStore = useSelectorStore();
const { editNow } = storeToRefs(selectorStore);

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

const selectStack = () => {
  selectorStore.selectStack();
  editNow.value = 'stack';
};
const selectBuilder = () => {
  selectorStore.selectBuilder();
  editNow.value = 'builder';
};
const selectTimer = () => {
  selectorStore.selectTimer();
  editNow.value = 'timer';
};

const active = {
  borderColor: 'skyblue',
  borderWidth: '0.3rem',
};

// watchEffect(async () => {
//   if (isEditBuilder) {
//     editNow.value = 'builder';
//   }
// });
</script>

<style scoped lang="scss">
.area {
  border: solid;
  color: black;
}
</style>
