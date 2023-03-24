import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // TODO: Slot 활용하여 컴포넌트 재사용률 높이기(https://router.vuejs.org/guide/essentials/named-views.html#nested-named-views)
  {
    path: '/',
    component: () =>
      import('../core/common/presentation/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('../core/panel/presentation/PanelMain.vue'),
        name: 'panel',
      },
      {
        path: 'login',
        component: () => import('../core/users/presentation/UserLogin.vue'),
        name: 'login',
      },
      {
        path: 'check-email',
        component: () =>
          import('../core/users/presentation/UserCheckEmail.vue'),
        name: 'check-email',
      },
      {
        path: 'signup',
        component: () => import('../core/users/presentation/UserSignup.vue'),
        name: 'signup',
      },
      // {
      //   path: 'guide',
      //   component: () => import('../core/guide/presentation/AppGuide.vue'),
      //   name: 'guide',
      // },
    ],
  },
  {
    path: '/users',
    children: [
      {
        path: 'verify-email',
        component: () =>
          import('../core/users/presentation/UserSignupVerify.vue'),
        name: 'verify-email',
      },
    ],
  },
  {
    path: '/users',
    component: () =>
      import('../core/common/presentation/layouts/AppLayout.vue'),
    children: [
      {
        path: 'setting',
        component: () => import('../core/users/presentation/UserSetting.vue'),
        name: 'user-setting',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () =>
      import('../core/common/presentation/page/ErrorNotFound.vue'),
    name: 'error',
  },
];

export default routes;
