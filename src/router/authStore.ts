import { defineStore } from 'pinia';
import { IUser } from 'src/api/userTypes';

export type AuthStoreState = {
  authUser: IUser | null;
};

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () =>
    ({
      authUser: null,
    } as AuthStoreState),
  getters: {},
  actions: {
    setAuthUser(user: IUser | null) {
      this.authUser = user;
    },
  },
});
