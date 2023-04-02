<template>
  <q-dialog v-model="userStore.deleteAccountPrompt">
    <q-card style="min-width: 350px; max-width: 470px">
      <q-card-section>
        <div class="text-h6">계정 삭제</div>
        <div>
          계정을 삭제하면 계정과 관련된 모든 데이터가 영구적으로 제거됩니다.
        </div>
        <div>
          계정 삭제를 진행하시려면 아래 입력창에 <b>Delete account</b>를
          입력해주세요.
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="validation"
          label="Delete account"
          dense
          autofocus
          debounce="300"
          @keyup.enter.prevent=""
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
          @click=""
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
import { deleteAccountFn } from 'src/core/users/infra/http/user.api';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ICheckValidationInput } from 'src/type-defs/userTypes';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as zod from 'zod';

const $q = useQuasar();
const $router = useRouter();
const userStore = useUserStore();

const deleteAccountSchema = toFormValidator(
  zod
    .object({
      validation: zod.string({
        required_error:
          "계정 삭제를 진행하시려면 'Delete account'를 정확하게 입력해주세요. ",
      }),
    })
    .refine((data) => data.validation === 'Delete account', {
      path: ['validation'],
    })
);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: deleteAccountSchema,
});

const {
  value: validation,
  errorMessage: nameError,
  setErrors,
} = useField<string>('validation');

const { isLoading, mutate } = useMutation(
  (credentials: ICheckNameInput) => changeNameFn(credentials),
  {
    onError: (err: any) => {
      const response = err.response.data;
      console.log(response);
    },
    onSuccess: (response) => {
      userStore.deleteAccountPrompt = false;
    },
  }
);
</script>
