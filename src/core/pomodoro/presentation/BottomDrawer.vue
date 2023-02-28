<template>
  <div class="row wrap justify-center q-pa-md">
    <div id="q-app">
      <div class="q-pa-md">
        <q-card
          class="slide-drawer slide-drawer--bottom text-black column no-wrap"
          :class="`slide-drawer--open-${drawerMode}`"
          style="position: fixed; bottom: 0; right: 15rem; left: 15rem"
          :style="drawerStyle"
        >
          <q-card-section
            class="slide-drawer__handler--horizontal row flex-center justify-between q-pa-sm"
            v-touch-pan.mouse.vertical="slideDrawer"
          >
            <div class="row q-px-none">
              <!--        Add stack button-->
              <div>
                <q-btn
                  v-if="!stackInBuilder.stacksToFrag"
                  @click="createStacksBtn"
                  :disable="!listTimerRefs.length"
                  dense
                  icon="add"
                  flat
                  text-color="positive"
                  class="q-px-none q-mx-none"
                  size="0.6rem"
                />
                <q-tooltip anchor="top middle" self="top middle">
                  <div v-if="listTimerRefs.length">스택을 생성합니다.</div>
                  <div v-else>
                    스택을 생성하려면 최소 1개의 타이머가 필요합니다.
                  </div>
                </q-tooltip>
              </div>
              <!--        Save stack button-->
              <div v-if="stackInBuilder.stacksToFrag">
                <q-btn
                  v-if="stackInBuilder.stacksToFrag"
                  @click="saveStackBtn"
                  dense
                  icon="save"
                  flat
                  text-color="positive"
                  size="0.6rem"
                  class="q-pr-sm"
                />
                <q-tooltip anchor="top middle" self="top middle">
                  스택을 저장합니다.
                </q-tooltip>
              </div>
            </div>

            <div class="cursor-pointer open-dash" @click="cycleDrawer"></div>

            <!--        Cancel stack button-->
            <div v-if="stackInBuilder.stacksToFrag">
              <q-btn
                @click="resetBuilder"
                dense
                icon="cancel"
                flat
                text-color="positive"
                size="0.6rem"
                class="q-pr-sm"
              />
              <q-tooltip anchor="top middle" self="top middle">
                스택 생성 혹은 수정을 취소합니다.
              </q-tooltip>
            </div>
            <div v-if="!stackInBuilder.stacksToFrag" />
          </q-card-section>

          <!--            Stack list-->
          <q-card style="width: 100%; height: 47vh">
            <q-card-section class="row wrap justify-between q-py-none">
              <div class="col">
                <StackMain></StackMain>
              </div>
            </q-card-section>
          </q-card>

          <!--    CreateStack dialog-->
          <q-dialog
            v-model="builderWarn"
            persistent
            @keyup.enter="
              builderWarn = false;
              builderPrompt = true;
            "
            @keyup.esc.prevent="builderWarn = false"
          >
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="warning"></q-icon>
                  Confirmation
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div>
                  현재 작업중인 스택이 있습니다. 스택 생성을 계속할 경우
                  저장되지 않은 내용은 삭제됩니다. 계속하시겠습니까?
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn
                  flat
                  label="Confirm"
                  color="red"
                  v-close-popup
                  @click="builderPrompt = true"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!--  Create stack prompt-->
          <q-dialog v-model="builderPrompt" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Stack name</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="stackName"
                  autofocus
                  @keyup.enter.prevent="createStack"
                  @keyup.esc.prevent="builderPrompt = false"
                />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn
                  flat
                  label="Confirm"
                  color="green"
                  v-close-popup
                  @click="createStack"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!--          <q-card-section class="col">-->
          <!--            <div class="text-h6">Our Changing Planet</div>-->
          <!--            <div class="text-subtitle2">by John Doe</div>-->
          <!--          </q-card-section>-->

          <!--          <q-card-section v-if="drawerMode !== 'handler'" class="col">-->
          <!--            <div class="text-h6">-->
          <!--              Our Changing Planet - only shown when drawer is open-->
          <!--            </div>-->
          <!--            <div class="text-subtitle2">by John Doe</div>-->
          <!--            <div>{{ lorem }}</div>-->
          <!--          </q-card-section>-->
        </q-card>
      </div>
    </div>

    <!--  &lt;!&ndash;    Open stack list button&ndash;&gt;-->
    <!--  <q-page-sticky-->
    <!--    v-if="!showStack"-->
    <!--    position="bottom"-->
    <!--    class="z-top"-->
    <!--    style="left: 120px; bottom: 0.5rem"-->
    <!--  >-->
    <!--    <q-btn-->
    <!--      @click="toggleStackList"-->
    <!--      icon="keyboard_double_arrow_up"-->
    <!--      color="black"-->
    <!--      flat-->
    <!--      round-->
    <!--    />-->
    <!--  </q-page-sticky>-->

    <!--  &lt;!&ndash;  Stack list dialog&ndash;&gt;-->
    <!--  <q-dialog-->
    <!--    v-model="showStack"-->
    <!--    transition-show="slide-up"-->
    <!--    transition-hide="slide-down"-->
    <!--    seamless-->
    <!--    position="bottom"-->
    <!--  >-->
    <!--    <q-card style="width: 70vw; max-width: 70vw; height: 47vh">-->
    <!--      <q-bar-->
    <!--        class="q-mb-md"-->
    <!--        style="-->
    <!--          background-color: transparent;-->
    <!--          border-bottom: solid 0.1rem #002222;-->
    <!--        "-->
    <!--      >-->
    <!--        &lt;!&ndash;        Add stack button&ndash;&gt;-->
    <!--        <div>-->
    <!--          <q-btn-->
    <!--            v-if="!stackInBuilder.stacksToFrag"-->
    <!--            @click="createStacksBtn"-->
    <!--            :disable="!listTimerRefs.length"-->
    <!--            dense-->
    <!--            icon="add"-->
    <!--            flat-->
    <!--            label="create stack"-->
    <!--            text-color="positive"-->
    <!--            class="q-pr-sm"-->
    <!--          />-->
    <!--          <q-tooltip anchor="top middle" self="top middle">-->
    <!--            <div v-if="listTimerRefs.length">스택을 생성합니다.</div>-->
    <!--            <div v-else>스택을 생성하려면 최소 1개의 타이머가 필요합니다.</div>-->
    <!--          </q-tooltip>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;        Save stack button&ndash;&gt;-->
    <!--        <div v-if="stackInBuilder.stacksToFrag">-->
    <!--          <q-btn-->
    <!--            v-if="stackInBuilder.stacksToFrag"-->
    <!--            @click="saveStackBtn"-->
    <!--            dense-->
    <!--            icon="save"-->
    <!--            flat-->
    <!--            label="save"-->
    <!--            text-color="positive"-->
    <!--            class="q-pr-sm"-->
    <!--          />-->
    <!--          <q-tooltip anchor="top middle" self="top middle">-->
    <!--            스택을 저장합니다.-->
    <!--          </q-tooltip>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;        Cancel stack button&ndash;&gt;-->
    <!--        <div v-if="stackInBuilder.stacksToFrag">-->
    <!--          <q-btn-->
    <!--            @click="resetBuilder"-->
    <!--            dense-->
    <!--            icon="cancel"-->
    <!--            flat-->
    <!--            label="cancel"-->
    <!--            text-color="positive"-->
    <!--            class="q-pr-sm"-->
    <!--          />-->
    <!--          <q-tooltip anchor="top middle" self="top middle">-->
    <!--            스택 생성 혹은 수정을 취소합니다.-->
    <!--          </q-tooltip>-->
    <!--        </div>-->
    <!--        <q-space />-->
    <!--        <q-btn dense flat icon="minimize" @click="showStack = false" />-->
    <!--      </q-bar>-->
    <!--      <q-card-section class="row wrap justify-between q-py-none">-->
    <!--        <div class="col">-->
    <!--          <StackMain></StackMain>-->
    <!--        </div>-->
    <!--      </q-card-section>-->
    <!--    </q-card>-->
    <!--  </q-dialog>-->

    <!--  &lt;!&ndash;    CreateStack dialog&ndash;&gt;-->
    <!--  <q-dialog-->
    <!--    v-model="builderWarn"-->
    <!--    persistent-->
    <!--    @keyup.enter="-->
    <!--      builderWarn = false;-->
    <!--      builderPrompt = true;-->
    <!--    "-->
    <!--    @keyup.esc.prevent="builderWarn = false"-->
    <!--  >-->
    <!--    <q-card style="min-width: 350px">-->
    <!--      <q-card-section>-->
    <!--        <div class="text-h6">-->
    <!--          <q-icon name="warning"></q-icon>-->
    <!--          Confirmation-->
    <!--        </div>-->
    <!--      </q-card-section>-->

    <!--      <q-card-section class="q-pt-none">-->
    <!--        <div>-->
    <!--          현재 작업중인 스택이 있습니다. 스택 생성을 계속할 경우 저장되지 않은-->
    <!--          내용은 삭제됩니다. 계속하시겠습니까?-->
    <!--        </div>-->
    <!--      </q-card-section>-->

    <!--      <q-card-actions align="right" class="text-primary">-->
    <!--        <q-btn flat label="Cancel" v-close-popup />-->
    <!--        <q-btn-->
    <!--          flat-->
    <!--          label="Confirm"-->
    <!--          color="red"-->
    <!--          v-close-popup-->
    <!--          @click="builderPrompt = true"-->
    <!--        />-->
    <!--      </q-card-actions>-->
    <!--    </q-card>-->
    <!--  </q-dialog>-->

    <!--  &lt;!&ndash;  Create stack prompt&ndash;&gt;-->
    <!--  <q-dialog v-model="builderPrompt" persistent>-->
    <!--    <q-card style="min-width: 350px">-->
    <!--      <q-card-section>-->
    <!--        <div class="text-h6">Stack name</div>-->
    <!--      </q-card-section>-->

    <!--      <q-card-section class="q-pt-none">-->
    <!--        <q-input-->
    <!--          dense-->
    <!--          v-model="stackName"-->
    <!--          autofocus-->
    <!--          @keyup.enter.prevent="createStack"-->
    <!--          @keyup.esc.prevent="builderPrompt = false"-->
    <!--        />-->
    <!--      </q-card-section>-->

    <!--      <q-card-actions align="right" class="text-primary">-->
    <!--        <q-btn flat label="Cancel" v-close-popup />-->
    <!--        <q-btn-->
    <!--          flat-->
    <!--          label="Confirm"-->
    <!--          color="green"-->
    <!--          v-close-popup-->
    <!--          @click="createStack"-->
    <!--        />-->
    <!--      </q-card-actions>-->
    <!--    </q-card>-->
    <!--  </q-dialog>-->
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash-es';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import PomodoroCore from 'src/core/pomodoro/presentation/component/PomodoroCore.vue';
import PomodoroQueue from 'src/core/pomodoro/presentation/component/PomodoroQueue.vue';
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import StackMain from 'src/core/stack/presentation/StackMain.vue';
import { IUser } from 'src/type-defs/userTypes';
import { isEmptyObj } from 'src/util/is-empty-object.util';

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const selectorStore = useSelectorStore();
const stackStore = useStackStore();
const timerStore = useTimerStore();
const builderStore = useBuilderStore();
const userStore = useUserStore();
const { editNow } = storeToRefs(selectorStore);
const { user: userRef } = storeToRefs(useUserStore());
const { user } = userStore;
const { listTimers } = timerStore;
const { listTimers: listTimerRefs } = storeToRefs(timerStore);
const cancelBtnPrompt = ref(false);

