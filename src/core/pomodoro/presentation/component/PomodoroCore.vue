<template>
  <div class="row dense justify-center" style="height: 35vh">
    <!--    Total Duration: {{ getTotalDuration }} <br />-->
    <!--    Round: {{ round }} <br />-->
    <!--    amount: {{ currDuration }} <br />-->
    <!--    action: {{ pomodoroStore.state }} <br />-->
    <!--    mode: {{ pomodoroStore.mode }} <br />-->
<!--        timer: {{ pomodoroStore.timer }}<br />-->
    <!--    stack: {{ pomodoroStore.stack }}-->
    <!--    {{ otherValue }}-->
    <div class="row justify-start">
      현재 알림 설정: {{ permission === 'granted' ? 'On' : 'Off' }}
    </div>
    <q-space class="flex-break"></q-space>

    <div id="clock">
      <div class="time">{{ timeFormatter }}</div>
    </div>
    <q-space class="flex-break"></q-space>
    <div>
      <q-toggle
        v-model="endless"
        icon="all_inclusive"
        class="q-pr-sm"
        color="orange-6"
      />
      <q-toggle
        v-model="autoStart"
        icon="autorenew"
        color="purple-6"
        class="q-pr-sm"
      />
      <q-toggle
        v-model="notification"
        icon="notifications_active"
        color="teal-6"
      />
    </div>

    <q-space class="flex-break"></q-space>

    <div class="row justify-center col-3 no-wrap text-no-wrap">
      <q-btn
        v-if="pomodoroStore.state !== 'start'"
        color="green-7"
        text-color="white"
        @click="start"
        >start</q-btn
      >
      <q-btn
        v-else-if="pomodoroStore.state === 'start'"
        color="yellow"
        text-color="black"
        @click="pause"
        >pause</q-btn
      >
      <q-btn class="q-ml-lg" color="red" text-color="white" @click="stop"
        >stop</q-btn
      >
    </div>

    <q-space class="flex-break"></q-space>
    <q-card class="no-shadow my-card flat" style="background: transparent">
      <q-card-section class="q-py-none">
<!--        Stack-->
        <div
          v-if="pomodoroStore.mode === 'stack'"
          class="row justify-between no-wrap"
          style="height: 5rem; white-space: nowrap"
        >
          <div
            v-for="(t, index) in stack.stacksToFrag"
            :key="t.frag.fragId"
            class="q-pa-none row no-wrap"
          >
            <q-card
              class="inner-my-card text-white flat"
              :style="index === round ? highlightBorder : notCurrent"
            >
              <q-card-section v-show="'frag' in t" class="q-img-container">
                <div>Name: {{ t['frag']['name'] }}</div>
                <div>Duration: {{ t['frag']['duration'] }}<br /></div>
              </q-card-section>
            </q-card>
            <div class="row items-center">
              <q-icon
                v-if="arrowDrawer(index)"
                name="arrow_right"
                style="font-size: 4rem; color: grey"
              ></q-icon>
            </div>
          </div>
        </div>

<!--        Timer-->
        <div
          v-else-if="pomodoroStore.mode === 'timer'"
          class="row justify-between no-wrap"
          style="height: 5rem; white-space: nowrap"
        >
          <div class="q-pa-none row no-wrap">
            <q-card
              class="inner-my-card text-white flat"
              :style="highlightBorder"
            >
              <q-card-section class="q-img-container">
                <div>Name: {{ pomodoroStore.timer.name }}</div>
                <div>Duration: {{ pomodoroStore.timer.duration }}<br /></div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue';

const $q = useQuasar();

dayjs.extend(duration);
dayjs.extend(relativeTime);

const pomodoroStore = usePomodoroStore();
const { stack } = storeToRefs(usePomodoroStore());
let { round } = storeToRefs(usePomodoroStore());
const { permission } = Notification;
const stackStore = useStackStore();
const timerStore = useTimerStore();

const notifOptions: NotificationOptions = {
  tag: 'round',
  requireInteraction: false,
};

let started: string | number | NodeJS.Timeout | undefined;

// TODO: Pinia에 state로 저장
const endless = ref(false);
const autoStart = ref(false);
const notification = ref(false);

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('./sw.js')
//     .then(function (registration) {
//       console.log('Service worker successfully registered.');
//       return registration;
//     })
//     .catch(function (err) {
//       console.error('Unable to register service worker.', err);
//     });
// }

const currDuration = computed(() => {
  if (pomodoroStore.mode === 'stack') {
    const data = pomodoroStore.stack;
    if ('stacksToFrag' in data && round.value < data.stacksToFrag.length) {
      return data.stacksToFrag[round.value].frag.duration;
    }
  } else if (pomodoroStore.mode === 'timer') {
    return pomodoroStore.timer.duration;
  }
  return 0;
});

const timeFormatter = computed(() => {
  const formatted = dayjs
    .duration(currDuration.value, 'seconds')
    .format('HH:mm:ss');
  return formatted;
});

const arrowDrawer = (index: number) => {
  return !!stack.value && index !== stack.value.stacksToFrag.length - 1;
};

const start = () => {
  if (pomodoroStore.state === 'start') return;
  if ('stacksToFrag' in pomodoroStore.stack || 'fragId' in pomodoroStore.timer) {
    started = setInterval(elapse, 1000);
    pomodoroStore.state = 'start';
  } else {
    $q.notify({
      color: 'warning',
      message: '우선 작동 시킬 타이머 혹은 스택을 더블클릭하여 셋팅해주세요.',
      textColor: 'black',
    });
    clearInterval(started);
  }
};

