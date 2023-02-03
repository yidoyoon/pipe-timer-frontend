<template>
  <q-scroll-area style="height: 30vh">
    <div class="row">
      <BuilderCore :stack="newStack" />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import BuilderCore from 'src/core/builder/presentation/components/BuilderCore.vue';
import { computed } from 'vue';

const builderStore = useBuilderStore();

const newStack = computed(() => {
  return builderStore.stackInBuilder;
});
</script>
