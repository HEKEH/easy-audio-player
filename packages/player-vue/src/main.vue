<template>
  <div class="easy-audio-player" ref="container">
    <div class="player-controls">
      <!-- Play/Pause Button -->
      <button
        :class="['play-pause-btn', { loading: isLoading }]"
        @click="togglePlay"
        :disabled="isLoading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 24"
          class="play-pause-btn__icon"
        >
          <path
            fill-rule="evenodd"
            :d="isPlaying ? 'M0 0h6v24H0zM12 0h6v24h-6z' : 'M18 12L0 24V0'"
          />
        </svg>
      </button>

      <!-- Progress Bar -->
      <player-progress :player="player" />

      <div class="right-controls">
        <!-- Volume Controls -->
        <player-volume @update:volume="onUpdateVolume" />
        <!-- Download Button -->
        <button
          v-if="showDownloadButton"
          class="control-btn"
          @click="downloadAudio"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="control-btn__icon"
          >
            <path
              fill-rule="evenodd"
              d="M19 9h-4V3H9v6H5l7 8 7-8zM5 18v3h14v-3H5z"
            />
          </svg>
        </button>
      </div>

      <audio ref="player" :src="url" preload="metadata"></audio>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  type PropType,
} from 'vue';
import type {
  AudioPlayerOptions,
  EasyAudioPlayerProps,
} from 'easy-audio-player-shared';
import PlayerVolume from './components/volume.vue';
import PlayerProgress from './components/progress.vue';

const EasyAudioPlayer = defineComponent({
  name: 'EasyAudioPlayer',
  components: {
    PlayerVolume,
    PlayerProgress,
  },

  props: {
    url: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<AudioPlayerOptions>,
      default: () => ({}),
    },
  },

  setup(props: EasyAudioPlayerProps) {
    const container = ref<HTMLElement | null>(null);
    const player = ref<HTMLAudioElement | null>(null);
    const isPlaying = ref(false);
    const isLoading = ref(false);
    const { stopOthersOnPlay = true } = props.options;

    const onUpdateVolume = (volume: number) => {
      if (!player.value) return;
      player.value.volume = volume;
    };

    const closePlayer = () => {
      player.value?.pause();
      isPlaying.value = false;
    };

    const { stopOtherPlayers } = useStopOtherPlayers(closePlayer);

    const togglePlay = async () => {
      if (!player.value) return;

      try {
        if (player.value.paused) {
          if (stopOthersOnPlay) {
            stopOtherPlayers();
          }
          isLoading.value = true;
          await player.value.play();
          isPlaying.value = true;
        } else {
          closePlayer();
        }
      } catch (error) {
        console.error('Play fail:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const playerEvents = {
      waiting: () => {
        isLoading.value = true;
      },
      canplay: () => {
        isLoading.value = false;
      },
    };

    onMounted(() => {
      if (!player.value) return;
      Object.entries(playerEvents).forEach(([event, handler]) => {
        player.value?.addEventListener(event, handler);
      });
    });

    onBeforeUnmount(() => {
      if (!player.value) return;

      Object.entries(playerEvents).forEach(([event, handler]) => {
        player.value?.removeEventListener(event, handler);
      });
    });
    const downloadAudio = () => {
      const link = document.createElement('a');
      link.href = props.url;
      link.download = props.url.split('/').pop() || 'audio';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return {
      container,
      player,
      isPlaying,
      isLoading,
      showDownloadButton: computed(
        () => props.options.showDownloadButton ?? true,
      ),
      togglePlay,
      downloadAudio,
      onUpdateVolume,
    };
  },
});

const useStopOtherPlayers = (closePlayer: () => void) => {
  const EventName = 'stop-easy-audio-player';
  const id = useId();
  const stopOtherPlayers = () => {
    document.dispatchEvent(
      new CustomEvent(EventName, {
        detail: { excludedId: id },
      }),
    );
  };

  const stopOtherPlayersHandler = (
    event: CustomEvent<{
      excludedId: string;
    }>,
  ) => {
    if (event.detail.excludedId === id) return;
    closePlayer();
  };

  onMounted(() => {
    document.addEventListener(
      EventName,
      stopOtherPlayersHandler as EventListener,
    );
  });
  onBeforeUnmount(() => {
    document.removeEventListener(
      EventName,
      stopOtherPlayersHandler as EventListener,
    );
  });
  return { stopOtherPlayers };
};

export default EasyAudioPlayer;
</script>
