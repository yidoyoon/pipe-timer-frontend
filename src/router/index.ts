import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'stores/authStore';
import middlewarePipeline from 'src/router/middlewarePipeline';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory;

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

export default route((/*{ store, ssrContext }*/) => {
  Router.beforeEach(
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore();

      if (!to.meta.middleware) {
        return next();
      }
      const middleware = to.meta.middleware as any;

      const context = {
        to,
        from,
        next,
        authStore,
      };

      return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
      });
    }
  );
  return Router;
});
