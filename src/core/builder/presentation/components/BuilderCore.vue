<template>
  <q-item class="fit flat no-shadow cursor-pointer">
    <q-item-section class="row" :style="activeBuilder">
      <div
        v-if="isEditBuilder"
        class="text-subtitle1"
        style="position: absolute; top: 1rem"
      >
        <b>
          Name: {{ props.stack._name }} <br />
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
        v-if="props.stack._data !== undefined"
        :list="rBuilder"
        item-key="_id"
        :group="{ name: 'timers' }"
        class="q-pa-none row no-wrap justify-start"
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
              >
                <q-card-section>
                  <div>Name: {{ element._name }}</div>
                  <br />
                  <div>
                    Duration: {{ element._duration }}<br />
                    Count: {{ element._count }}
                  </div>
                </q-card-section>
              </q-card>
              <div class="row items-center">
                <q-icon
                  v-if="!!props.stack && index !== props.stack._data.length - 1"
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
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { computed, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable';

const $q = useQuasar();

const builderStore = useBuilderStore();
const { getTotalDur, isEditBuilder } = storeToRefs(builderStore);
const selectorStore = useSelectorStore();

const props = defineProps<{ stack: IStack }>();
const rBuilder = computed(() => {
  return reactive(props.stack._data);
});

// const emit = defineEmits<{
//   (e: 'upsert', data: IStack): void;
//   (e: 'remove', id: string): void;
// }>();

// Stack properties
// const stackName = ref(props.stack._name);
// const count = ref(props.stack._count);
// const isEditing = ref(props.stack._isEditing);
// const stackData = ref(props.stack._data);

const activeBuilder = {
  minHeight: '14rem',
  // position: 'absolute',
  // top: '0px',
  // bottom: '0px',
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
