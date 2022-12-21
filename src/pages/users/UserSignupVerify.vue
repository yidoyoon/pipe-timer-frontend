<script setup lang="ts">
import { verifyEmailFn } from 'src/api/authApi';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import * as gc from 'src/api/globalConst';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// TODO: 잘못된 인증 토큰(만료, 위조)이 전송되면 404 페이지로 라우팅
onMounted(async () => {
  await router.isReady();
  const { signupVerifyToken } = route.query;
  await verifyEmailFn(<string>signupVerifyToken)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: gc.userMsg.VERIFY_COMPLETE,
        icon: 'warning',
      });
      router.push({name: 'login'});
    })
    .catch((err) => {
      $q.notify({
        type: 'negative',
        message: err.message,
        icon: 'warning',
      });
    });
});
</script>
