<template>
  <q-header>
    <!--    Login button-->
    <q-page-sticky position="top-right" :offset="[30, 10]" class="z-top">
      <q-btn v-if="!user" to="/login" label="login" outline color="black" />
      <q-btn v-else @click="logoutUser" label="logout" outline color="black" />
    </q-page-sticky>

  </q-header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ref } from 'vue';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { logoutUserFn } from 'src/core/users/infra/http/user.api';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

const $q = useQuasar();
const router = useRouter();

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);
const fragStore = useTimerStore();
const { user } = userStoreRefs;

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
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
</script>
