<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TimefragCore from 'src/core/timefrag/presentation/components/TimefragCore.vue';
import { ulid } from 'ulid';
import { ITimefrag } from 'src/core/timefrag/infra/store/timefrag.store';
import { useTimefragStore } from 'src/core/timefrag/infra/store/timefrag.store';
import SaveTimefragsDB      from 'src/core/timefrag/presentation/components/SaveTimefragsDB.vue';

const timefragStore = useTimefragStore();
const timefragStoreRefs = storeToRefs(timefragStore);
const { list, timefrags, canSave, isLoading} = timefragStoreRefs;

timefragStore.fetchAll();

const addTimefrag = () => {
  timefragStore.add({
    id: ulid(),
    name: '',
    duration: 0,
    color: '',
    count: 0,
    userId: '',
    isEditing: false,
  });
};
const upsertTimefrag = (timefrag: ITimefrag) => {
  timefragStore.edit(timefrag);
};

const removeTimefrag = (id: string) => {
  timefragStore.remove(id);
};
</script>

<template>
  productList:<br /><br />
  {{ timefrags }}
  <br />
  canSave: {{ canSave }} <br>
  isLoading: {{ isLoading }}

  <div class="row justify-end q-pb-sm">
    <q-btn dense icon="add" round color="positive" @click="addTimefrag" />
  </div>
  <div class="row q-col-gutter-lg">
    <div v-for="timefrag in list" :key="timefrag" class="col-6 col-md-3">
      <TimefragCore
        :timefrag="timefrag"
        @upsert="upsertTimefrag"
        @remove="removeTimefrag"
      />
    </div>
  </div>

  <q-footer>
    <SaveTimefragsDB/>
  </q-footer>
</template>
