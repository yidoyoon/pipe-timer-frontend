import { defineStore } from 'pinia';
import { IUser } from 'src/type-defs/userTypes';

export type AuthStoreState = {
  authUser: IUser | null;
};

export const useAuthStore = defineStore('authStore', {
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
