import { NavigationGuardNext } from 'vue-router';
import { Notify } from 'quasar';
import { Router } from 'src/router';
import { getMeFn } from 'src/core/users/infra/http/user.api';

export default async function requireAuth({
  next,
  userStore,
  timerStore,
  routineStore,
}: {
  next: NavigationGuardNext;
  userStore: any;
  timerStore: any;
  routineStore: any;
}): Promise<void> {
  if (!userStore.user) {
    await Router.push({ name: 'login' });
    Notify.create({
      color: 'blue',
      message: '서비스를 이용하시려면 먼저 로그인 해주세요.',
    });

    return next();
  }

  try {
    const response = await getMeFn();
    const user = { ...response };
    userStore.setUser(user);

    if (!user) {
      timerStore.fetchAll();
      routineStore.fetchAll();

      return next({ name: 'login' });
    }
  } catch (error) {
    Notify.create({
      type: 'warning',
      textColor: 'black',
      message: '회원인증 절차에 오류가 발생했습니다.',
      closeBtn: true,
    });
    return next({
      name: 'panel',
    });
  }

  return next();
}