selectorStore.importFrom = 'PomodoroMain';

const { isEditBuilder, stackInBuilder } = storeToRefs(useBuilderStore());

const $q = useQuasar();

const builderPrompt = ref(false);
const builderWarn = ref(false);
const stackName = ref('');

const createStacksBtn = () => {
  if (isEmptyObj(builderStore.getBuilder)) {
    builderPrompt.value = true;
  } else {
    builderWarn.value = true;
  }
};

const createStack = () => {
  builderStore.createStack(stackName.value);
  builderPrompt.value = false;
  editNow.value = 'builder';
};

const saveStackBtn = () => {
  const stack = builderStore.stackInBuilder;
  if (stack.stacksToFrag.length === 0) {
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message:
        '스택이 비어있습니다. 우측 타이머 영역에서 스택을 끌어와 추가해주세요.',
    });
  } else {
    saveStack(stack);
    resetBuilder();
    editNow.value = '';
  }
};

const saveStack = async (stack: IStack) => {
  if (user !== null) {
    await timerStore.saveTimer();
    await builderStore.saveStack(stack);
    await stackStore.fetchAll();
  } else {
    stackStore.stacksIds.push(stack.id);
    stackStore.stacks[stack.id] = stack;
  }
  editNow.value = '';
};

const resetBuilder = () => {
  builderStore.$reset();
  cancelBtnPrompt.value = false;
  editNow.value = '';
  builderStore.stackInBuilder = _.cloneDeep({} as IStack);
};

