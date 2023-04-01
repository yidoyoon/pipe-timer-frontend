<template>
  <q-dialog v-model="userStore.changeNamePrompt">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">유저네임 변경</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="newName"
          hint="새로운 유저네임을 입력해주세요. 영문만 가능합니다."
          dense
          autofocus
          debounce="300"
          @keyup.enter.prevent="onSubmit"
          @keyup.esc.prevent="userStore.changeEmailPrompt = false"
          :error="!!nameError"
          :error-message="nameError"
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

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { toFormValidator } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { userMsg } from 'src/core/users/domain/user.const';
import { changeNameFn } from 'src/core/users/infra/http/user.api';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ICheckNameInput } from 'src/type-defs/userTypes';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as zod from 'zod';
import * as filter from 'leo-profanity';

const $q = useQuasar();
const $router = useRouter();
const userStore = useUserStore();

const changeNameSchema = toFormValidator(
  zod
    .object({
      newName: zod
        .string({ description: '유저네임을 입력해주세요' })
        .nonempty('유저네임을 입력해주세요.')
        .regex(/^[A-Za-z]+$/, { message: '영문자만 입력 가능합니다.' })

        .max(39),
    })
    .refine((data) => data.newName !== userStore.user?.userName, {
      path: ['newName'],
      message: userMsg.SAME_NEW_USERNAME,
    })
    .refine((data) => !filter.check(data.newName), {
      path: ['newName'],
      message: userMsg.PROFANE_WORDS,
    })
);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: changeNameSchema,
});

const {
  value: newName,
  errorMessage: nameError,
  setErrors,
} = useField<string>('newName');

const { isLoading, mutate } = useMutation(
  (credentials: ICheckNameInput) => changeNameFn(credentials),
  {
    onError: (err: any) => {
      const errMsg = err.response.data.message as string;
      const response = err.response.data;

      if (errMsg === 'Duplicate username') {
        setErrors('이미 사용중인 유저네임 입니다.');
      }
    },
    onSuccess: (response) => {
      try {
        userStore.changeNamePrompt = false;
      } catch (err) {
        console.log(err);
      }
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    newName: values.newName,
  });
});
</script>
