<script setup lang="ts">
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmailFn } from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const userStore = useUserStore();

onMounted(async () => {
  await router.isReady();
  const { signupToken } = route.query;

  try {
    const result = await verifyEmailFn(signupToken as string);
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: '이메일이 인증되었습니다.',
        icon: 'done',
      });

      await router.push({ name: 'panel' });
    }
  } catch (err: any) {
    if (err.response.data.message === 'Invalid signup token') {
      $q.notify({
        type: 'warning',
        message: '이미 인증된 이메일이거나 유효하지 않은 토큰입니다.',
        icon: 'warning',
      });
    }

    await router.push({ name: 'panel' });
  }
});
</script>
