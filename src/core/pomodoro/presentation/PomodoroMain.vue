<template>
  <div class="row wrap justify-center q-pa-md">
    <div class="col-9 q-pa-sm self-center">
      <PomodoroCore class="area" />
    </div>
  </div>

<!--    <q-dialog v-model="showStack" seamless>-->
<!--      <q-card-->
<!--        style="-->
<!--          width: 80vw;-->
<!--          max-width: 80vw;-->
<!--          height: 50vh;-->
<!--          position: absolute;-->
<!--          bottom: 1rem;-->
<!--          left: 1rem;-->
<!--        "-->
<!--      >-->
<!--        <q-card-section class="fit row wrap justify-between q-pa-md">-->
<!--          <div class="col q-pa-sm">-->
<!--            <BuilderMain-->
<!--              class="area"-->
<!--              @click="selectBuilder"-->
<!--              :style="isEditBuilder ? active : {}"-->
<!--            ></BuilderMain>-->
<!--            <q-space style="height: 1rem"></q-space>-->
<!--            <StackMain class="area"></StackMain>-->
<!--          </div>-->
<!--        </q-card-section>-->
<!--      </q-card>-->
<!--    </q-dialog>-->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import PomodoroCore from 'src/core/pomodoro/presentation/component/PomodoroCore.vue';

import { ref } from 'vue';

const selectorStore = useSelectorStore();
const { editNow } = storeToRefs(selectorStore);
selectorStore.importFrom = 'PomodoroMain';

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

const showStack = ref('false');
const showTimer = ref('false');
</script>

<style scoped lang="scss">
.area {
  background-color: #f2f2f2;
  border-radius: 30px;
}
</style>
