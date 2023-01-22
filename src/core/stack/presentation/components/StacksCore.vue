<template>
  hello

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { IStacks } from 'src/core/stack/domain/stacks.model';
import { useStacksStore } from 'src/core/stack/infra/store/stacks.store';
import { ref } from 'vue';

const $q = useQuasar();

const stackStore = useStacksStore();
const { isLoading } = storeToRefs(stackStore);


const props = defineProps<{ stacks: IStacks }>();
const emit = defineEmits<{
  (e: 'upsert', data: IStacks): void;
  (e: 'remove', id: string): void;
}>();

const name = ref(props.stacks._name);
const count = ref(props.stacks._count);
const isEditing = ref(props.stacks._isEditing);

const update = () => {
  const newFrag = {
    ...props.stacks,
    _name: name.value,
    _isEditing: !isEditing.value,
  };
  stackStore.edit(newFrag);
};

const upsert = () => {
  emit('upsert', {
    _id: props.stacks._id,
    _name: name.value,
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
          isLoading.value = false;
          emit('remove', props.stacks._id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const cancel = () => {
  name.value = props.stacks._name;

  update();
};
</script>
