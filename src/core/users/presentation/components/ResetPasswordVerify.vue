<script setup lang="ts">
import { userMsg } from 'src/core/users/domain/user.const';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import {
  verifyResetPasswordTokenFn,
} from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// TODO: 잘못된 인증 토큰(만료, 위조)이 전송되면 404 페이지로 라우팅
onMounted(async () => {
  await router.isReady();
  const { resetPasswordVerifyToken } = route.query;

  const response = await verifyResetPasswordTokenFn(
    resetPasswordVerifyToken as string
  );

  if (response.success === true) {
    $q.notify({
      type: 'positive',
      message: userMsg.VERIFY_RESET_PASSWORD_SUCCESS,
      icon: 'done',
    });
    await router.push({ name: 'reset-password' });
  } else {
    if (response.message === 'Invalid reset password verification code') {
      $q.notify({
        color: 'warning',
        textColor: 'black',
        message: '잘못된 인증코드입니다.',
        icon: 'warning',
      });
    }
    await router.push({ name: 'login' });
  }
});
</script>
