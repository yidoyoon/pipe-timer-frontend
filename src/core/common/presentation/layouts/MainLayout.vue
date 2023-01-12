<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row justify-between q-px-none">
        <!-- Navigation links -->
        <NavigationBar></NavigationBar>
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
//
// const showDrawer = ref(null);
import NavigationBar from 'src/core/common/presentation/layouts/NavigationBar.vue';
</script>
