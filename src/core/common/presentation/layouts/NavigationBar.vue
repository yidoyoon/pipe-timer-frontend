<template>
  <!--  logo-->
  <div class="col-xs-12 col-sm-9 col-md-3">
    <q-btn flat to="/" style="margin-left: 0.2rem">
      <q-icon
        name="img:https://img.yibyeongyong.com/public/dummy-logo-white.svg"
        class="fit"
        style="zoom: 11%"
      />
    </q-btn>
  </div>

  <!--  Navigation-->
  <div class="col-xs-12 col-sm-3 col-md-6">
    <q-btn
      v-for="(link, index) in navLinks"
      :key="index"
      flat
      style="color: white"
      :label="link.label"
      :to="link.to"
    />
  </div>

  <!--  Login-->
  <div class="col-xs-12 col-sm-0 col-md-1">
    <q-btn
      outline
      class="q-ml-sm"
      v-if="!isLoggedIn"
      label="LOGIN"
      :to="{ name: 'login' }"
    />

    <!--    &lt;!&ndash;  Signup&ndash;&gt;-->
    <!--    <q-btn-->
    <!--      class="q-ml-lg"-->
    <!--      v-if="!isLoggedIn"-->
    <!--      color="accent"-->
    <!--      label="SIGN UP"-->
    <!--      :to="{ name: 'signup' }"-->
    <!--    />-->

    <!--  Profile-->
    <!--    <q-btn-->
    <!--      v-if="isLoggedIn"-->
    <!--      flat-->
    <!--      style="color: white"-->
    <!--      label="PROFILE"-->
    <!--      :to="{ name: 'profile' }"-->
    <!--    />-->

    <!--  Logout-->
    <q-btn
      class="q-ml-sm"
      v-if="isLoggedIn"
      outline
      label="LOGOUT"
      @click="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { logoutUserFn } from 'src/core/users/infra/http/user.api';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);
const fragStore = useTimefragStore();

let isLoggedIn = computed(() => {
  return userStore.user;
});

const $q = useQuasar();
const router = useRouter();

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    userStore.setUser(null);
    router.push({ name: 'login' });
    userStore.$reset();
    fragStore.$reset();
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
  {
    // icon: 'icon-mat-settings-bk',
    label: 'Create Timer',
    value: 'create-timefrag',
    to: { name: 'create-timefrag' },
  },
  {
    label: 'Create Stacks',
    value: 'create-stacks',
    to: { name: 'create-stacks' },
  },
  {
    label: 'Build Timer',
    value: 'build-timer',
    to: { name: 'build-timer' },
  },
];
</script>
