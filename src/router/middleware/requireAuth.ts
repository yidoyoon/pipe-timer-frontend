import _ from 'lodash-es';
import { IUser } from 'src/type-defs/userTypes';
import { NavigationGuardNext } from 'vue-router';
import { Notify } from 'quasar';
import { Router } from 'src/router';
import { getMeFn } from 'src/core/users/infra/http/user.api';
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
    const response = await getMeFn();
    const { id, userName, email } = response;
    const user = _.cloneDeep({} as IUser);
    user.id = id;
    user.userName = userName;
    user.email = email;
    userStore.setUser(user);

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
