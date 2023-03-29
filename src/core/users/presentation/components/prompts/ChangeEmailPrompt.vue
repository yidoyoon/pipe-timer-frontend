<template>
  <q-dialog v-model="userStore.changeEmailPrompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">이메일 변경</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          label="email@example.com"
          v-model="newEmail"
          hint="새로운 이메일을 입력해주세요."
          dense
          autofocus
          debounce="300"
          @keyup.enter.prevent="onSubmit"
          @keyup.esc.prevent="userStore.changeEmailPrompt = false"
          :error="!!emailError"
          :error-message="emailError"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="resetForm" />
        <q-btn
          flat
          label="Confirm"
          color="green"
          type="submit"
          @click="onSubmit"
          :disable="!isEmptyObj(errors)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useMutation } from '@tanstack/vue-query';
import { toFormValidator } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { userMsg } from 'src/core/users/domain/user.const';
import {
  changeEmailFn,
  checkEmailFn,
} from 'src/core/users/infra/http/user.api';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ICheckEmailInput, ILoginInput } from 'src/type-defs/userTypes';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as zod from 'zod';

const $q = useQuasar();
const $router = useRouter();
const userStore = useUserStore();

const changeEmailSchema = toFormValidator(
  zod
    .object({
      newEmail: zod
        .string({ description: '이메일을 입력해주세요' })
        .nonempty('이메일을 입력해주세요.')
        .email('이메일 형식이 올바르지 않습니다.'),
    })
    .refine((data) => data.newEmail !== userStore.user?.email, {
      path: ['newEmail'],
      message: userMsg.SAME_NEW_EMAIL,
    })
);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: changeEmailSchema,
});

const {
  value: newEmail,
  errorMessage: emailError,
  setErrors,
} = useField<string>('newEmail');

const { isLoading, mutate } = useMutation(
  (credentials: ICheckEmailInput) => checkEmailFn(credentials),
  {
    onError: (err: any) => {
      const errMsg = err.response.data.message as string;
      const response = err.response.data;

      if (errMsg === 'Duplicate email') {
        setErrors('이미 사용중인 이메일 입니다.');
      }
    },
    onSuccess: (response) => {
      try {
        sendNewEmail({ email: newEmail.value });
        alert('this');
      } catch (err) {}
    },
  }
);

const sendNewEmail = async (newEmail: ICheckEmailInput): Promise<void> => {
  const data = {} as ICheckEmailInput;

  if (userStore.user !== null) {
    if (userStore.user.email !== newEmail.email) {
      changeEmailFn;
    } else {
      $q.notify({
        color: 'negative',
        message: userMsg.INVALID_LOGIN_DATA,
        icon: 'error',
      });
      await $router.push({ name: 'login' });
    }
  } else {
    $q.notify({
      color: 'negative',
      message: userMsg.INVALID_LOGIN_DATA,
      icon: 'error',
    });
    await $router.push({ name: 'login' });
  }
};

resetForm({
  values: {
    newEmail: '',
  },
});

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.newEmail,
  });
  resetForm();
});
</script>
