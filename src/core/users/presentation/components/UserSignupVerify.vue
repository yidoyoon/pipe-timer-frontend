<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmailFn } from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

onMounted(async () => {
  await router.isReady();
  const { signupVerifyToken } = route.query;

  await verifyEmailFn(signupVerifyToken as string)
    .then(async (response) => {
      if (response.success) {
        if (response.message === 'Already verified email') {
          $q.notify({
            type: 'warning',
            message: '이미 인증된 이메일이거나 유효하지 않은 토큰입니다.',
            icon: 'warning',
          });
        } else {
          $q.notify({
            type: 'positive',
            message: '인증되었습니다. 서비스를 이용하시려면 로그인 해주세요.',
            icon: 'done',
          });
        }
      } else {
        $q.notify({
          type: 'warning',
          message: '이미 인증된 이메일이거나 유효하지 않은 토큰입니다.',
          icon: 'warning',
        });
      }

      await router.push({ name: 'login' });
    })
    .catch((err) => {
      if (err === 'Cannot verify token') {
        $q.notify({
          type: 'negative',
          message:
            '인증 과정에서 오류가 발생했습니다. 오류가 계속되면 관리자에게 문의해주세요.',
          icon: 'error',
        });
      }
      router.push({ name: 'panel' });
    });
});
</script>
