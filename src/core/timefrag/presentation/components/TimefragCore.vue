<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';
import type { ITimefrag } from 'src/core/timefrag/infra/store/timefrag.store';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps<{ timefrag: ITimefrag }>();
const emit = defineEmits<{
  (e: 'upsert', data: ITimefrag): void;
  (e: 'remove', id: string): void;
}>();

const timefragStore = useTimefragStore();
const { isLoading } = storeToRefs(timefragStore);

const $q = useQuasar();

const _name = ref(props.timefrag.name);
const _duration = ref(props.timefrag.duration);
const _count = ref(props.timefrag.count);
const _color = ref(props.timefrag.color);
const _isEditing = ref(props.timefrag.isEditing);

// TODO: 아래 코드처럼 emit 사용하여 데이터 전송하지않고 컴포넌트에서 처리하도록 다른 함수들 수정
const update = () => {
  const newCar = {
    ...props.timefrag,
    name: _name.value,
    duration: _duration.value,
    color: _color.value,
    isEditing: !_isEditing.value,
  };
  timefragStore.edit(newCar);
};

const upsert = () => {
  emit('upsert', {
    id: props.timefrag.id,
    userId: props.timefrag.userId,
    name: _name.value,
    duration: _duration.value,
    count: _count.value,
    color: _color.value,
    isEditing: _isEditing.value,
  } as ITimefrag);
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
          isLoading.value = false;
          emit('remove', props.timefrag.id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const cancel = () => {
  _name.value = props.timefrag.name;
  _duration.value = props.timefrag.duration;
  _color.value = props.timefrag.color;

  update();
};
</script>

<!--TODO: Font 컬러 설정 추가, 입력값 필터링 추가-->
<template>
  <q-card
    class="my-card text-white overflow-hidden"
    style="background: radial-gradient(circle, #4b6e8c 0%, #4b6e8c 100%)"
  >
    <q-inner-loading :showing="isLoading" style="z-index: 1">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>

    <q-card-section>
      <div class="row justify-between">
        <div class="row items-center q-gutter-x-xs col-6">
          <q-btn
            v-if="_isEditing"
            dense
            flat
            round
            size="sm"
            color="negative"
            icon="delete"
            @click="remove"
          />
          <div class="col-6">
            <q-input
              class="text-h6"
              v-model="_name"
              :readonly="!_isEditing"
              dense
              :borderless="!_isEditing"
              :input-style="{ color: 'white', display: 'inline' }"
            />
          </div>
        </div>
        <div>
          <q-btn
            v-if="!_isEditing"
            unelevated
            dense
            round
            flat
            size="sm"
            color="white"
            icon="edit"
            @click="update"
          />
          <template v-else>
            <q-btn
              unelevated
              dense
              round
              flat
              size="sm"
              color="white"
              icon="close"
              @click="cancel"
            />
            <q-btn
              unelevated
              dense
              round
              size="sm"
              color="positive"
              icon="check"
              @click="upsert"
            />
          </template>
        </div>
      </div>
      <q-input
        v-model="_duration"
        :readonly="!_isEditing"
        dense
        :borderless="!_isEditing"
        :input-style="{ color: 'white' }"
      />
      <q-input
        v-model="_color"
        :readonly="!_isEditing"
        dense
        :borderless="!_isEditing"
        :input-style="{ color: 'white' }"
      />
      <q-input
        v-model="_count"
        readonly
        dense
        borderless
        :input-style="{ color: 'white' }"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
