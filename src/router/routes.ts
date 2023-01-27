import requireAuth from 'src/router/middleware/requireAuth';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import('../core/common/presentation/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('../core/common/presentation/page/IndexPage.vue'),
        name: 'index',
      },
      {
        path: 'guide',
        component: () => import('../core/guide/presentation/AppGuide.vue'),
        name: 'guide',
      },
      {
        path: 'dashboard',
        component: () =>
          import('../core/dashboard/presentation/HistoryDashboard.vue'),
        name: 'dashboard',
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        path: 'settings',
        component: () => import('../core/setting/presentation/AppSettings.vue'),
        name: 'settings',
      },
      {
        path: 'login',
        component: () => import('../core/users/presentation/UserLogin.vue'),
        name: 'login',
      },
      {
        path: 'signup',
        component: () => import('../core/users/presentation/UserSignup.vue'),
        name: 'signup',
      },
      {
        path: 'create-timer',
        component: () =>
          import('../core/timer/presentation/TimerMain.vue'),
        name: 'create-timer',
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        path: 'create-stack',
        component: () =>
          import('../core/builder/presentation/BuilderMain.vue'),
        name: 'create-stack',
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        path: 'editor',
        component: () =>
          import('../core/common/presentation/page/EditorMain.vue'),
        name: 'editor',
        meta: {
          middleware: [requireAuth],
        },
      },
    ],
  },
  {
    path: '/user',
    children: [
      {
        path: 'verify-email',
        component: () =>
          import('../core/users/presentation/UserSignupVerify.vue'),
        name: 'verify-email',
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
