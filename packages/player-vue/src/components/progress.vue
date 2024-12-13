<script lang="ts">
import { bem, formatTime } from 'easy-audio-player-shared';
import {
  defineComponent,
  onBeforeUnmount,
  type PropType,
  ref,
  type Ref,
  toRef,
  watch,
} from 'vue';

function useProcess(player: Ref<HTMLAudioElement | null>) {
  const progressBar = ref<HTMLElement | null>(null);
  const progressBarPin = ref<HTMLElement | null>(null);
  const currentTime = ref('00:00');
  const totalTime = ref('00:00');
  const isDragging = ref(false);
  const percent = ref(0);

  const updateProgress = () => {
    if (!player.value || !progressBar.value || isDragging.value) {
      return;
    }

    const current = player.value.currentTime;
    const duration = player.value.duration;
    percent.value = current / duration;

    currentTime.value = formatTime(current);
  };

  const handleProgressBarClick = (event: MouseEvent) => {
    if (!player.value || !progressBar.value?.parentElement) {
      return;
    }

    const bounds = progressBar.value.parentElement.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const width = bounds.width;
    percent.value = x / width;
    player.value.currentTime = percent.value * player.value.duration;
  };

  const handleDraggingProcess = (event: MouseEvent) => {
    if (!player.value || !progressBar.value?.parentElement) {
      return;
    }

    const bounds = progressBar.value.parentElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    percent.value = x / bounds.width;
    player.value.currentTime = percent.value * player.value.duration;
  };

  const stopDraggingProcess = () => {
    isDragging.value = false;
    // eslint-disable-next-line ts/no-use-before-define
    removeDraggingProcessListeners();
  };

  const removeDraggingProcessListeners = () => {
    document.removeEventListener('mousemove', handleDraggingProcess);
    document.removeEventListener('mouseup', stopDraggingProcess);
  };

  const startDraggingProcess = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    isDragging.value = true;
    document.addEventListener('mousemove', handleDraggingProcess);
    document.addEventListener('mouseup', stopDraggingProcess);
  };

  const playerEvents = {
    timeupdate: updateProgress,
    loadedmetadata: () => {
      totalTime.value = formatTime(player.value?.duration || 0);
    },
  };

  watch(
    () => player.value,
    (newPlayer, oldPlayer) => {
      if (oldPlayer) {
        Object.entries(playerEvents).forEach(([event, handler]) => {
          oldPlayer.removeEventListener(event, handler);
        });
      }
      if (newPlayer) {
        Object.entries(playerEvents).forEach(([event, handler]) => {
          newPlayer.addEventListener(event, handler);
        });
      }
    },
  );

  onBeforeUnmount(() => {
    const playerDom = player.value;
    if (playerDom) {
      Object.entries(playerEvents).forEach(([event, handler]) => {
        playerDom.removeEventListener(event, handler);
      });
    }
    removeDraggingProcessListeners();
  });

  return {
    progressBar,
    progressBarPin,
    currentTime,
    totalTime,
    percent,
    updateProgress,
    handleProgressBarClick,
    startDraggingProcess,
  };
}

const PlayerProgress = defineComponent({
  name: 'PlayerProgress',
  props: {
    player: {
      type: [Object, null] as PropType<HTMLAudioElement | null>,
      required: true,
    },
  },

  setup(props) {
    const {
      progressBar,
      progressBarPin,
      currentTime,
      totalTime,
      percent,
      updateProgress,
      handleProgressBarClick,
      startDraggingProcess,
    } = useProcess(toRef(props, 'player'));

    return {
      progressBar,
      progressBarPin,
      currentTime,
      totalTime,
      percent,
      updateProgress,
      handleProgressBarClick,
      startDraggingProcess,
      bem,
    };
  },
});

export default PlayerProgress;
</script>

<template>
  <!-- Progress Bar -->
  <div :class="bem('progress')">
    <span :class="bem('progress', 'current-time')">{{ currentTime }}</span>
    <div
      :class="bem('progress-bar', 'wrapper')"
      @click="handleProgressBarClick"
    >
      <div :class="bem('progress-bar')">
        <div
          ref="progressBar"
          :class="bem('progress-bar', 'fill')"
          :style="{ width: `${percent * 100}%` }"
        >
          <div
            ref="progressBarPin"
            :class="bem('progress-bar', 'pin')"
            @mousedown="startDraggingProcess"
            @dragstart.prevent
          />
        </div>
      </div>
    </div>
    <span :class="bem('progress', 'total-time')">{{ totalTime }}</span>
  </div>
</template>
