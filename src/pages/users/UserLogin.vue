<template>
  <div class="q-pa-md absolute-center" style="min-width: 400px">
    <div class="text-h4 q-mb-lg">Login</div>
    <q-form
      @submit.prevent="onSubmit"
      class="q-gutter-sm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-input
        filled
        v-model="email"
        label="Email"
        placeholder="account@example.com"
        :error-message="emailError"
        :error="!!emailError"
      />
      <q-input
        filled
        v-model="password"
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        placeholder="8 - 128 characters"
        :error-message="passwordError"
        :error="!!passwordError"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <div class="row">
        <q-btn label="SIGN IN" type="submit" color="primary" />
        <div class="q-space"></div>
        <q-btn label="CANCEL" to="/" color="primary" flat class="q-ml-sm" />
      </div>
      <div class="text-body2">
        계정이 없다면 회원가입 해주세요.
        <a href="/signup">회원가입</a>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useMutation, useQuery, useQueryClient } from 'vue-query';
import { useField, useForm } from 'vee-validate';
import { useAuthStore } from 'src/router/authStore';
import { toFormValidator } from '@vee-validate/zod';
import { getMeFn, loginUserFn } from 'src/api/authApi';
import { ILoginInput } from 'src/api/userTypes';
import * as zod from 'zod';
import * as gc from 'src/api/globalConst'

const router = useRouter();

const authStore = useAuthStore();

const $q = useQuasar();

const loginSchema = toFormValidator(
  zod.object({
    email: zod
      .string()
      .min(1, gc.accountMsg.EMPTY_USER_EMAIL)
      .email(gc.accountMsg.INVALID_USER_EMAIL),
    password: zod.string().min(gc.accountVar.CHECK_EMPTY, gc.accountMsg.EMPTY_USER_PASSWORD),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: loginSchema,
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const isPwd = ref(true);

const authResult = useQuery('api', () => getMeFn(), {
  enabled: false,
  retry: 1,
});

const queryClient = useQueryClient();

const { isLoading, mutate } = useMutation(
  (credentials: ILoginInput) => loginUserFn(credentials),
  {
    onError: (error) => {
      const errorMsg = (<any>error).response.data.error;
      const responseMsg = (<any>error).response.data.message;
      if (Array.isArray(errorMsg)) {
        errorMsg.forEach((el: any) => {
          $q.notify({
            type: 'negative',
            message: el.message,
            icon: 'warning',
          });
        });
      } else {
        $q.notify({
          type: 'negative',
          message: responseMsg,
          icon: 'warning',
        });
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries('api');
      router.push({ name: 'index' });
      $q.notify({
        type: 'positive',
        message: gc.accountMsg.SUCCESS_USER_LOGIN,
        icon: 'warning',
      });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.email,
    password: values.password,
  });
  resetForm();
});

onBeforeUpdate(() => {
  if (authResult.isSuccess.value) {
    const authUser = Object.assign({}, authResult.data.value?.data.user);
    authStore.setAuthUser(authUser);
  }
});
</script>

<style lang="scss">
.text-caption {
  color: $negative;
}
</style>
