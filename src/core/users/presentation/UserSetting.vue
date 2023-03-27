<template>
  <div class="row justify-between">
    <q-space class="col-2" />
    <div class="row justify-between q-mt-xl col-8">
      <div class="text-h4">Account Setting</div>
    </div>
    <q-space class="col-2" />
  </div>

  <q-separator spaced="lg" />

  <div class="row">
    <div class="col-2"></div>
    <div class="col-7 q-gutter-lg">
      <div class="row justify-start items-end">
        <div class="text-h6 col-8">
          Email
          <q-field outlined style="width: 17rem" dense class="q-pt-xs">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ userStore.user?.email }}
              </div>
            </template>
          </q-field>
        </div>
        <q-btn outline class="col-4" text-color="black" label="Change Email" />
      </div>

      <div class="row justify-start items-end">
        <div class="text-h6 col-8">
          User name
          <q-field outlined style="width: 17rem" dense class="q-pt-xs">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ userStore.user?.userName }}
              </div>
            </template>
          </q-field>
        </div>
        <q-btn
          outline
          class="col-4"
          text-color="black"
          label="Change Username"
        />
      </div>

      <div class="row justify-start q-pt-lg items-end">
        <div class="text-h6 col-8">
          Password
          <div class="text-caption q-pt-xs">
            패스워드를 재설정합니다. 이메일이 필요합니다.
          </div>
        </div>
        <q-btn
          outline
          class="col-4"
          text-color="black"
          label="Change Password"
          @click="resetPass"
        />
      </div>

      <div class="row justify-between q-pt-lg items-end">
        <div class="text-h6 col-8">
          Delete Account
          <div class="text-caption q-pt-xs">
            계정을 삭제합니다. 모든 데이터가 제거됩니다.
          </div>
        </div>
        <q-btn
          class="col-4"
          color="negative"
          text-color="white"
          label="Delete Account"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/core/users/infra/store/user.store';

const userStore = useUserStore();
let email = 'undefined';
let userName = 'undefined';

if (userStore.user !== null) {
  email = userStore.user.email;
  userName = userStore.user.userName;
}

const resetPass = (): void => {
  const data = {} as ICheckEmailInput;

  if (userStore.user !== null) {
    data.email = userStore.user.email;
    resetPassFn(data);
  } else {
    $q.notify({
      color: 'negative',
      message: userMsg.INVALID_LOGIN_DATA,
      icon: 'error',
    });
    $router.push({ name: 'login' });
  }
};
</script>

<style lang="scss" scoped>
.q-separator--horizontal {
  margin-inline: 11rem;
}
</style>
