<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat stretch to="/">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
        </q-btn>

        <!--        Navigation-->
        <IndexNav></IndexNav>
      </q-toolbar>
    </q-header>

    <!--    index-->
    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
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
</script>
