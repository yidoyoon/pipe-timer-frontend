<!--TODO: Font 컬러 설정 추가, 입력값 필터링 추가-->
<template>
  <q-card
    class="my-card text-white cursor-pointer"
    style="background: black"
    @click="toStack"
    v-ripple
  >
    <q-inner-loading :showing="isLoadingFrags" style="z-index: 1">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>

    <!--    // TODO: 수정 표시가 아닌, 더블 클릭으로 수정하도록 변경-->
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

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';
import { ITimefrag } from 'src/core/timefrag/domain/timefrag';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const timefragStore = useTimefragStore();
const stacksStore = useStacksStore();

const { isLoadingFrags } = storeToRefs(timefragStore);

const $q = useQuasar();

const props = defineProps<{ timefrag: ITimefrag }>();
const emit = defineEmits<{
  (e: 'upsert', data: ITimefrag): void;
  (e: 'remove', id: string): void;
}>();

const _name = ref(props.timefrag._name);
const _duration = ref(props.timefrag._duration);
const _count = ref(props.timefrag._count);
const _color = ref(props.timefrag._color);
const _isEditing = ref(props.timefrag._isEditing);

// TODO: 아래 코드처럼 emit 사용하여 데이터 전송하지않고 컴포넌트에서 처리하도록 다른 함수들 수정
const update = () => {
  const newFrag = {
    ...props.timefrag,
    _name: _name.value,
    _duration: _duration.value,
    _color: _color.value,
    _isEditing: !_isEditing.value,
  };
  timefragStore.edit(newFrag);
};

const upsert = () => {
  emit('upsert', {
    _id: props.timefrag._id,
    _name: _name.value,
    _duration: _duration.value,
    _count: _count.value,
    _color: _color.value,
    _isEditing: _isEditing.value,
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
          isLoadingFrags.value = false;
          emit('remove', props.timefrag._id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const cancel = () => {
  _name.value = props.timefrag._name;
  _duration.value = props.timefrag._duration;
  _color.value = props.timefrag._color;

  update();
};

const toStack = () => {};
</script>
