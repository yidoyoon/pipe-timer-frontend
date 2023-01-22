<template>
  <div class="row justify-end q-pb-sm">
    <q-btn dense icon="add" round color="positive" @click="addTimefrag" />
  </div>
  <div class="row q-col-gutter-lg q-pa-lg">
    <div v-for="timefrag in listFrags" :key="timefrag" class="col-12 col-lg-12">
      <TimefragCore
        :timefrag="timefrag"
        @upsert="upsertTimefrag"
        @remove="removeTimefrag"
      />
    </div>
  </div>
  <q-footer>
    <SaveTimefrag />
  </q-footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Timefrag } from 'src/core/timefrag/domain/timefrag';
import TimefragCore from 'src/core/timefrag/presentation/components/TimefragCore.vue';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';
import SaveTimefrag from 'src/core/timefrag/presentation/components/SaveTimefrag.vue';

const timefragStore = useTimefragStore();
const timefragStoreRefs = storeToRefs(timefragStore);

timefragStore.fetchAll();

const { listFrags, timefrags, canSaveFrags, isLoadingFrags } = timefragStoreRefs;
const addTimefrag = () => {
  timefragStore.add(new Timefrag({}));
};
const upsertTimefrag = (timefrag: Timefrag) => {
  timefragStore.edit(timefrag);
};
const removeTimefrag = (id: string) => {
  timefragStore.remove(id);
};
</script>
