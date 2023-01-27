<template>
  <!--  TODO: Frag, Stack 둘다 Q-card에서 Q-table과 virtual-scroll로 바꾸어 구현-->
  <!--  <q-virtual-scroll-->
  <!--    style="max-height: 300px;"-->
  <!--    :items="heavyList"-->
  <!--    separator-->
  <!--    v-slot="{ item, index }"-->
  <!--  >-->
  <q-card class="fit flat no-shadow my-card cursor-pointer">
    <!--    <q-inner-loading :showing="isLoadingStacks" style="z-index: 1">-->
    <!--      <q-spinner size="50px" color="primary" />-->
    <!--    </q-inner-loading>-->

    <q-card-section class="row" style="height: 29.5vh">
      <div class="text-h6">
        Stack name: {{ stackName }} | Total duration: {{ getTotalDuration }}
      </div>
      <q-space class="flex-break"></q-space>
      <!--      Inner Stack Frags -->
      <div
        class="row no-wrap flat justify-between"
        style="height: 7rem; white-space: nowrap"
      >
        <div
          v-for="(f, idx) in timersInStack"
          :key="f"
          class="q-pa-none row no-wrap justify-around"
        >
          <q-card
            class="inner-my-card text-white cursor-pointer flat justify-between"
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
              v-if="idx !== timersInStack.length - 1"
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
import { useQuasar }     from 'quasar';
import { IStack }        from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { ref } from 'vue';

const $q = useQuasar();

const stackStore = useStackStore();
const { isLoadingStacks, timersInStack, getTotalDuration, listStacks } =
  storeToRefs(stackStore);

const props = defineProps<{ stacks: IStack }>();
const emit = defineEmits<{
  (e: 'upsert', data: IStack): void;
  (e: 'remove', id: string): void;
}>();

// Stack properties
const stackName = ref(props.stacks._name);
const count = ref(props.stacks._count);
const isEditing = ref(props.stacks._isEditing);
const stackData = ref(props.stacks._data);

const totalDuration = ref(0);

const update = () => {
  const newFrag = {
    ...props.stacks,
    _name: stackName.value,
    _data: stackData.value,
    _isEditing: !isEditing.value,
  };
  stackStore.edit(newFrag);
};

const upsert = () => {
  emit('upsert', {
    _id: props.stacks._id,
    _name: stackName.value,
    _count: count.value,
    _data: stackData.value,
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
  width: 15rem;
}

.q-img-container {
  position: relative;
}
.arrow-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.flex-break {
  flex: 1 0 100% !important;
}
.row {
  .flex-break {
    height: 0 !important;
  }
}
.column {
  .flex-break {
    width: 0 !important;
  }
}
</style>
