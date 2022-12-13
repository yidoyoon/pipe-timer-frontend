<template>
  <!--  Navigation-->
  <div class="q-ml-lg">
    <template v-for="(link, index) in navLinks" :key="index">
      <q-btn flat style="color: white" :label="link.label" :to="link.to" />
    </template>
  </div>

  <!--  Spacing-->
  <div class="q-space"></div>

  <!--        Log in-->
  <q-btn v-if="!isLoggedIn" color="secondary" label="LOG IN" to="/login" />

  <!--  Logout-->
  <q-btn
    class="q-ml-lg"
    v-if="isLoggedIn"
    color="negative"
    label="LOGOUT"
    to="/"
  />
</template>

<script setup lang="ts">
import { createApp } from 'vue';

const app = createApp({});
app.component('IndexNav');

const isLoggedIn = false;

const navLinks = [
  {
    icon: 'icon-mat-menu_book-bk',
    label: 'Guide',
    value: 'guide',
    to: '/guide',
  },
  {
    icon: 'icon-mat-assessment-bk',
    label: 'Dashboard',
    value: 'dashboard',
    to: '/dashboard',
  },
  {
    icon: 'icon-mat-settings-bk',
    label: 'Settings',
    value: 'settings',
    to: '/settings',
  },
];
</script>
