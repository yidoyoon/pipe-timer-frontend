<template>
  <div class="row wrap justify-center q-pa-md">
    <div class="col-9 q-pt-lg">
      <PomodoroCore class="area" />
    </div>
    <div class="col-9 q-pt-md">
      <PomodoroQueue class="area" style="height: 15vh" />
    </div>
  </div>

  <!--    Open stack list button-->
  <q-page-sticky
    v-if="!showStack"
    position="bottom"
    class="z-top"
    style="left: 120px; bottom: 0.5rem"
  >
    <q-btn
      @click="toggleStackList"
      icon="keyboard_double_arrow_up"
      color="black"
      flat
      round
    />
  </q-page-sticky>

  <!--  Stack list dialog-->
  <q-dialog
    v-model="showStack"
    transition-show="slide-up"
    transition-hide="slide-down"
    seamless
    position="bottom"
  >
    <q-card style="width: 70vw; max-width: 70vw; height: 45vh">
      <q-bar
        style="
          background-color: transparent;
          border-bottom: solid 0.1rem #002222;
        "
      >
        <!--        Add stack button-->
        <q-btn
          v-if="!stackInBuilder.stacksToFrag"
          @click="createStacksBtn"
          :disable="!listTimers.length"
          dense
          icon="add"
          flat
          label="create stack"
          text-color="positive"
          class="q-pr-sm"
        >
          <q-tooltip anchor="top middle" self="top middle">
            <div v-if="listTimers.length">스택을 생성합니다.</div>
            <div v-else>스택을 생성하려면 최소 1개의 타이머가 필요합니다.</div>
          </q-tooltip>
        </q-btn>
        <!--        Add stack button-->
        <q-btn
          v-if="stackInBuilder.stacksToFrag"
          @click="saveStackBtn"
          dense
          icon="save"
          flat
          label="save"
          text-color="positive"
          class="q-pr-sm"
        />
        <q-space />
        <q-btn dense flat icon="minimize" @click="showStack = false" />
      </q-bar>
      <q-card-section class="row wrap justify-between q-py-none">
        <div class="col">
          <StackMain></StackMain>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!--    CreateStack dialog-->
  <q-dialog
    v-model="builderWarn"
    persistent
    @keyup.enter="
      builderWarn = false;
      builderPrompt = true;
    "
    @keyup.esc.prevent="builderWarn = false"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning"></q-icon>
          Confirmation
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          현재 작업중인 스택이 있습니다. 스택 생성을 계속할 경우 저장되지 않은
          내용은 삭제됩니다. 계속하시겠습니까?
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="red"
          v-close-popup
          @click="builderPrompt = true"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  Create stack prompt-->
  <q-dialog v-model="builderPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Stack name</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="stackName"
          autofocus
          @keyup.enter.prevent="createStack"
          @keyup.esc.prevent="builderPrompt = false"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="green"
          v-close-popup
          @click="createStack"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
const { editNow } = storeToRefs(selectorStore);
const { user } = storeToRefs(useUserStore());
const stackStore = useStackStore();
const timerStore = useTimerStore();
const { listTimers } = timerStore;
const builderStore = useBuilderStore();
const cancelBtnPrompt = ref(false);

selectorStore.importFrom = 'PomodoroMain';

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

const showStack = ref(false);
const showTimer = ref(false);

const $q = useQuasar();

const builderPrompt = ref(false);
const builderWarn = ref(false);
const timerPrompt = ref(false);

const stackName = ref('');
const timerName = ref('');
const duration = ref(0);
const color = ref('#000000ff');

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
      color: 'yellow-6',
      icon: 'warning',
      textColor: 'black',
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
  await builderStore.saveStack(stack);
  await stackStore.fetchAll();
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
