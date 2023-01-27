<template>
  <div class="fit row wrap justify-between q-pa-md">
    <!--    TODO: 현재 작업중인 영역에 border 표시 되도록 구현-->
    <div class="col-9 q-pa-sm">
      <StackMain class="area"></StackMain>
      <q-space style="height: 1rem"></q-space>
      <BuilderMain class="area"></BuilderMain>
    </div>
    <div class="col-3 q-pa-sm">
      <TimerMain class="area"></TimerMain>
    </div>
  </div>
  <q-footer>
    <div v-if="editNow === ''">
      <DefaultFooter></DefaultFooter>
    </div>
    <!--    <div v-else-if="editNow === 'stack'">-->
    <!--      <StackFooter></StackFooter>-->
    <!--    </div>-->
    <!--    <div v-else-if="editNow === 'builder'">-->
    <!--      <BuilderFooter></BuilderFooter>-->
    <!--    </div>-->
    <!--    <div v-else-if="editNow === 'timer'">-->
    <!--      <TimerFooter></TimerFooter>-->
    <!--    </div>-->
  </q-footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import TimerMain from 'src/core/timer/presentation/TimerMain.vue';
import BuilderMain from 'src/core/builder/presentation/BuilderMain.vue';
import StackMain from 'src/core/stack/presentation/StackMain.vue';
import { onMounted, ref } from 'vue';

import DefaultFooter from 'src/core/common/presentation/components/EditorMain/DefaultFooter.vue';
import BuilderFooter from 'src/core/common/presentation/components/EditorMain/BuilderFooter.vue';
import TimerFooter from 'src/core/common/presentation/components/EditorMain/TimerFooter.vue';
import StackFooter from 'src/core/common/presentation/components/EditorMain/StackFooter.vue';

const selectorStore = useSelectorStore();
const { onStack, onBuilder, onTimer } = storeToRefs(selectorStore);

const editNow = ref('');

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

// TODO: 선택영역 외 클릭하면 선택이 풀리도록 구현
// onMounted(() = {
//
// })
</script>

<style scoped lang="scss">
.area {
  border: solid;
  color: black;
}
</style>
