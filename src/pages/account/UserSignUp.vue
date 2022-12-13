<template>
  <div class="q-pa-md absolute-center" style="min-width: 400px">
    <!--    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">-->
    <div class="text-h4 q-mb-lg">Sign up</div>
    <q-form @submit.prevent="submitSignUp" class="q-gutter-md">
      <q-input
        filled
        v-model="userInfo.name"
        label="Name"
        hint="표시될 닉네임을 설정해주세요."
      />
      <q-input
        filled
        type="email"
        v-model="userInfo.email"
        label="Email"
        hint="로그인에 사용될 이메일을 입력해주세요."
      />
      <q-input
        v-model="userInfo.password"
        filled
        label="Password"
        :type="isPwd ? 'password' : 'text'"
        hint="8 - 128자까지 가능합니다."
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
        <q-btn label="SIGN UP" color="secondary" type="submit" />
        <div class="q-space"></div>
        <q-btn label="CANCEL" to="/" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import Chance from 'chance';
import router from 'src/router';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const chance = new Chance();

// const userName = ref('');
// const email = ref('');
// const password = ref('');
const chancedName = chance.string({ length: 13, alpha: true, casing: 'lower' });
const chancedPassword = chance.string({ length: 13, alpha: true });

// const userName = ref(chancedName);
// const email = ref('ybyyng@gmail.com');
// const password = ref(chancedPassword);
const isPwd = ref(true);

interface User {
  name: string;
  email: string;
  password: string | void;
}

const userInfo: User = {
  name: ref(chancedName).value,
  email: ref('ybyyng@gmail.com').value,
  password: ref(chancedPassword).value,
};

// TODO: Refactor with reset() method, Deep copy
const onReset = () => {
  userInfo.name = '';
  userInfo.email = '';
  userInfo.password = '';
  // userInfo.name = chancedName;
  // userInfo.email = 'ybyyng@gmail.com';
  // userInfo.password = chancedPassword;
};

const sendUserInfo = (userInfo: User) => {
  axios
    .post('/users', userInfo)
    .then((response) => {
      console.log(response);
    })
    .then(() => {
      $q.notify({
        type: 'positive',
        message: `${userInfo.email}로 인증 메일이 발송됐습니다.`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const submitSignUp = async () => {
  if (!userInfo.name || !userInfo.email || !userInfo.password) {
    $q.notify({
      type: 'negative',
      message: '입력에 공란이 없는지 확인해주세요.',
    });
  } else if (userInfo.password.length < 8) {
    $q.notify({
      type: 'negative',
      message: '비밀번호를 최소 8자리 이상으로 설정해주세요.',
    });
  } else {
    sendUserInfo({
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
    });
  }
};

// function register({ commit }, form) {
//   return api.post('/auth/register', form).then((response) => {
//     api.defaults.headers.common['Authorization'] =
//       'Bearer ' + response.data.token;
//     commit('login', { token: response.data.token, user: response.data.user });
//   });
// }

// const signUpRegister = () => {
//   return api.post('/api/users/', JSON.stringify(userInfo)).then((response) => {
//     return;
//   });
// };

// const accept = ref(false);

// const onSubmit = () => {
//   if (accept.value !== true) {
//     $q.notify({
//       color: 'red-5',
//       textColor: 'white',
//       icon: 'warning',
//       message: 'You need to accept the license and terms first',
//     });
//   } else {
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'cloud_done',
//       message: 'Submitted',
//     });
//   }
// };
</script>
