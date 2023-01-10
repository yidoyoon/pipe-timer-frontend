import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { IUser } from 'src/type-defs/userTypes';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: useLocalStorage<IUser | null>('user', null),
  }),
  getters: {},
  actions: {
    setUser(user: IUser | null) {
      this.user = user;
    },
  },
});
