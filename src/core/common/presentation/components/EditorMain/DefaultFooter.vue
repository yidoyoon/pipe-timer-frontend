<template>
  <div class="q-ma-sm row justify-between">
    <!--    Buttons-->
    <div>
      <q-btn
        label="Create stack"
        color="cyan-6"
        @click="createStacksBtn"
        style="position: relative; top: 0"
        icon="table_rows"
        class="q-mr-sm"
      />
      <q-btn
        label="Create timer"
        color="green-6"
        @click="createTimerBtn"
        style="position: relative; top: 0"
        icon="timer"
        class="q-mr-sm"
      />
      <q-btn
        label="Remove stack"
        color="negative"
        @click="removeStack = !removeStack"
        class="q-mr-sm"
      />
      <q-btn label="reset" color="negative" @click="resetStores" />
    </div>

    <div>
      <q-btn @click="saveEdit" color="blue" label="Save" class="q-mx-sm" />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>

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
  </div>

  <!--  Timer prompt-->
  <q-dialog v-model="timerPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create new timer</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="timerName"
          autofocus
          @keyup.enter.prevent="createTimer"
          @keyup.esc.prevent="timerPrompt = false"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="green"
          v-close-popup
          @click="createTimer"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  Builder prompt (Create Stack)-->
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
import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { Timer } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { isEmptyObj } from 'src/util/is-empty';
import { ref } from 'vue';

const stackStore = useStackStore();

const stackStoreRefs = storeToRefs(stackStore);
const timerStore = useTimerStore();
const builderStore = useBuilderStore();
const selectorStore = useSelectorStore();

const { editNow, removeStack } = storeToRefs(selectorStore);
// const { canSaveTimers } = timerStoreRefs;

timerStore.fetchAll();
stackStore.fetchAll();

const $q = useQuasar();

const builderPrompt = ref(false);
const builderWarn = ref(false);
const timerPrompt = ref(false);

const stackName = ref('');
const timerName = ref('');

const createTimerBtn = () => {
  timerPrompt.value = true;
};

const createTimer = () => {
  timerStore.add(new Timer({ name: timerName.value }));
  timerPrompt.value = false;
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

const resetStores = () => {
  stackStore.$reset();
  builderStore.$reset();
  timerStore.$reset();
};

// Cancel 버튼
// 초기 데이터 fetch시, InitialState를 저장함으로써 백엔드로의 데이터 요청 트래픽을 최소화
// 그러나, Initial State가 변조되면 계속해서 잘못된 데이터로 초기화될 가능성이 있음
// TODO: 로컬데이터 변조 차단방안 구현
const resetToInitial = () => {
  const initialState = stackStore.getInitState();
  if (!!initialState) {
    const data = JSON.parse(<string>(<unknown>initialState));
    stackStore.$reset();
    stackStore.$patch(data);
  }
};

// const activeRemoveStack = () => {
//
// }

const cancelEdit = () => {
  $q.notify({
    progress: true,
    message: '저장하지 않은 내용은 모두 사라집니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: resetToInitial,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

// TODO: 최종 저장 전, 인증 정보를 확인하고 진행
const saveTimersBtn = () => {
  const res = api.post('frag/commit', stackStore.listStacks);
  if (!res) {
    $q.notify({
      message: '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',
      color: 'negative',
    });
  } else {
    $q.notify({
      message: '저장을 완료했습니다.',
      color: 'positive',
    });
    stackStore.fetchAll();
  }
  stackStore.setInitialState();
};

// TODO: 저장을 성공하면 Initial state 갱신
const saveEdit = () => {
  $q.notify({
    progress: true,
    message: '수정 완료된 사항들을 저장합니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: saveTimersBtn,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const resetButton = () => {
  $q.notify({
    progress: true,
    message: '모든 데이터를 초기화합니다. 계속 하시겠습니까?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: resetAll,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const resetAll = () => {
  stackStore.$reset();
};
</script>

<style scoped lang="scss"></style>
