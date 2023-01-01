<script setup lang="ts">
import * as gc from 'src/core/users/domain/userConst';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmailFn } from 'src/core/users/infra/userController';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// TODO: 잘못된 인증 토큰(만료, 위조)이 전송되면 404 페이지로 라우팅
onMounted(async () => {
  await router.isReady();
  const { signupVerifyToken } = route.query;
  await verifyEmailFn(<string>signupVerifyToken).then(() => {
    $q.notify({
      type: 'positive',
      message: gc.userMsg.VERIFY_COMPLETE,
      icon: 'warning',
    });
    router.push({ name: 'login' });
  });
});
</script>
