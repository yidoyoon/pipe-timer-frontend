import { defineStore } from 'pinia';
import { ulid } from 'ulid';

const dummy: ITimefrag[] = [
  {
    id: ulid(),
    userId: 'test1',
    name: 'name1',
    duration: 11,
    count: 12,
    color: 'Color1',
    isEditing: false,
  },
  {
    id: ulid(),
    userId: 'test2',
    name: 'name2',
    duration: 21,
    count: 22,
    color: 'Color2',
    isEditing: false,
  },
];

export interface ITimefrag {
  id: string;
  userId: string;
  name: string;
  duration: number;
  count: number;
  color: string;
  isEditing: boolean;
}

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
    key: 'test',
    storage: sessionStorage,
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
