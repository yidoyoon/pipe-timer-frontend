<template>
  <div class="q-pa-md absolute-center" style="min-width: 400px">
    <div class="text-h4 q-mb-lg">Reset Password</div>
    <q-form
      @submit.prevent="onSubmit"
      class="q-gutter-sm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-input
        v-model="password"
        filled
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        hint="8 - 32자까지 설정할 수 있습니다."
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
        <q-btn
          label="Reset password"
          color="primary"
          type="submit"
          :disable="!isEmptyObj(errors)"
        />
        <div class="q-space"></div>
        <q-btn label="CANCEL" to="/" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {
  CHECK_EMPTY,
  userMsg,
  userVar,
} from 'src/core/users/domain/user.const';
import { resetPass } from 'src/core/users/infra/http/user.api';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import * as zod from 'zod';
import { IResetPasswordInput } from 'src/type-defs/userTypes';
import { ref } from 'vue';
import { toFormValidator } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { useMutation } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const isPwd = ref(true);

const registerSchema = toFormValidator(
  zod
    .object({
      password: zod
        .string()
        .min(CHECK_EMPTY, userMsg.EMPTY_USER_PASSWORD)
        .min(userVar.PASSWORD_MIN_LEN, userMsg.BELOW_MIN_USER_PASSWORD)
        .max(userVar.PASSWORD_MAX_LEN, userMsg.ABOVE_MAX_USER_PASSWORD),
      passwordConfirm: zod
        .string()
        .min(CHECK_EMPTY, userMsg.EMPTY_CONFIRM_PASSWORD),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: userMsg.MISMATCH_PASSWORD,
    })
);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: registerSchema,
});

const { value: password, errorMessage: passwordError } =
  useField<string>('password');
const { value: passwordConfirm, errorMessage: passwordConfirmError } =
  useField<string>('passwordConfirm');

const { isLoading, mutate } = useMutation(
  (credentials: IResetPasswordInput) => resetPass(credentials),
  {
    onError: (error) => {
      const errorMsg = (error as any).response.data.error;
      const responseMsg = (error as any).response.data.message;

      if ((error as any).response === undefined) {
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
    onSuccess: () => {
      $q.notify({
        type: 'positive',
        message: userMsg.SEND_USER_SIGNUP_VERIFICATION_EMAIL,
      });
      router.push({ name: 'login' });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    password: values.password,
    passwordConfirm: values.passwordConfirm,
  });
  resetForm();
});
</script>
