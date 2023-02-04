<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar class="row justify-between q-px-none">
        <!-- Navigation links -->
        <NavigationBar></NavigationBar>
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NavigationBar from 'src/core/common/presentation/components/NavigationBar.vue';
</script>
