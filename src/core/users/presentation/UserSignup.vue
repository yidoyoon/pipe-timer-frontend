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
        v-model="email"
        label="Email"
        hint="로그인에 사용될 이메일 입니다."
        debounce="500"
        disable
      />
      <q-input
        filled
        v-model="name"
        label="User name"
        :hint="
          !nameError
            ? '유저네임을 설정해주세요. 추후 변경할 수 있도록 구현할 예정입니다.'
            : ''
        "
        :error-message="nameError"
        :error="!!nameError"
        debounce="500"
      />
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
          label="SIGN UP"
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
import { CHECK_EMPTY, userMsg, userVar } from 'src/core/users/domain/user.const';
import { useUserStore }                  from 'src/core/users/infra/store/user.store';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import * as zod from 'zod';
import { ISignupInput } from 'src/type-defs/userTypes';
import { computed, ref } from 'vue';
import { toFormValidator } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { useMutation } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { signUpUserFn } from 'src/core/users/infra/http/user.api';

const $q = useQuasar();
const router = useRouter();
const isPwd = ref(true);
const userStore = useUserStore();
const { verifiedEmail } = userStore;

const registerSchema = toFormValidator(
  zod
    .object({
      name: zod
        .string()
        .min(userVar.USER_NAME_MIN_LEN, userMsg.BELOW_MIN_USER_NAME),
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

const email = computed(() => {
  return userStore.verifiedEmail;
});

const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: password, errorMessage: passwordError } =
  useField<string>('password');
const { value: passwordConfirm, errorMessage: passwordConfirmError } =
  useField<string>('passwordConfirm');

const { isLoading, mutate } = useMutation(
  (credentials: ISignupInput) => signUpUserFn(credentials),
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
    onSuccess: (data, variables) => {
      $q.notify({
        type: 'positive',
        message: variables.email + userMsg.SEND_USER_SIGNUP_VERIFICATION_EMAIL,
      });
      router.push({ name: 'controller' });
      userStore.verifiedEmail = null;
    },
  }
);

const onSubmit = handleSubmit((values) => {
  if (!!email.value) {
    mutate({
      email: email.value,
      userName: values.name,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });
    resetForm();
  } else {
    $q.notify({
      type: 'negative',
      color: 'negative',
      message:
        '이메일 칸이 비어있습니다. 이메일 인증 절차부터 다시 진행해주세요.',
      icon: 'warning',
    });
  }
});
</script>
