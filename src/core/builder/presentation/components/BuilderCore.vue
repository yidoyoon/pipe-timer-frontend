<template>
  <q-item class="row fit justify-between q-pa-none q-ma-none">
    <q-item-section class="row justify-between">
      <div
        v-if="isEditBuilder"
        class="text-subtitle1"
        style="position: absolute; width: 100%"
      >
        <div
          class="row justify-between"
          style="background-color: #007777; color: white"
        >
          <div class="row justify-between">
            <div class="q-ml-sm">{{ props.stack.name }}</div>
            <div>
              <q-btn
                v-show="!isEmptyObj(stackInBuilder)"
                icon="edit"
                dense
                flat
                size="sm"
                @click="editStackBtn"
                style="position: relative; bottom: 2px"
              />
            </div>
          </div>
          <div class="q-mx-sm fixed-right">Total - {{ totalDuration }}</div>
        </div>
        <div
          v-if="!stackInBuilder.stacksToFrag.length"
          class="text-h6 text-weight-bold q-ml-sm"
        >
          우측 타이머 영역에서 추가하려는 타이머를 이곳에 드래그해주세요.
        </div>
      </div>

      <q-space v-if="!stackInBuilder.stacksToFrag.length" class="q-my-lg" />

      <draggable
        v-if="props.stack.stacksToFrag !== undefined"
        :list="rBuilder"
        v-bind="dragOptions"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        class="q-my-lg q-mx-md row no-wrap builder-group"
        @start="drag = true"
        @end="drag = false"
        item-key="order fragId"
        :removeOnSpill="true"
        :onSpill="removeDraggedItem"
      >
        <template #item="{ element, index }">
          <div>
            <!--      Inner Builder-->
            <div
              class="row no-wrap flat justify-between"
              style="
                height: 5rem;
                white-space: nowrap;
                position: relative;
                bottom: -2rem;
              "
            >
              <q-card
                class="inner-my-card text-white cursor-pointer flat justify-between"
                style="background: black; display: inline-block"
                :style="colorExtractor(element.frag)"
              >
                <q-card-section>
                  <div>{{ element.frag.name }}</div>
                  <div>
                    <q-icon name="timer" />
                    {{ timeFormatter(element.frag.duration) }}
                  </div>
                </q-card-section>
              </q-card>
              <div class="row items-center">
                <q-icon
                  v-if="arrowDrawer(index)"
                  name="arrow_right"
                  style="font-size: 4rem; color: dimgrey"
                ></q-icon>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </q-item-section>
  </q-item>

  <!--  Edit stack prompt-->
  <q-dialog v-model="editStackPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">새로운 스택 이름</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="stackName"
          autofocus
          @keyup.enter.prevent="editStack"
          @keyup.esc.prevent="editStackPrompt = false"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="취소" v-close-popup @click="cancelEdit" />
        <q-btn
          flat
          label="확인"
          color="green"
          v-close-popup
          @click="editStack"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { LocalStorage } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { computed, reactive, ref } from 'vue';
import _ from 'lodash';
import draggable from 'vuedraggable';

const builderStore = useBuilderStore();
const { getTotalDur, isEditBuilder, stackInBuilder } =
  storeToRefs(builderStore);
const editStackPrompt = ref(false);

const props = defineProps<{ stack: IStack }>();
const rBuilder = computed(() => {
  return reactive(props.stack.stacksToFrag);
});

const stackName = ref('');
const drag = ref(false);

const arrowDrawer = (index: number) => {
  return !!props.stack && index !== props.stack.stacksToFrag.length - 1;
};

const removeDraggedItem = (e: any) => {
  builderStore.stackInBuilder.stacksToFrag.splice(e.oldIndex, 1);
};

const timeFormatter = (duration: string | number) => {
  return computed(() => {
    return dayjs.duration(+duration, 'seconds').format('HH:mm:ss');
  });
};

const totalDuration = computed(() => {
  const formatted = dayjs
    .duration(getTotalDur.value, 'seconds')
    .format('HH:mm:ss');
  return formatted;
});

const editStackBtn = () => {
  editStackPrompt.value = true;
};

const editStack = () => {
  builderStore.stackInBuilder.name = stackName.value;
  editStackPrompt.value = false;
};

const cancelEdit = () => {
  const backup = LocalStorage.getItem('builder-backup') as IStack;
  if (!!backup) {
    builderStore.stackInBuilder = backup;
    LocalStorage.set('builder-backup', {});
  }
};

const dragOptions = {
  animation: 200,
  group: { name: 'timers' },
  disabled: false,
  ghostClass: 'ghost',
};

const colorExtractor = (timer: ITimer) => {
  return {
    background: timer.color,
  };
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.inner-my-card {
  width: 10rem;
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
