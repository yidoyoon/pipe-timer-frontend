<template>
  <q-card class="no-shadow my-card flat" style="background: transparent">
    <div class="text-subtitle1 text-black q-px-md">
      <!--      Stack name: {{ _name }} | Total duration: 객체 데이터 자체에서 가져오도록 수정<br>-->
      <!--      listStackData : {{listStacksData}}-->
      <!--      StacksId: {{stacksIds}}-->
      this: {{ [props.stacks] }}
    </div>
    <q-card-section>
      <div
        class="row justify-between no-wrap"
        style="height: 7rem; white-space: nowrap"
      >
        <div
          v-for="(s, idx) in props.stacks._data"
          :key="s"
          class="q-pa-none row no-wrap"
        >
          <q-card
            class="inner-my-card text-white flat"
            style="background: black; display: inline-block; width: 12vw"
          >
            <q-card-section class="q-img-container">
              <div>Name: {{ s._name }}</div>
              <br />
              <div>
                Duration: {{ s._duration }}<br />
                Count: {{ s._count }}
              </div>
            </q-card-section>
          </q-card>
          <div class="row items-center">
            <q-icon
              v-if="idx !== props.stacks._data.length - 1"
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
import { storeToRefs }   from 'pinia';
import { IStack }        from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const timefragStore = useTimerStore();
const stacksStore = useStackStore();

const { isLoadingStacks } = storeToRefs(stacksStore);

const $q = useQuasar();

const props = defineProps<{ stacks: IStack }>();
const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const _name = ref(props.stacks._name);
const _count = ref(props.stacks._count);
const _isEditing = ref(props.stacks._isEditing);

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

// 클릭한 스택이 수정을 위해 빌더로 이동
const toBuilder = () => {};
</script>
