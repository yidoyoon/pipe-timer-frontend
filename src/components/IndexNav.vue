<template>
  <!--  Navigation-->
  <div class="q-ml-lg">
    <template v-for="(link, index) in navLinks" :key="index">
      <q-btn flat style="color: white" :label="link.label" :to="link.to" />
    </template>
  </div>

  <!--  Spacing-->
  <div class="q-space"></div>

  <!--  Log in-->
  <q-btn v-if="!isLoggedIn" color="secondary" label="LOG IN" to="/login" />

  <!--  Profile-->
  <q-btn v-if="isLoggedIn" color="info" label="PROFILE" to="/profile" />

  <!--  Logout-->
  <q-btn
    class="q-ml-sm"
    v-if="isLoggedIn"
    color="negative"
    label="LOGOUT"
    @click="handleLogout"
  />
</template>

<script setup lang="ts">
import { createApp } from 'vue';
import { useAuthStore } from 'src/router/authStore';
import { useMutation } from 'vue-query';
import { logoutUserFn } from 'src/api/authApi';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const app = createApp({});
app.component('IndexNav');

const authStore = useAuthStore();
const isLoggedIn = authStore.authUser;
// const isLoggedIn = true;

const $q = useQuasar();
const router = useRouter();

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    authStore.setAuthUser(null);
    router.push({ name: 'index' });
  },
  onError: (error) => {
    if (Array.isArray((<any>error).response.data.error)) {
      (<any>error).response.data.error.forEach((el: any) =>
        $q.notify({
          type: 'warning',
          message: el.message,
        })
      );
    } else {
      $q.notify({
        type: 'negative',
        message: (<any>error).response.data.message,
      });
    }
  },
});

const handleLogout = () => {
  logoutUser();
};

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
