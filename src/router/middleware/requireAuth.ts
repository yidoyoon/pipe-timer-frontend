import { NavigationGuardNext } from 'vue-router';
import { Notify } from 'quasar';
import { Router } from 'src/router';
import { getMeFn } from 'src/core/users/infra/userController';
import { useAuthStore } from 'stores/authStore';

export default async function requireAuth({
  next,
  authStore,
}: {
  next: NavigationGuardNext;
  authStore: any;
}) {
  if (!useAuthStore().authUser) {
    await Router.push({ name: 'login' });
    Notify.create({
      color: 'blue',
      message: '서비스를 이용하시려면 먼저 로그인 해주세요.',
    });
    return next();
  }
  try {
    const data = await getMeFn();
    const user = data.data;
    authStore.setAuthUser(data.data);

    if (!user) {
      return next({
        name: 'login',
      });
    }
  } catch (error) {
    await Router.push({ name: 'login' });
  }

  return next();
}
