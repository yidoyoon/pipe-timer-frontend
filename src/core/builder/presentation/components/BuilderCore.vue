<template>
  <q-item class="row fit justify-between q-pa-none q-ma-none">
    <q-item-section class="row justify-between">
      <div style="color: black">
      </div>
      <div
        v-if="isEditBuilder"
        class="text-subtitle1"
        style="position: absolute; width: 100%"
      >
        <div
          class="row justify-between"
          style="background-color: #007777; color: white"
        >
          <div class="q-mx-md">{{ props.stack.name }}</div>
          <div class="q-mx-md">Total duration - {{ timeFormatter }}</div>
        </div>
      </div>
      <div v-else class="text-h6 bold">
        <b class="q-ml-sm">
          우측의 타이머 리스트에서 타이머를 끌어와 주세요.
        </b>
      </div>

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
                  <div>Name: {{ element.frag.name }}</div>
                  <div>Duration: {{ element.frag.duration }}</div>
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
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { computed, reactive, ref } from 'vue';
import draggable from 'vuedraggable';

const builderStore = useBuilderStore();
const { getTotalDur, isEditBuilder } = storeToRefs(builderStore);

const props = defineProps<{ stack: IStack }>();
const rBuilder = computed(() => {
  return reactive(props.stack.stacksToFrag);
});

const drag = ref(false);

const arrowDrawer = (index: number) => {
  return !!props.stack && index !== props.stack.stacksToFrag.length - 1;
};

const removeDraggedItem = (e: any) => {
  builderStore.stackInBuilder.stacksToFrag.splice(e.oldIndex, 1);
};

const timeFormatter = computed(() => {
  const formatted = dayjs
    .duration(getTotalDur.value, 'seconds')
    .format('HH:mm:ss');
  return formatted;
});

const activeBuilder = {
  minHeight: '14rem',
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
