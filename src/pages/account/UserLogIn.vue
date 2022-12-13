<template>
  <div class="q-pa-md absolute-center" style="min-width: 400px">
    <!--    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">-->
    <div class='text-h4 q-mb-lg'>Login</div>
    <q-form @reset="onReset" class="q-gutter-md">
      <q-input filled type="email" v-model="email" label="Email" placeholder="account@example.com" />
      <q-input
        v-model="password"
        filled
        label="Password"
        placeholder="8 - 128 characters"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <div class='row'>
        <q-btn label="SIGN IN" type="submit" color="primary" />
        <div class='q-space'></div>
        <q-btn
          label="CANCEL"
          to="/"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
      <div class='text-body2'>
        계정이 없다면 회원가입 해주세요.
        <a href="/signup">회원가입</a>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// import { useQuasar } from 'quasar';
import { ref } from 'vue';

// const $q = useQuasar();

const email = ref(null);
const password = ref(null);
const isPwd = ref(true);
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

const onReset = () => {
  email.value = null;
  password.value = null;
};
</script>
