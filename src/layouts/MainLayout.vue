<template>
  <q-layout view="lHh Lpr lFf" class="min-height: unset;">
    <q-header elevated>
      <q-toolbar shrink>
        <q-btn flat to="/" style="margin: 0; padding: 0">
          <q-icon
            name="img:https://img.yibyeongyong.com/public/dummy-logo-white.svg"
            class="fit"
            style="zoom: 11%"
          />
        </q-btn>

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
import IndexNav from 'components/IndexNav.vue';
// import { ref } from 'vue';
//
// const showDrawer = ref(null);
</script>
