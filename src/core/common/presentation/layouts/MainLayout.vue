<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row justify-between q-px-none">
        <!-- Navigation links -->
        <IndexNav></IndexNav>
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar shrink>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
        </q-toolbar-title>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          aliquid aspernatur atque beatae doloremque eius, hic id illum iusto,
          modi molestias provident quos sapiente sit temporibus veniam vero
          voluptas, voluptatibus.
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import IndexNav from 'components/NavigationBar.vue';
// import { ref } from 'vue';
//
// const showDrawer = ref(null);
</script>
