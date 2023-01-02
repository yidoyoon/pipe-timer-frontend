import { NavigationGuardNext } from 'vue-router';
import { Notify } from 'quasar';
import { Router }       from 'src/router';
import { getMeFn }      from 'src/core/users/infra/user.repository';
import { useUserStore } from 'src/core/users/infra/store/user.store';

export default async function requireAuth({
  next,
  userStore,
}: {
  next: NavigationGuardNext;
  userStore: any;
}) {
  if (!useUserStore().user) {
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
    userStore.setUser(data.data);

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
