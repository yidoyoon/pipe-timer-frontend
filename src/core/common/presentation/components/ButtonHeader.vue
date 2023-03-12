<template>
    <!--    Login button-->
    <q-page-sticky position="top-right" :offset="[50, 10]" class="z-top">
      <q-btn v-if="!user" to="/login" label="login" outline color="black" />
      <q-btn
        v-else
        @click="handleLogout"
        label="logout"
        outline
        color="black"
      />
    </q-page-sticky>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { logoutUserFn } from 'src/core/users/infra/http/user.api';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

const $q = useQuasar();
const router = useRouter();

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);
const timerStore = useTimerStore();
const stackStore = useStackStore();
const { user } = userStoreRefs;

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    userStore.setUser(null);
    router.push({ name: 'login' });
    userStore.$reset();
    timerStore.$reset();
    stackStore.$reset();
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
  userStore.$reset();
  logoutUser();
};
</script>
