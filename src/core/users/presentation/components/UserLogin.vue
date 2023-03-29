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
        debounce="1000"
      />
      <q-input
        filled
        v-model="password"
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        placeholder="8 - 32 characters"
        :error-message="passwordError"
        :error="!!passwordError"
        debounce="1000"
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
        <q-btn label="login" type="submit" color="primary" />
        <q-space />
        <q-btn label="cancel" to="/" flat class="q-ml-sm" />
      </div>
      <div class="text-body2">
        계정이 없다면 회원가입 해주세요.
        <a class="cursor-pointer" @click="router.push({ name: 'check-email' })"><b>회원가입</b></a>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import { CHECK_EMPTY, userMsg } from 'src/core/users/domain/user.const';
import * as zod from 'zod';
import { ILoginInput } from 'src/type-defs/userTypes';
import { getMeFn, loginUserFn } from 'src/core/users/infra/http/user.api';
import { onBeforeMount, onBeforeUpdate, ref } from 'vue';
import { toFormValidator } from '@vee-validate/zod';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { useField, useForm } from 'vee-validate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const isPwd = ref(true);
const router = useRouter();

const userStore = useUserStore();
const routineStore = useRoutineStore();

const userData = userStore.user;

onBeforeMount(() => {
  routineStore.bottomDrawerHeight = 36;
});

const loginSchema = toFormValidator(
  zod.object({
    email: zod
      .string()
      .min(1, userMsg.EMPTY_USER_EMAIL)
      .email(userMsg.INVALID_USER_EMAIL),
    password: zod.string().min(CHECK_EMPTY, userMsg.EMPTY_USER_PASSWORD),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: loginSchema,
});

const { value: email, errorMessage: emailError, setErrors } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

let authResult: any;

if (userData !== null) {
  authResult = useQuery(['user'], () => getMeFn(), {
    enabled: false,
    retry: 1,
  });
}

const queryClient = useQueryClient();

const { isLoading, mutate } = useMutation(
  (credentials: ILoginInput) => loginUserFn(credentials),
  {
    onError: (err: any) => {
      const errMsg = err.response.data.message as string;
      const response = err.response.data;

      if (
        errMsg === 'Incorrect email or password' ||
        errMsg === 'No matching account information'
      ) {
        setErrors('이메일 혹은 비밀번호가 일치하지 않습니다.');
      }
    },
    onSuccess: (response) => {
      const user = response.passport.user;

      userStore.setUser(user);
      queryClient.refetchQueries(['user']);

      router.push('/');
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
  if (authResult.data.value?.userPayload) {
    const user = Object.assign({}, authResult.data.value?.userPayload);
    userStore.setUser(user);
  }
});
</script>
