<script setup lang="ts">
import { userMsg } from 'src/core/users/domain/user.const';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import {
  verifyChangeEmailTokenFn,
} from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// TODO: 잘못된 인증 토큰(만료, 위조)이 전송되면 404 페이지로 라우팅
onMounted(async () => {
  await router.isReady();
  const { changeEmailVerifyToken } = route.query;

  const response = await verifyChangeEmailTokenFn(
    changeEmailVerifyToken as string
  );

  if (response.success === true) {
    $q.notify({
      type: 'positive',
      message: userMsg.CHANGE_EMAIL_SUCCESS,
      icon: 'done',
    });
    await router.push({ name: 'setting' });
  } else {
    if (response.message === 'Invalid change email verification code') {
      $q.notify({
        color: 'warning',
        textColor: 'black',
        message: '잘못된 인증코드입니다.',
        icon: 'warning',
      });
    }
    await router.push({ name: 'panel' });
  }
});
</script>
