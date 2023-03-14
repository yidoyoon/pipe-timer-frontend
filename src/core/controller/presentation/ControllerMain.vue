<template>
  <q-space style="height: 1rem" />
  <div class="row wrap justify-center q-pt-lg">
    <div class="col-9 q-pt-lg">
      <ControllerCore class="area" />
    </div>
    <div class="col-9 q-pt-md">
      <ControllerQueue class="area" style="height: 15vh" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ControllerCore  from 'src/core/controller/presentation/component/ControllerCore.vue';
import ControllerQueue from 'src/core/controller/presentation/component/ControllerQueue.vue';

</script>

<style scoped lang="scss">
.area {
  background-color: #f2f2f2;
  border-radius: 30px;
}

.q-dialog__inner > div {
  box-shadow: none;
  border: solid rgba(0, 0, 0, 0.12) 0.1px;
  // border:solid grey 0.01px;
}
</style>
