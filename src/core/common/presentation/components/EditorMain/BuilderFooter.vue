<template>
  <div class="q-pa-md q-gutter-sm row justify-between">
    <q-btn
      label="Create stack"
      color="green"
      @click="createStacksBtn"
      style="position: relative; top: 0"
      icon-right="add"
    />

    <q-dialog v-model="caution" persistent>
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
            @click="prompt = true"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Stack name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="stackName"
            autofocus
            @keyup.enter.prevent="addTimeStacks"
            @keyup.esc.prevent="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Confirm"
            color="green"
            v-close-popup
            @click="addTimeStacks"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-btn @click="resetButton" color="negative" label="Reset" />
    <div>
      <q-btn
        @click="saveEdit"
        color="blue"
        label="Save"
        :disable="!canSaveTimers"
        class="q-mx-md"
      />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>
    <!--    <q-tooltip v-if="!!fragsInStack" class="text-body2">-->
    <!--      진행중인 설정이 남아있거나, 데이터 로딩이 완료되지 않았습니다.-->
    <!--    </q-tooltip>-->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs }   from 'pinia';
import { useQuasar }    from 'quasar';
import {IStack, Stacks} from 'src/core/stack/domain/stack.model';
import {useStackStore}  from 'src/core/stack/infra/store/stack.store.ts';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { ref }           from 'vue';

const stacksStore = useStackStore();
const stacksStoreRefs = storeToRefs(stacksStore);
const timefragStore = useTimerStore();
const timefragStoreRefs = storeToRefs(timefragStore);

timefragStore.fetchAll();
stacksStore.fetchAll();

const $q = useQuasar();

const { listStacks, isEditingStacks, timersInStack } = stacksStoreRefs;

const prompt = ref(false);
const caution = ref(false);
const stackName = ref('');
const stack = ref({} as IStack);

const createStacksBtn = () => {
  if (isEditingStacks.value) {
    caution.value = true;
  } else {
    prompt.value = true;
  }
};

const addTimeStacks = () => {
  emptyBuilder();
  stacksStore.addStack(new Stacks({ name: stackName.value }));
  isEditingStacks.value = true;
};

const emptyBuilder = () => {
  stacksStore.emptyBuilder();
};

const upsertTimeStacks = (stacks: Stacks) => {
  stacksStore.edit(stacks);
};
const removeStacks = (id: string) => {
  stacksStore.remove(id);
};
</script>
