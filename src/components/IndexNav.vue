<template>
  <!--  Navigation-->

  <div class="q-ml-lg">
    <template v-for="(link, index) in navLinks" :key="index">
      <q-btn
        flat
        style="color: white"
        :icon="link.icon"
        :label="link.label"
        :to="link.to"
      />
    </template>
  </div>

  <!--  Spacing-->
  <div class="q-space"></div>

  <!--  Login-->
  <q-btn
    outline
    class="q-ml-lg"
    v-if="!isLoggedIn"
    label="LOG IN"
    :to="{ name: 'login' }"
  />

  <!--  Signup-->
  <q-btn
    class="q-ml-lg"
    v-if="!isLoggedIn"
    color="accent"
    label="SIGN UP"
    :to="{ name: 'signup' }"
  />

  <!--  Profile-->
  <q-btn
    v-if="isLoggedIn"
    color="info"
    label="PROFILE"
    :to="{ name: 'profile' }"
  />

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
import { useAuthStore } from 'stores/authStore';
import { logoutUserFn } from 'src/api/authApi';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => {
  return authStore.authUser;
});

const $q = useQuasar();
const router = useRouter();

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    authStore.setAuthUser(null);
    router.push({ name: 'login' });
  },
  onError: (error) => {
    const errMsg = (error as any).response.data.error;
    const response = (error as any).response.data;

    if (Array.isArray(errMsg)) {
      errMsg.forEach((el: any) =>
        $q.notify({
          type: 'negative',
          message: el.message,
          icon: 'warning',
        })
      );
    } else {
      $q.notify({
        type: 'negative',
        message: response,
        icon: 'warning',
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
    to: { name: 'guide' },
  },
  {
    icon: 'icon-mat-assessment-bk',
    label: 'Dashboard',
    value: 'dashboard',
    to: { name: 'dashboard' },
  },
  {
    icon: 'icon-mat-settings-bk',
    label: 'Settings',
    value: 'settings',
    to: { name: 'settings' },
  },
];
</script>
