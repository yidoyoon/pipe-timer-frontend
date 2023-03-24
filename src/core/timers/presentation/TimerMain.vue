<template>
  <q-drawer
    v-model="rightDrawerOpen"
    side="right"
    borderd
    :width="$q.platform.is.desktop ? 220 : 170"
    :breakpoint="600"
  >
    <q-scroll-area style="height: 100%; border-left: 1px solid #ddd">
      <q-list padding>
        <q-item-section>
          <q-item class="justify-center q-pa-sm q-pr-md">
            <q-item-label v-if="isLoggedIn"
              >Logged in as
              <span>
                <b>{{ userStoreRefs.user.value.userName }}</b>
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup to="/users/setting">
                      <q-item-section>Setting</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </span>
            </q-item-label>
            <div v-if="!isLoggedIn">
              <q-item-label class="lt-md fontsize-11"
                >타이머, 루틴 정보를 서버에<br />저장하려면 로그인
                해주세요.</q-item-label
              >
              <q-item-label class="gt-sm"
                >타이머, 루틴 정보를 서버에<br />저장하려면 로그인
                해주세요.</q-item-label
              >
              <q-item-label class="lt-md fontsize-9" caption
                >기본적으로 로컬에 저장됩니다.</q-item-label
              >
              <q-item-label class="gt-sm" caption
                >기본적으로 로컬에 저장됩니다.</q-item-label
              >
            </div>
          </q-item>
        </q-item-section>

        <q-separator />

        <div class="gt-sm q-pa-md fontsize-10 row justify-center items-center">
          <q-icon name="timer" class="fontsize-12" />
          <span style="margin-left: 0.2rem">타이머 리스트</span>
        </div>
        <div class="lt-md q-pa-md fontsize-14 row justify-center items-center">
          <q-icon name="timer" class="fontsize-16" />
          <span style="margin-left: 0.2rem">타이머 리스트</span>
        </div>

        <q-separator />

        <div class="row justify-evenly">
          <div>
            <q-btn
              @click="createTimerBtn"
              dense
              icon="add"
              flat
              label="add"
              text-color="positive"
              class="q-pr-sm"
            />
            <q-tooltip anchor="top middle" self="top middle">
              타이머를 생성합니다.
            </q-tooltip>
          </div>

          <q-separator vertical />

          <div>
            <q-btn
              @click="saveTimersBtn"
              dense
              icon="save"
              flat
              label="save"
              text-color="positive"
              class="q-pr-sm"
              :disable="isEmptyObj(timerStoreRef.listTimers)"
            />
            <q-tooltip
              v-if="isEmptyObj(timerStoreRef.listTimers)"
              anchor="top middle"
              self="top middle"
            >
              타이머가 없다면 서버에 저장할 수 없습니다.
            </q-tooltip>
            <q-tooltip v-else anchor="top middle" self="top middle">
              서버에 타이머를 저장합니다.
            </q-tooltip>
          </div>
        </div>

        <q-separator />

        <TimerCore
          :timers="timerStoreRef.listTimers.value"
          class="col-12"
          @remove="remove"
          @removeLocal="removeLocalTimer"
        />
      </q-list>
    </q-scroll-area>
  </q-drawer>

  <!--  Create timers dialog-->
  <q-dialog v-model="timerPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">새로운 타이머 생성</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          label="Name"
          v-model="timerName"
          hint="타이머의 이름을 입력해주세요."
          dense
          autofocus
          debounce="300"
          @keyup.enter.prevent="createTimer"
          @keyup.esc.prevent="timerPrompt = false"
          :error="!!nameError"
          :error-message="nameError"
        />
        <div class="row justify-start q-gutter-lg">
          <q-input
            hide-bottom-space
            label="Hour"
            v-model="hours"
            dense
            autofocus
            debounce="300"
            :input-style="{ width: '4rem' }"
            :error="!!hoursError"
            :error-message="hoursError"
          />
          <q-input
            hide-bottom-space
            label="Minutes"
            v-model="minutes"
            dense
            autofocus
            debounce="300"
            :input-style="{ width: '4rem' }"
            :error="!!minutesError"
            :error-message="minutesError"
          />
          <q-input
            hide-bottom-space
            label="Seconds"
            v-model="seconds"
            dense
            autofocus
            debounce="300"
            :input-style="{ width: '4rem' }"
            :error="!!secondsError"
            :error-message="secondsError"
          />
        </div>

        <q-input
          v-model="color"
          :rules="['anyColor']"
          hint="타이머 구분에 사용할 색상을 선택합니다."
          debounce="500"
          :error="!!colorError"
          :error-message="colorError"
          dense
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="color" no-header-tabs format-model="hexa" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="resetForm" />
        <q-btn
          flat
          label="Confirm"
          color="green"
          type="submit"
          @click="onSubmit"
          :disable="!isEmptyObj(errors)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import { Timer } from 'src/core/timers/domain/timer.model';
