<template>
  <q-item class="fit flat no-shadow cursor-pointer">
    <q-item-section class="row" :style="activeBuilder">
      <div
        v-if="isEditBuilder"
        class="text-subtitle1"
        style="position: absolute; top: 1rem"
      >
        <b>
          Name: {{ props.stack.name }} <br />
          Total duration: {{ getTotalDur }}
        </b>
      </div>
      <div v-else class="text-h5 bold">
        <b>
          스택 리스트에서 스택을 선택하거나 'CREATE STACK' 을 눌러 새로운 스택을
          생성하세요.
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
        class="q-pa-none row no-wrap justify-start builder-group"
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
                height: 7rem;
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
                  <br />
                  <div>
                    Duration: {{ element.frag.duration }}
                    <br />
                    Order: {{ element.frag.order }}
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
        </template>
      </draggable>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
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
