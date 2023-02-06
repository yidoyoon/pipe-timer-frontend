<template>
  <div class="fit row wrap justify-between q-pa-md">
    <div class="col-10 q-pa-sm">
      <PomodoroCore class="area" />
      <q-space style="height: 1rem" />
      <StackMain class="area" />
    </div>
    <div class="col-2 q-pa-sm">
      <TimerMain class="area" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import PomodoroCore from 'src/core/pomodoro/presentation/component/PomodoroCore.vue';
import TimerMain from 'src/core/timer/presentation/TimerMain.vue';
import StackMain from 'src/core/stack/presentation/StackMain.vue';

const selectorStore = useSelectorStore();
const { editNow } = storeToRefs(selectorStore);
selectorStore.importFrom = 'PomodoroMain';

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

</script>

<style scoped lang="scss">
.area {
  border: solid;
  color: black;
}
</style>
