<template>
  <div class="row justify-end">
    <q-btn
      label="Create stack"
      color="primary"
      @click="createStacksButton"
      style="position: relative; top: 0"
      icon-right="add"
    />
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
          <q-btn flat label="Confirm" v-close-popup @click="addTimeStacks" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="row q-pb-lg">
    <div v-for="s in listStacks" :key="s">
      <StacksCore
        :stacks="s"
        @upsert="upsertTimeStacks"
        @remove="removeStacks"
      />
    </div>
  </div>
  <q-footer>
    <StackButtons></StackButtons>
  </q-footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { Stacks } from 'src/core/stack/domain/stacks.model';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';
import StackButtons from 'src/core/stack/presentation/components/StackButtons.vue';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';
import StacksCore from 'src/core/stack/presentation/components/StacksCore.vue';
import { ref } from 'vue';

const stacksStore = useStacksStore();
const stacksStoreRefs = storeToRefs(stacksStore);
const timefragStore = useTimefragStore();
const timefragStoreRefs = storeToRefs(timefragStore);

timefragStore.fetchAll();
stacksStore.fetchAll();

const $q = useQuasar();

const {
  listStacks,
  isEditingStacks,
} = stacksStoreRefs;

const prompt = ref(false);
const stackName = ref('');

const createStacksButton = () => {
  if (isEditingStacks.value) {
    $q.notify({
      message: '현재 설정 중인 스택이 있습니다.',
      color: 'negative',
    });
    return;
  }
  prompt.value = true;
};

const addTimeStacks = () => {
  stacksStore.addStack(new Stacks({ name: stackName.value }));
  isEditingStacks.value = true;
  prompt.value = false;
};
const upsertTimeStacks = (stacks: Stacks) => {
  stacksStore.edit(stacks);
};
const removeStacks = (id: string) => {
  stacksStore.remove(id);
};
</script>