import { useTimerStore } from 'src/core/timers/infra/store/timer.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { isEmptyObj } from 'src/util/is-empty-object.util';
import { useField, useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import TimerCore from 'src/core/timers/presentation/components/TimerCore.vue';
import * as zod from 'zod';

const props = withDefaults(defineProps<{ rightDrawerOpen: boolean }>(), {
  rightDrawerOpen: true,
});

const timerStore = useTimerStore();
const timerStoreRef = storeToRefs(timerStore);
const userStore = useUserStore();
const routineStore = useRoutineStore();
const { user } = userStore;

const userStoreRefs = storeToRefs(userStore);
const isLoggedIn = userStoreRefs.user;

const rightDrawerOpen = ref(props.rightDrawerOpen);

timerStore.fetchAll();
routineStore.fetchAll();

const $q = useQuasar();

const timerPrompt = ref(false);

const addTimerSchema = toFormValidator(
  zod
    .object({
      timerName: zod
        .string()
        .nonempty()
        .min(1, '최소 1글자 이상으로 설정해주세요.'),
      hours: zod.coerce
        .number()
        .min(0, '최소 0 이상으로 설정해주세요.')
        .max(23, '최대 23 이하로 설정해주세요.'),
      minutes: zod.coerce
        .number()
        .min(0, '최소 0 이상으로 설정해주세요.')
        .max(59, '최대 59 이하로 설정해주세요.'),
      seconds: zod.coerce
        .number()
        .min(0, '최소 0 이상으로 설정해주세요.')
        .max(59, '최대 59 이하로 설정해주세요.'),
      color: zod
        .string()
        .nonempty()
        .regex(
          /^#[0-9A-Fa-f]{8}$/,
          '색상값 형태가 잘못되었습니다. 우측의 Colorize 아이콘을 활용해주세요.'
        ),
    })
    .refine((data) => +data.hours + +data.minutes + +data.seconds > 0, {
      path: ['seconds'],
      message: '타이머는 최소 1초 이상으로 설정되어야 합니다.',
    })
);

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: addTimerSchema,
});

const { value: timerName, errorMessage: nameError } =
  useField<string>('timerName');
const { value: hours, errorMessage: hoursError } = useField<number>('hours');
const { value: minutes, errorMessage: minutesError } =
  useField<number>('minutes');
const { value: seconds, errorMessage: secondsError } =
  useField<number>('seconds');
const { value: color, errorMessage: colorError } = useField<string>('color');

timerStore.fetchAll();

resetForm({
  values: {
    timerName: '새로운 타이머',
    hours: 0,
    minutes: 0,
    seconds: 0,
    color: '#000000ff',
  },
});

watch(props, () => {
  rightDrawerOpen.value = props.rightDrawerOpen;
});

const remove = (timerId: string) => {
  timerStore.remove(timerId);
  timerStore.fetchAll();
  routineStore.fetchAll();
};

const removeLocalTimer = (timerId: string) => {
  timerStore.remove(timerId);
  routineStore.removeLocalTimer(timerId);
};

const createTimerBtn = () => {
  timerPrompt.value = true;
};

const createTimer = () => {
  const totalDuration =
    +hours.value * 3600 + +minutes.value * 60 + +seconds.value;
  timerStore.add(
    new Timer({
      name: timerName.value,
      duration: totalDuration,
      color: color.value,
    })
  );
  timerPrompt.value = false;
};

const saveTimersBtn = () => {
  if (!!user) {
    saveTimers();
  } else {
    $q.notify({
      message: '서버 저장 기능을 이용하기 위해선 로그인이 필요합니다.',
    });
  }
};

const saveTimers = () => {
  if (!!user) {
    const res = api.post('timer/save', timerStore.listTimers);
    if (!res) {
      $q.notify({
        message: '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',
        color: 'negative',
      });
    } else {
      $q.notify({
        message: '저장을 완료했습니다.',
        color: 'positive',
      });
      timerStore.fetchAll();
    }
  }
};

const onSubmit = handleSubmit(() => {
  createTimer();
  resetForm({
    values: {
      timerName: '새로운 타이머',
      hours: 0,
      minutes: 0,
      seconds: 0,
      color: '#000000ff',
    },
  });
});
</script>