// watchEffect(() => {
//   const time = pomodoroStore.getTotalDuration;
//   if (time <= 0 && !endless.value) {
//     $q.notify({
//       message: '타이머를 종료합니다.',
//     });
//     // nextTick(() => {
//     //   loadSession();
//     // });
//   }
// });

const elapse = () => {
  let timer;
  if (pomodoroStore.mode === 'stack') {
    timer = pomodoroStore.stack.stacksToFrag[round.value].frag;
    pomodoroStore.stack.stacksToFrag[round.value].frag.duration--;
  } else if (pomodoroStore.mode === 'timer') {
    timer = pomodoroStore.timer;
    timer.duration--;
  }
  if (timer !== undefined && timer.duration <= 0) {
    if (!!notification.value) {
      clearInterval(started);
      notifyRoundEnd();
    }
    pomodoroStore.round++;
    timeEnd();
  }
};

const pause = () => {
  // TODO: 시간 정보 출력 부분이 깜빡이는 트랜지션 추가
  if (pomodoroStore.state === 'pause') return;
  pomodoroStore.state = 'pause';

  clearInterval(started);
};

const stop = () => {
  if (pomodoroStore.state === 'stop') return;
  loadSession();
  pomodoroStore.state = 'stop';
  pomodoroStore.round = 0;
  clearInterval(started);
};

const loadSession = () => {
  let data;
  if (pomodoroStore.mode === 'stack') {
    data = $q.sessionStorage.getItem('pomodoro-data') as IStack;
    pomodoroStore.stack = { ...data } as IStack;
    pomodoroStore.timer = {} as ITimer;
    const id = data.id;
    stackStore.stacks[id] = data;
  } else if (pomodoroStore.mode === 'timer') {
    data = $q.sessionStorage.getItem('timer-data') as ITimer;
    pomodoroStore.timer = { ...data } as ITimer;
    pomodoroStore.stack = {} as IStack;
    const id = data.fragId;
    timerStore.timers[id] = data;
  }
};

const setNotification = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

watch([notification, autoStart, Notification.permission], () => {
  if (notification.value === true) {
    setNotification();
    if (Notification.permission === 'granted') {
      new Notification(
        '알림 설정을 활성화합니다.\n타이머 종료 시, 데스크톱 알림을 전송합니다.',
        notifOptions
      );
    }
  } else {
    $q.notify({
      message: '알림 설정을 비활성화합니다.',
      color: 'grey',
    });
  }
  if (Notification.permission === 'granted') {
    if (autoStart.value === true) {
      new Notification(
        '자동 시작 기능을 활성화합니다.\n라운드 종료 시, 다음 라운드를 자동으로 실행합니다.',
        notifOptions
      );
    }
  }
});

const timeEnd = () => {
  if (
    pomodoroStore.mode === 'stack' &&
    +round.value >= +pomodoroStore.stack.stacksToFrag.length
  ) {
    if (endless.value) {
      round.value = 0;
    } else {
      clearInterval(started);
      pomodoroStore.state = '';
      pomodoroStore.round = 0;
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  } else if (pomodoroStore.mode === 'timer' && +round.value >= 1) {
    if (endless.value) {
      round.value = 0;
    } else {
      clearInterval(started);
      pomodoroStore.state = '';
      pomodoroStore.round = 0;
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  }
  loadSession();
};

function endRoundPush(timerInfo: string) {
  pomodoroStore.state = 'pause';
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Round ends notification', {
        ...notifOptions,
        requireInteraction: false,
        body: `다음 타이머를 실행하시겠습니까?\n${timerInfo}`,
        actions: [
          {
            title: 'Confirm',
            action: 'confirm',
          },
          {
            title: 'Cancel',
            action: 'close',
          },
        ],
      });
    });
  }
}

const notifyRoundEnd = () => {
  let name = '';
  let duration = 0;
  const nextRound = round.value + 1;

  if (pomodoroStore.mode === 'stack') {
    const timer = pomodoroStore.stack.stacksToFrag[nextRound].frag;
    name = timer.name;
    duration = timer.duration;
  } else {
    const id = pomodoroStore.timer.fragId;
    const timer = timerStore.timers[id];
    name = timer.name;
    duration = timer.duration;
  }

  let nextTimerInfo = `타이머 이름: ${name}\t시간: ${duration}`;

  if (!!autoStart.value) {
    new Notification(
      `다음 타이머를 실행합니다.\n${nextTimerInfo}`,
      notifOptions
    );
    started = setInterval(elapse, 1000);
  } else {
    if (
      !(
        pomodoroStore.mode === 'stack' &&
        round.value > pomodoroStore.stack.stacksToFrag.length
      )
    ) {
      endRoundPush(nextTimerInfo);
    } else {
      new Notification('모든 타이머를 실행했습니다.');
    }
  }
};

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data === 'confirm') {
        started = setInterval(elapse, 1000);
      }
    });
  }
});

const highlightBorder = {
  background: 'black',
  width: '12vw',
  border: 'solid red 0.3rem',
};

const notCurrent = {
  background: 'black',
  width: '12vw',
  border: 'solid black 0.3rem',
};
</script>

<style scoped lang="scss">
.flex-break {
  flex: 1 0 100% !important;
  height: 0;
  margin: 0;
  border: 0;
}

$color: black;
$color-light: white;

@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono');

#clock {
  order: 0;
  flex: 0 1 auto;
  align-self: center;

  color: $color;
  //text-shadow: 0px 0px 25px $color;

  .time {
    font-family: 'Share Tech Mono', sans-serif;
    font-size: 3rem;
  }
}
</style>
