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
        path: 'create-timefrag',
        component: () =>
          import('../core/timefrag/presentation/pages/CreateTimefrag.vue'),
        name: 'create-timefrag',
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
