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
  <!--  <div class="col-xs-12 col-sm-3 col-md-6">-->
  <div>
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
  <!--  <div class="col-xs-12 col-sm-0 col-md-1">-->
  <div>
    <q-btn
      outline
      class="q-ml-sm"
      v-if="!user"
      label="LOGIN"
      :to="{ name: 'login' }"
    />

    <!--  Logout-->
    <q-btn
      class="q-ml-sm"
      v-if="user"
      outline
      label="LOGOUT"
      @click="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTimerStore } from 'src/core/timers/infra/store/timer.store';
import { logoutUserFn } from 'src/core/users/infra/http/user.api';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);
const timerStore = useTimerStore();

const { user } = userStoreRefs;

const $q = useQuasar();
const router = useRouter();

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    userStore.setUser(null);
    router.push({ name: 'login' });
    userStore.$reset();
    timerStore.$reset();
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
  // {
  //   icon: 'icon-mat-menu_book-bk',
  //   label: 'Guide',
  //   value: 'guide',
  //   to: { name: 'guide' },
  // },
  {
    label: 'Pomodoro',
    value: 'controller',
    to: { name: 'controller' },
  },
  {
    label: 'Editor',
    value: 'editor',
    to: { name: 'editor' },
  },
];
</script>
