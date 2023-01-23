<template>
  <!--  TODO: Frag, Stack 둘다 Q-card에서 Q-table과 virtual-scroll로 바꾸어 구현-->
  <!--  <q-virtual-scroll-->
  <!--    style="max-height: 300px;"-->
  <!--    :items="heavyList"-->
  <!--    separator-->
  <!--    v-slot="{ item, index }"-->
  <!--  >-->
  <q-card
    class="row my-card text-black"
    style="border: 0.3em solid dodgerblue; width: 100vw; height: 100vh;"
  >
    <q-inner-loading :showing="isLoadingStacks" style="z-index: 1">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>

    <!--    // TODO: 수정 표시가 아닌, 더블 클릭으로 수정하도록 변경-->
    <q-card-section>
      <div class="row">
        <p class="text-h6">Stack name: {{ stackName }}</p>
        <q-input
          class="text-h6"
          v-model="stackName"
          :readonly="!isEditing"
          dense
          :borderless="!isEditing"
          :input-style="{
            color: 'black',
            display: 'none',
            width: '80vw',
          }"
        />
      </div>
      <!--      Inner Stack Frags -->
      <div class="row no-wrap" style="height: 7rem; white-space: nowrap">
        <div
          v-for="(f, idx) in fragsInStack"
          :key="f"
          class="col-2 no-padding row no-wrap justify-around"
        >
          <q-card
            class="inner-my-card overflow-hidden text-white cursor-pointer"
            style="background: black; display: inline-block"
          >
            <q-card-section class="q-img-container">
              <div>Name: {{ f._name }}</div>
              <br />
              <div>
                Duration: {{ f._duration }}<br />
                Count: {{ f._count }}
              </div>
            </q-card-section>
          </q-card>
          <div class="row items-center">
            <q-icon
              v-if="idx !== fragsInStack.length - 1"
              name="arrow_right"
              style="font-size: 4rem; color: grey"
            ></q-icon>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { IStacks } from 'src/core/stack/domain/stacks.model';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';
import { ref } from 'vue';

const $q = useQuasar();

const stackStore = useStacksStore();
const { isLoadingStacks, fragsInStack } = storeToRefs(stackStore);

const props = defineProps<{ stacks: IStacks }>();
const emit = defineEmits<{
  (e: 'upsert', data: IStacks): void;
  (e: 'remove', id: string): void;
}>();

// Stack properties
const stackName = ref(props.stacks._name);
const count = ref(props.stacks._count);
const isEditing = ref(props.stacks._isEditing);

// Frag properties
// const fragName
// const fragDurtaion
// const fragColor
// const fragCount

const update = () => {
  const newFrag = {
    ...props.stacks,
    _name: stackName.value,
    _isEditing: !isEditing.value,
  };
  stackStore.edit(newFrag);
};

const upsert = () => {
  emit('upsert', {
    _id: props.stacks._id,
    _name: stackName.value,
    _count: count.value,
    _isEditing: isEditing.value,
  });
  update();
};

const remove = () => {
  $q.notify({
    progress: true,
    message: '해당 스택을 삭제할까요?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          isLoadingStacks.value = false;
          emit('remove', props.stacks._id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const cancel = () => {
  stackName.value = props.stacks._name;

  update();
};
</script>

<style lang="scss" scoped>
.inner-my-card {
  width: 85%;
}

.q-img-container {
  position: relative;
}
.arrow-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
