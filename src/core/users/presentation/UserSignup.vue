<template>
  <div class="q-pa-md absolute-center" style="min-width: 400px">
    <div class="text-h4 q-mb-lg">Sign up</div>
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
        v-model="name"
        label="User name"
        :hint="!nameError ? '' : '유저네임을 설정해주세요.'"
        :error-message="nameError"
        :error="!!nameError"
        debounce="500"
      />
      <q-input
        filled
        v-model="email"
        label="Email"
        :hint="!emailError ? '' : '로그인에 사용될 이메일을 입력해주세요.'"
        :error-message="emailError"
        :error="!!emailError"
        debounce="500"
      />
      <q-input
        v-model="password"
        filled
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        hint="8 - 128자까지 설정할 수 있습니다."
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
      <q-input
        v-model="passwordConfirm"
        filled
        label="Re-enter password"
        :type="isPwd ? 'password' : 'text'"
        hint="비밀번호를 한번 더 입력해주세요."
        :error-message="passwordConfirmError"
        :error="!!passwordConfirmError"
        debounce="500"
      />
      <div class="row">
        <q-btn label="SIGN UP" color="secondary" type="submit" />
        <div class="q-space"></div>
        <q-btn label="CANCEL" to="/" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import * as gc               from 'src/core/users/domain/userConst';
import * as zod              from 'zod';
import { ISignupInput }      from 'src/type-defs/userTypes';
import { ref }               from 'vue';
import { toFormValidator }   from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { useMutation }       from '@tanstack/vue-query';
import { useQuasar }         from 'quasar';
import { useRouter }  from 'vue-router';
import {signUpUserFn} from 'src/core/users/infra/user.repository';

const $q = useQuasar();
const router = useRouter();
const isPwd = ref(true);

const registerSchema = toFormValidator(
  zod
    .object({
      name: zod
        .string()
        .min(gc.userVar.USER_NAME_MIN_LEN, gc.userMsg.BELOW_MIN_USER_NAME),
      email: zod
        .string()
        .min(gc.CHECK_EMPTY, gc.userMsg.EMPTY_USER_EMAIL)
        .email(gc.userMsg.INVALID_USER_EMAIL),
      password: zod
        .string()
        .min(gc.CHECK_EMPTY, gc.userMsg.EMPTY_USER_PASSWORD)
        .min(gc.userVar.PASSWORD_MIN_LEN, gc.userMsg.BELOW_MIN_USER_PASSWORD)
        .max(gc.userVar.PASSWORD_MAX_LEN, gc.userMsg.ABOVE_MAX_USER_PASSWORD),
      passwordConfirm: zod
        .string()
        .min(gc.CHECK_EMPTY, gc.userMsg.EMPTY_CONFIRM_PASSWORD),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: gc.userMsg.MISMATCH_PASSWORD,
    })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: registerSchema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: passwordConfirm, errorMessage: passwordConfirmError } =
  useField('passwordConfirm');

const { isLoading, mutate } = useMutation(
  (credentials: ISignupInput) => signUpUserFn(credentials),
  {
    onError: (error) => {
      const errorMsg = (<any>error).response.data.error;
      const responseMsg = (<any>error).response.data.message;

      if ((<any>error).response === undefined) {
        $q.notify({
          type: 'negative',
          message: '서버 점검중입니다.',
          icon: 'warning',
        });
      }
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
    onSuccess: (data, variables) => {
      router.push({ name: 'index' });
      $q.notify({
        type: 'positive',
        message:
          variables.email + gc.userMsg.SEND_USER_SIGNUP_VERIFICATION_EMAIL,
        icon: 'warning',
      });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    userName: values.name,
    email: values.email,
    password: values.password,
    passwordConfirm: values.passwordConfirm,
  });
  resetForm();
});
</script>
