<template>
  <div v-if="routineInBuilder.routineToTimer" class="highlight-routine">
    <BuilderMain />
  </div>
  <q-scroll-area
    :thumb-style="thumbStyle"
    :content-style="contentStyle"
    :content-active-style="contentActiveStyle"
    style="height: 40vh"
  >
    <div v-if="listRoutine.length">
      <div
        v-for="routine in listRoutine"
        :key="routine"
        class="row justify-start wrap q-pa-md"
        style="border-bottom: solid 0.1rem grey"
      >
        <RoutineLoader :routine="routine" @remove="removeRoutine" />
      </div>
    </div>
    <div
      v-if="
        routineStore.listRoutine.length === 0 &&
        !routineInBuilder.routineToTimer
      "
      class="text-h6 text-weight-bold"
    >
      <span>
        루틴이 비어있습니다. 루틴을 생성하려면 좌측 상단의 '+' 버튼을
        눌러주세요.
      </span>
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import BuilderMain from 'src/core/builder/presentation/BuilderMain.vue';
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import RoutineLoader from 'src/core/routines/presentation/components/RoutineLoader.vue';
import { useUserStore } from 'src/core/users/infra/store/user.store';

const routineStore = useRoutineStore();
const routineStoreRefs = storeToRefs(routineStore);
const builderStore = useBuilderStore();
const builderStoreRefs = storeToRefs(builderStore);
const { routineInBuilder } = builderStoreRefs;
const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);

if (!!userStoreRef.user) {
  routineStore.fetchAll();
}

const { listRoutine } = routineStoreRefs;

const removeRoutine = (id: string) => {
  routineStore.remove(id);
};

const contentStyle = {
  backgroundColor: 'transparent',
  color: 'black',
};

const contentActiveStyle = {
  backgroundColor: 'transparent',
  color: 'black',
};

const thumbStyle = {
  bottom: '0px',
  borderRadius: '0px',
  backgroundColor: 'grey',
  height: '1rem',
  opacity: '0.5',
};
</script>

<style lang="scss" scoped>
.highlight-routine {
  border: solid $fourth;
}

.flex-break {
  flex: 1 0 100% !important;
}
</style>
