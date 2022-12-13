import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/account/UserLogIn.vue') },
    ],
  },

  // account
  {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/account/UserSignUp.vue') },
    ],
  },
  {
    path: '/guide',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/navigation/UserGuide.vue') },
    ],
  },

  // navigation
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/navigation/DashBoard.vue') },
    ],
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/navigation/UserSettings.vue'),
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
