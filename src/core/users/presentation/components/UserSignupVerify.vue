<script setup lang="ts">
import { userMsg }   from 'src/core/users/domain/user.const';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmailFn } from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// TODO: 잘못된 인증 토큰(만료, 위조)이 전송되면 404 페이지로 라우팅
onMounted(async () => {
  await router.isReady();
  const { signupVerifyToken } = route.query;

  const response = await verifyEmailFn(signupVerifyToken as string);

  if (response.success === true) {
    if (response.message === 'Already verified email') {
      $q.notify({
        type: 'positive',
        message: '이미 인증된 이메일입니다. 로그인 후 서비스를 이용해주세요.',
        icon: 'warning',
      });
    } else {
      $q.notify({
        type: 'positive',
        message: userMsg.VERIFY_EMAIL_SUCCESS,
        icon: 'done',
      });
    }
  } else {
    if (response.message === 'Invalid email verification code') {
      $q.notify({
        color: 'warning',
        textColor: 'black',
        message: '잘못된 인증코드입니다.',
        icon: 'warning',
      });
    }
  }
  await router.push({ name: 'login' });
});
</script>
