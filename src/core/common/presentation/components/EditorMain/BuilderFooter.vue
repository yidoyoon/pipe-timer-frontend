<template>
  <div class="q-ma-sm row justify-between">
    <!--    Buttons-->
    <div>
      <q-btn
        label="Save stack"
        color="cyan-6"
        @click="saveStackBtn"
        style="position: relative; top: 0"
        icon="table_rows"
        class="q-mr-sm"
      />

      <q-btn
        label="Edit stack name"
        color="green-6"
        @click="editStackBtn"
        style="position: relative; top: 0"
        icon="edit"
        class="q-mr-sm"
      />
    </div>

    <div>
      <q-btn
        @click="cancelBtn"
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

  <!--  Edit stack prompt-->
  <q-dialog v-model="editStackPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Input new stack name</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="stackName"
          autofocus
          @keyup.enter.prevent="editStack"
          @keyup.esc.prevent="editStackPrompt = false"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="green"
          v-close-popup
          @click="editStack"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  Builder prompt-->
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
          @keyup.enter.prevent="saveStack"
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
          @click="saveStack"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--  Cancel Prompt-->
  <q-dialog
    v-model="cancelBtnPrompt"
    persistent
    @keyup.enter="cancelBtnPrompt = false"
    @keyup.esc.prevent="builderWarn = false"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning"></q-icon>
          Warning
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          현재 작업 중인 스택이 있습니다. 취소할 경우, 해당 스택은 제거됩니다.
          계속하시겠습니까?
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="red"
          v-close-popup
          @click="resetBuilder"
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
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { ref } from 'vue';

const stackStore = useStackStore();
const timerStore = useTimerStore();
const builderStore = useBuilderStore();
const selectorStore = useSelectorStore();
const { editNow } = storeToRefs(selectorStore);

timerStore.fetchAll();
stackStore.fetchAll();

const $q = useQuasar();

const builderPrompt = ref(false);
const builderWarn = ref(false);
const editStackPrompt = ref(false);
const cancelBtnPrompt = ref(false);

const stackName = ref('');

const editStackBtn = () => {
  editStackPrompt.value = true;
};

const editStack = () => {
  builderStore.stackInBuilder.name = stackName.value;
  editStackPrompt.value = false;
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

const cancelBtn = () => {
  cancelBtnPrompt.value = true;
};

const resetBuilder = () => {
  builderStore.$reset();
  cancelBtnPrompt.value = false;
  editNow.value = '';
};
</script>

<style scoped lang="scss"></style>
