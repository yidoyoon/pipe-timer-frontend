<script setup lang="ts">
import { userMsg } from 'src/core/users/domain/user.const';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { verifyResetPasswordTokenFn } from 'src/core/users/infra/http/user.api';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

onMounted(async () => {
  await router.isReady();

  const { resetPasswordToken: token } = route.query;

  try {
    await verifyResetPasswordTokenFn(token as string);

    $q.notify({
      type: 'positive',
      message: userMsg.VERIFY_RESET_PASSWORD_SUCCESS,
      icon: 'done',
    });

    await router.push({ name: 'reset-password' });
  } catch (err) {
    $q.notify({
      type: 'warning',
      message: '이미 사용된 토큰이거나 유효하지 않은 토큰입니다.',
      icon: 'warning',
    });

    await router.push({ name: 'panel' });
  }
});
</script>