const drawerMinHeight = 36;
const drawerTopOffset = 100;
const drawerOpenRatioHalf = 50;

const drawerPos = ref(drawerMinHeight);
let animateTimeout: number;

const drawerMaxHeight = computed(() => {
  return Math.max(0, window.innerHeight - drawerTopOffset);
});

const drawerOpenRatio = computed(() => {
  return Math.round(
    (Math.max(0, drawerPos.value - drawerMinHeight) /
      Math.max(1, drawerMaxHeight.value - drawerMinHeight)) *
      100
  );
});

const drawerStyle = computed(() => {
  return {
    height: `${drawerMaxHeight.value}px`,
    transform: `translateY(${-drawerPos.value}px)`,
  };
});

const drawerMode = computed(() => {
  if (drawerOpenRatio.value > drawerOpenRatioHalf) {
    return 'full';
  }

  return drawerOpenRatio.value > 0 ? 'half' : 'handler';
});

const slideDrawer = (ev: {
  direction: string;
  delta: { x: number; y: number };
  isFinal: boolean;
}) => {
  const { direction, delta, isFinal } = ev;
  drawerPos.value = Math.max(
    drawerMinHeight,
    Math.min(drawerMaxHeight.value, drawerPos.value - delta.y)
  );

  if (isFinal === true) {
    const aboveHalf = drawerOpenRatio.value > drawerOpenRatioHalf;
    const targetHeight =
      direction === 'up'
        ? aboveHalf
          ? drawerMaxHeight.value
          : Math.round(drawerMaxHeight.value / 2)
        : aboveHalf
        ? Math.round(drawerMaxHeight.value / 2)
        : drawerMinHeight;

    animateDrawerTo(targetHeight);
  }
};

