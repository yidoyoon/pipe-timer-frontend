<template>
  <q-card
    class="no-shadow my-card flat"
    style="background: transparent"
    @dblclick="
      importFrom === 'EditorMain'
        ? toBuilderHandler(props.stack)
        : toPomodoro(props.stack)
    "
  >
    <div class="text-subtitle1 text-black q-px-md">
      <!--      {{ stack.stacksToFrag }}-->
      <b>Name: {{ props.stack.name }}</b>
    </div>
    <q-card-section class="q-py-none">
      <div
        v-if="props.stack.stacksToFrag !== undefined"
        class="row justify-between no-wrap"
        style="height: 5rem; white-space: nowrap"
      >
        <div
          v-for="(t, index) in props.stack.stacksToFrag"
          :key="t.frag.fragId"
          class="q-pa-none row no-wrap"
        >
          <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup @click="toBuilder(props.stack)">
                <q-item-section>수정</q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item clickable v-close-popup @click="remove">
                <q-item-section style="color: #8b1c00">삭제</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

          <q-card
            class="inner-my-card text-white flat"
            style="display: inline-block; width: 12vw"
            :style="colorExtractor(t.frag)"
          >
            <q-card-section class="q-img-container">
              <div>{{ t.frag.name }}</div>
              <div>
                <q-icon name="timer" /> {{ timeFormatter(t.frag.duration)
                }}<br />
              </div>
            </q-card-section>
          </q-card>
          <div class="row items-center">
            <q-icon
              v-if="arrowDrawer(index)"
              name="arrow_right"
              style="font-size: 4rem; color: grey"
            ></q-icon>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!--  toBuilder prompt-->
  <q-dialog
    v-model="toBuilderWarnPrompt"
    persistent
    @keyup.enter="toBuilder(props.stack)"
    @keyup.esc.prevent="toBuilderWarnPrompt = false"
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
          현재 빌더에 작업 중인 스택이 있습니다. 저장하지 않은 작업 내용은
          삭제됩니다. 계속하시겠습니까?
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="red"
          v-close-popup
          @click="toBuilder(props.stack)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { useQuasar } from 'quasar';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { ref } from 'vue';

const stackStore = useStackStore();
const builderStore = useBuilderStore();
const selectorStore = useSelectorStore();
const pomodoroStore = usePomodoroStore();

const { isLoadingStacks } = storeToRefs(stackStore);
const { importFrom } = storeToRefs(selectorStore);

const $q = useQuasar();

const toBuilderPrompt = ref(false);
const toBuilderWarnPrompt = ref(false);

const props = defineProps<{ stack: IStack }>();
const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const remove = () => {
  $q.notify({
    progress: true,
    message: '해당 스택 삭제합니다. 계속 하시겠습니까?',
    position: 'bottom',
    multiLine: true,
    icon: 'warning',
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          isLoadingStacks.value = false;
          emit('remove', props.stack.id);
        },
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const toBuilderHandler = (stack: IStack) => {
  if ('stacksToFrag' in builderStore.stackInBuilder) {
    toBuilderWarnPrompt.value = true;
  } else {
    toBuilder(stack);
  }
};

const toBuilder = (stack: IStack) => {
  builderStore.$reset();
  builderStore.stackInBuilder = stack;
  toBuilderPrompt.value = false;
};

const arrowDrawer = (index: number) => {
  return !!props.stack && index !== props.stack.stacksToFrag.length - 1;
};

const colorExtractor = (timer: ITimer) => {
  return {
    background: timer.color,
  };
};

// Pomodoro related
const toPomodoro = (stack: IStack) => {
  // Session storage for saving initial state of stack, timer
  try {
    $q.sessionStorage.set('pomodoro-data', stack);
    pomodoroStore.stack = { ...stack };
    pomodoroStore.mode = 'stack';
    pomodoroStore.state = 'pause';
    pomodoroStore.round = 0;
  } catch (e) {
    console.log(e);
  }
};

const timeFormatter = (duration: string | number) => {
  return computed(() => {
    return dayjs.duration(+duration, 'seconds').format('HH:mm:ss');
  });
};
</script>
