import { defineStore } from 'pinia';
import { ITimefrag } from 'src/core/timefrag/domain/timefrag';
import { LocalStorage } from 'quasar';

export interface TimefragState {
  timefrags: Record<string, ITimefrag>;
  timefragIds: string[];
  isLoading: boolean;
}

export const useTimefragStore = defineStore('timefragStore', {
  state: (): TimefragState => {
    return {
      timefrags: {},
      timefragIds: [],
      isLoading: false,
    };
  },
  persist: {
    key: 'timer-data',
    storage: {
      getItem: (key) => {
        return LocalStorage.getItem(key);
      },
      setItem: (key, value) => {
        return LocalStorage.set(key, value);
      },
    },
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$id}'`);
    },
  },

  getters: {
    list(): ITimefrag[] {
      return this.timefragIds.map((i) => this.timefrags[i]);
    },

    loaded(): boolean {
      return this.timefragIds.length > 0;
    },

    isEditingOverall(): boolean {
      const filtered = this.list.find((obj) => {
        return obj.isEditing;
      });
      return filtered !== undefined;
    },

    canSave(): boolean {
      return !(this.isLoading || this.isEditingOverall);
    },
  },

  actions: {
    async fetchAll() {
      if (this.loaded) return;

      // const res = await fetch(`${fakeStoreUrl}/products`);
      // const data: Product[] = await res.json();
      this.timefragIds = dummy.map((product) => {
        this.timefrags[product.id] = product;
        return product.id;
      });
    },

    add(newTimefrag: ITimefrag) {
      this.timefrags[newTimefrag.id] = newTimefrag;
      this.timefragIds.push(newTimefrag.id);
    },

    edit(newTimefrag: ITimefrag) {
      const tradfrag = this.timefrags[newTimefrag.id];

      if (!!tradfrag) {
        this.timefrags[newTimefrag.id] = newTimefrag;
      }
    },

    remove(timefragId: string) {
      const target = this.timefrags[timefragId];
      if (!!target) {
        delete this.timefrags[timefragId];
        const i = this.timefragIds.lastIndexOf(timefragId);
        if (i > -1) this.timefragIds.splice(i, 1);
      }
    },

    reset() {
      this.$reset();
    },
  },
});
