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
  type PropType,
} from 'vue';
import PlayerVolume from './components/volume.vue';
import PlayerProgress from './components/progress.vue';

interface AudioPlayerOptions {
  showDownloadButton?: boolean;
}

interface EasyAudioPlayerProps {
  /** Audio source URL */
  url: string;
  /** Player configuration options */
  options: AudioPlayerOptions;
}

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

    const onUpdateVolume = (volume: number) => {
      if (!player.value) return;
      player.value.volume = volume;
    };

    const togglePlay = async () => {
      if (!player.value) return;

      try {
        if (player.value.paused) {
          // if (props.options.stopOthersOnPlay) {
          //   stopOtherPlayers();
          // }
          isLoading.value = true;
          await player.value.play();
          isPlaying.value = true;
        } else {
          player.value.pause();
          isPlaying.value = false;
        }
      } catch (error) {
        console.error('Playback failed:', error);
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
    return {
      container,
      player,
      isPlaying,
      isLoading,
      showDownloadButton: computed(
        () => props.options.showDownloadButton ?? true,
      ),
      togglePlay,
      downloadAudio: () => window.open(props.url, '_blank'),
      onUpdateVolume,
    };
  },
});

export default EasyAudioPlayer;
</script>
