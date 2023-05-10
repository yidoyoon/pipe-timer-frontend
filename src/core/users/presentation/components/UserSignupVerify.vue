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
  const { signupToken } = route.query;

  await verifyEmailFn(signupToken as string)
    .then(async (response) => {
      if (response.success) {
        if (response.message === 'Already verified email') {
          $q.notify({
            type: 'warning',
            message: '이미 사용된 토큰이거나 유효하지 않은 토큰입니다.',
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
          message: '이미 사용된 토큰이거나 유효하지 않은 토큰입니다.',
          icon: 'warning',
        });
      }

      await router.push({ name: 'login' });
    })
    .catch((err) => {
      if (err.response.data.message === 'Invalid token') {
        $q.notify({
          type: 'warning',
          message: '이미 인증된 이메일이거나 유효하지 않은 토큰입니다.',
          icon: 'warning',
        });
      }
      router.push({ name: 'panel' });
    });
});
</script>
