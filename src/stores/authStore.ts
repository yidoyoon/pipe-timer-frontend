import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { IUser } from 'src/type-defs/userTypes';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    authUser: useLocalStorage<IUser | null>('authUser', null),
  }),
  getters: {},
  actions: {
    setAuthUser(user: IUser | null) {
      this.authUser = user;
    },
  },
});
