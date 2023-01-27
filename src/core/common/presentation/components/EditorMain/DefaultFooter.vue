<template>
  <div class="q-ma-sm row justify-between">
    {{ stackInBuilder }}
    <!--    Buttons-->
    <div>
      <q-btn
        label="Create stack"
        color="cyan-6"
        @click="createStacksBtn"
        style="position: relative; top: 0"
        icon="table_rows"
        class="q-mx-sm"
      />

      <q-btn
        label="Create timer"
        color="green-6"
        @click="createStacksBtn"
        style="position: relative; top: 0"
        icon="timer"
      />
    </div>

    <div>
      <q-btn
        @click="saveEdit"
        color="blue"
        label="Save"
        :disable="!canSaveTimers"
        class="q-mx-sm"
      />
      <q-btn
        @click="cancelEdit"
        color="white"
        text-color="black"
        label="cancel"
      />
    </div>

    <!--    CreateStack dialog-->
    <q-dialog
      v-model="caution"
      persistent
      @keyup.enter="
        caution = false;
        prompt = true;
      "
      @keyup.esc.prevent="caution = false"
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
            @keyup.enter.prevent="addStack"
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
            @click="addStack"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { IStack, Stacks } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { ref } from 'vue';

const stackStore = useStackStore();
const stackStoreRefs = storeToRefs(stackStore);
const timerStore = useTimerStore();
const timerStoreRefs = storeToRefs(timerStore);
const builderStore = useBuilderStore();
const builderStoreRefs = storeToRefs(builderStore);

timerStore.fetchAll();
stackStore.fetchAll();

const $q = useQuasar();

const { listStacks, isEditingStacks, timersInStack } = stackStoreRefs;
const { stackInBuilder } = builderStoreRefs;

const prompt = ref(false);
const caution = ref(false);
const stackName = ref('');

const stack = ref({} as IStack);

const createStacksBtn = () => {
  if (isEditingStacks) {
    prompt.value = true;
  } else {
    caution.value = true;
  }
};

const addStack = () => {
  emptyBuilder();
  builderStore.addStack(new Stacks({ name: stackName.value }));
  isEditingStacks.value = true;
};

const emptyBuilder = () => {
  builderStore.emptyBuilder();
};

const upsertTimeStacks = (stacks: Stacks) => {
  stackStore.edit(stacks);
};
const removeStacks = (id: string) => {
  stackStore.remove(id);
};
</script>

<style scoped lang="scss"></style>
