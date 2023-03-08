<template>
  <q-space style="height: 1rem"/>
  <div class="row wrap justify-center q-pt-lg">
    <div class="col-9 q-pt-lg">
      <PomodoroCore class="area"/>
    </div>
    <div class="col-9 q-pt-md">
      <PomodoroQueue class="area" style="height: 15vh" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import PomodoroCore from 'src/core/pomodoro/presentation/component/PomodoroCore.vue';
import PomodoroQueue from 'src/core/pomodoro/presentation/component/PomodoroQueue.vue';
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import StackMain from 'src/core/stack/presentation/StackMain.vue';
import { isEmptyObj } from 'src/util/is-empty-object.util';

import { ref } from 'vue';

const selectorStore = useSelectorStore();
const stackStore = useStackStore();
const timerStore = useTimerStore();
const builderStore = useBuilderStore();
const userStore = useUserStore();
const { editNow } = storeToRefs(selectorStore);
const { user: userRef } = storeToRefs(useUserStore());
const { user } = userStore;
const { listTimers } = timerStore;
const { listTimers: listTimerRefs } = storeToRefs(timerStore);
const cancelBtnPrompt = ref(false);

selectorStore.importFrom = 'PomodoroMain';

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

const showStack = ref(true);

const $q = useQuasar();

const builderPrompt = ref(false);
const builderWarn = ref(false);
const stackName = ref('');

const toggleStackList = () => {
  showStack.value = !showStack.value;
};

const createStacksBtn = () => {
  if (isEmptyObj(builderStore.getBuilder)) {
    builderPrompt.value = true;
  } else {
    builderWarn.value = true;
  }
};

const createStack = () => {
  builderStore.createStack(stackName.value);
  builderPrompt.value = false;
  editNow.value = 'builder';
};

const saveStackBtn = () => {
  const stack = builderStore.stackInBuilder;
  if (stack.stacksToFrag.length === 0) {
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message:
        '스택이 비어있습니다. 우측 타이머 영역에서 스택을 끌어와 추가해주세요.',
    });
  } else {
    saveStack(stack);
    resetBuilder();
    editNow.value = '';
  }
};

const saveStack = async (stack: IStack) => {
  if (user !== null) {
    await timerStore.saveTimer();
    await builderStore.saveStack(stack);
    await stackStore.fetchAll();
  } else {
    stackStore.stacksIds.push(stack.id);
    stackStore.stacks[stack.id] = stack;
  }
  editNow.value = '';
};

const resetBuilder = () => {
  builderStore.$reset();
  cancelBtnPrompt.value = false;
  editNow.value = '';
};
</script>

<style scoped lang="scss">
.area {
  background-color: #f2f2f2;
  border-radius: 30px;
}

.q-dialog__inner > div {
  box-shadow: none;
  border: solid rgba(0, 0, 0, 0.12) 0.1px;
  // border:solid grey 0.01px;
}
</style>