const cycleDrawer = () => {
  const targetHeight =
    drawerMode.value === 'handler'
      ? Math.round(drawerMaxHeight.value / 2)
      : drawerMode.value === 'half'
      ? drawerMaxHeight.value
      : drawerMinHeight;

  animateDrawerTo(targetHeight);
};

const animateDrawerTo = (height: number) => {
  clearTimeout(animateTimeout);

  const diff = height - drawerPos.value;

  if (diff !== 0) {
    drawerPos.value += Math.abs(diff) < 2 ? diff : Math.round(diff / 2);

    animateTimeout = window.setTimeout(() => {
      animateDrawerTo(height);
    }, 30);
  }
};

onMounted(() => {
  window.addEventListener('resize', () => {
    drawerPos.value = drawerMinHeight;
  });
});

onBeforeUnmount(() => {
  clearTimeout(animateTimeout);
});
</script>

<style scoped lang="scss">
.area {
  background-color: #f2f2f2;
  border-radius: 30px;
}

.q-dialog__inner > div {
  box-shadow: none;
  border: solid rgba(0, 0, 0, 0.12) 0.1px;
  // border:solid grey 0.01px;
}

.slide-drawer {
  &--bottom {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    // background-color: #333;
    // background-image: radial-gradient(
    //     circle,
    //     rgba(0, 0, 0, 0.1) 0%,
    //     rgba(0, 0, 0, 0.4) 100%
    // );
    bottom: unset;
    top: 100%;
    transition: background-color 0.3s ease-in-out;

    > div:last-child,
    > img:last-child {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    // &.slide-drawer--open-half {
    //   background-color: #014a88;
    // }
    //
    // &.slide-drawer--open-full {
    //   background-color: #01884a;
    // }
  }

  &__handler {
    &--horizontal {
      cursor: grab;
      > .open-dash {
        width: 60px;
        height: 8px;
        border-radius: 4px;
        background-color: #003333;
      }
    }
  }
}
</style>
