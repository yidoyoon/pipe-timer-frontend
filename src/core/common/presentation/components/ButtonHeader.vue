<template>
  <div class="row justify-end q-gutter-md q-py-sm">
    <div class="q-pr-sm">
      <q-btn
        v-if="!userStoreRefs.user.value"
        to="/login"
        label="login"
        outline
        color="black"
      />
      <q-btn
        v-else
        @click="handleLogout"
        label="logout"
        outline
        color="black"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { useTimerStore } from 'src/core/timers/infra/store/timer.store';
import { logoutUserFn } from 'src/core/users/infra/http/user.api';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

const $q = useQuasar();
const router = useRouter();

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);
const timerStore = useTimerStore();
const routineStore = useRoutineStore();
const { user } = userStoreRefs;

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    userStore.setUser(null);
    router.push({ name: 'login' });
    userStore.$reset();
    timerStore.$reset();
    routineStore.$reset();
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
  timerStore.$reset();
  routineStore.$reset();
  panelStore.$reset();
  logoutUser();
};
</script>
