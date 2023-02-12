<template>
  <div class="fit row wrap justify-between q-pa-md" @click="selectNone">
    <div class="col-10 q-pa-sm">
      <BuilderMain
        class="area"
        @click.stop="selectBuilder"
        :style="isEditBuilder ? active : {}"
      ></BuilderMain>
      <q-space style="height: 1rem"></q-space>
      <StackMain class="area" @click.stop="selectStack"></StackMain>
    </div>
    <div class="col-2 q-pa-sm">
      <TimerMain class="area" @click.stop="selectTimer"></TimerMain>
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

selectorStore.importFrom = 'EditorMain';

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

const selectNone = () => {
  editNow.value = '';
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
  background-color: #f2f2f2;
  border-radius: 30px;
  border: solid transparent;
}
</style>
