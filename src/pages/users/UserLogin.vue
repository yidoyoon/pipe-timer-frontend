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
        debounce="500"
      />
      <q-input
        filled
        v-model="password"
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        placeholder="8 - 128 characters"
        :error-message="passwordError"
        :error="!!passwordError"
        debounce="500"
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
import {ILoginInput}                             from 'src/type-defs/userTypes';
import { onBeforeUpdate, ref }                   from 'vue';
import { useRouter }                             from 'vue-router';
import { useQuasar }                             from 'quasar';
import { useField, useForm }                     from 'vee-validate';
import { useAuthStore }                          from 'stores/authStore';
import { toFormValidator }                       from '@vee-validate/zod';
import { getMeFn, loginUserFn }                  from 'src/api/authApi';
import * as zod                                  from 'zod';
import * as gc                                   from 'src/api/globalConst';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

const $q = useQuasar();
const isPwd = ref(true);
const router = useRouter();

const authStore = useAuthStore();
const userData = authStore.authUser;

const loginSchema = toFormValidator(
  zod.object({
    email: zod
      .string()
      .min(1, gc.userMsg.EMPTY_USER_EMAIL)
      .email(gc.userMsg.INVALID_USER_EMAIL),
    password: zod.string().min(gc.CHECK_EMPTY, gc.userMsg.EMPTY_USER_PASSWORD),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: loginSchema,
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

let authResult: any;

if (userData !== null) {
  authResult = useQuery(['authUser'], () => getMeFn(), {
    enabled: false,
    retry: 1,
  });
}

const queryClient = useQueryClient();

const { isLoading, mutate } = useMutation(
  (credentials: ILoginInput) => loginUserFn(credentials),
  {
    onError: (error) => {
      const errMsg = (error as any).response.data.error;
      const response = (error as any).response.data;
      console.log(errMsg);
      console.log(response);

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
    onSuccess: (data) => {
      const authUser = Object.assign({}, data.userPayload);

      authStore.setAuthUser(authUser);
      queryClient.refetchQueries(['authUser']);

      $q.notify({
        type: 'positive',
        message: gc.userMsg.SUCCESS_USER_LOGIN,
      });
      router.push({ name: 'index' });
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
  console.log(authResult);
  if (authResult.data.value?.userPayload) {
    const authUser = Object.assign({}, authResult.data.value?.userPayload);
    authStore.setAuthUser(authUser);
  }
});
</script>
