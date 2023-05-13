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

  try {
    await verifyEmailFn(signupToken as string);
    $q.notify({
      type: 'positive',
      message: '인증되었습니다. 서비스를 이용하시려면 로그인 해주세요.',
      icon: 'done',
    });

    await router.push({ name: 'login' });
  } catch (err: any) {
    if (err.response.data.message === 'Invalid signup token') {
      $q.notify({
        type: 'warning',
        message: '이미 인증된 이메일이거나 유효하지 않은 토큰입니다.',
        icon: 'warning',
      });
    } else {
      $q.notify({
        type: 'warning',
        message: '인증을 진행할 수 없습니다.',
        icon: 'warning',
      });
    }

    await router.push({ name: 'panel' });
  }
});
</script>
