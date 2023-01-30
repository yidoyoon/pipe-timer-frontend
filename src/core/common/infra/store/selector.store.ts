import { defineStore } from 'pinia';

export interface IEditNow {
  onStack: boolean;
  onBuilder: boolean;
  onTimer: boolean;
  editNow: string;
}

export const useSelectorStore = defineStore('SelectorStore', {
  state: (): IEditNow => {
    return {
      onStack: false,
      onBuilder: false,
      onTimer: false,
      editNow: '',
    };
  },

  getters: {
    // editNow(): string | null {
    //   if (this.onStack && !this.onTimer && !this.onBuilder) {
    //     return 'onStack';
    //   } else if (this.onBuilder && !this.onStack && !this.onTimer) {
    //     return 'onBuilder';
    //   } else if (this.onTimer && !this.onStack && !this.onBuilder) {
    //     return 'onTimer';
    //   } else if (!this.onStack && !this.onBuilder && !this.onTimer) {
    //     return null;
    //   }
    //   return null;
    // },
    editNow(): string {
      return this.editNow;
    }
  },

  actions: {
    selectStack() {
      this.onBuilder = false;
      this.onTimer = false;
      this.onStack = !this.onStack;
    },
    selectBuilder() {
      this.onStack = false;
      this.onTimer = false;
      this.onBuilder = !this.onBuilder;
    },
    selectTimer() {
      this.onStack = false;
      this.onBuilder = false;
      this.onTimer = !this.onTimer;
    },
    selectNone() {
      this.onStack = false;
      this.onBuilder = false;
      this.onTimer = false;
    },
  },
});
