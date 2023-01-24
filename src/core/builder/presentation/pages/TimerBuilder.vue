<template>
  <div class="fit row wrap justify-between q-pa-md">
    <!--    TODO: 현재 작업중인 영역에 border 표시 되도록 구현-->
    <div class="child col-9 q-pa-sm">
      <StackStorage style="border: solid"></StackStorage>
      <q-space style="height:1rem"></q-space>
      <StackBuild style="border: solid"></StackBuild>
    </div>
    <div class="child col-3 q-pa-sm">
      <FragStorage style="border: solid"></FragStorage>
    </div>
  </div>
</template>

<script setup lang="ts">
import FragStorage from 'src/core/builder/presentation/components/FragStorage.vue';
import StackBuild from 'src/core/builder/presentation/components/StackBuild.vue';
import StackStorage from 'src/core/builder/presentation/components/StackStorage.vue';
</script>
