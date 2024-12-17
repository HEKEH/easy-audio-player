import type { EasyAudioPlayerProps } from 'easy-audio-player-shared';
import { bem, namespace } from 'easy-audio-player-shared';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

import PlayerProgress from './components/progress';
import PlayerVolume from './components/volume';

type EventListener = (event: Event) => void;

function useStopOtherPlayers(closePlayer: () => void) {
  const EventName = 'stop-easy-audio-player';
  const id = useId();

  const stopOtherPlayers = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent(EventName, {
        detail: { excludedId: id },
      }),
    );
  }, [id]);

  const stopOtherPlayersHandler = useCallback(
    (event: CustomEvent<{ excludedId: string }>) => {
      if (event.detail.excludedId === id) {
        return;
      }
      closePlayer();
    },
    [closePlayer, id],
  );

  useEffect(() => {
    document.addEventListener(
      EventName,
      stopOtherPlayersHandler as EventListener,
    );
    return () => {
      document.removeEventListener(
        EventName,
        stopOtherPlayersHandler as EventListener,
      );
    };
  }, [stopOtherPlayersHandler]);

  return { stopOtherPlayers };
}

const EasyAudioPlayerController: React.FC<
  EasyAudioPlayerProps & {
    player: HTMLAudioElement;
  }
> = ({ player, url, options }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { stopOthersOnPlay = true, showDownloadButton = true } = options;

  const onUpdateVolume = useCallback(
    (volume: number) => {
      player.volume = volume;
    },
    [player],
  );

  const closePlayer = useCallback(() => {
    player.pause();
    setIsPlaying(false);
  }, [player]);

  const { stopOtherPlayers } = useStopOtherPlayers(closePlayer);

  const togglePlay = useCallback(async () => {
    try {
      if (player.paused) {
        if (stopOthersOnPlay) {
          stopOtherPlayers();
        }
        setIsLoading(true);
        await player.play();
        setIsPlaying(true);
      } else {
        closePlayer();
      }
    } catch (error) {
      console.error('Play fail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [closePlayer, player, stopOtherPlayers, stopOthersOnPlay]);

  useEffect(() => {
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    player.addEventListener('waiting', onWaiting);
    player.addEventListener('canplay', onCanPlay);

    return () => {
      player.removeEventListener('waiting', onWaiting);
      player.removeEventListener('canplay', onCanPlay);
    };
  }, [player]);

  const downloadAudio = useCallback(() => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'audio';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [url]);

  return (
    <div className={bem('controls')}>
      <button
        className={`${bem('pause-btn')} ${
          isLoading ? bem('pause-btn', '', 'loading') : ''
        }`}
        onClick={togglePlay}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 24"
          className={bem('pause-btn', 'icon')}
        >
          <path
            fillRule="evenodd"
            d={isPlaying ? 'M0 0h6v24H0zM12 0h6v24h-6z' : 'M18 12L0 24V0'}
          />
        </svg>
      </button>

      <PlayerProgress player={player} />

      <div className={bem('right-controls')}>
        <PlayerVolume onVolumeChange={onUpdateVolume} />
        {showDownloadButton && (
          <button className={bem('control-btn')} onClick={downloadAudio}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={bem('control-btn', 'icon')}
            >
              <path
                fillRule="evenodd"
                d="M19 9h-4V3H9v6H5l7 8 7-8zM5 18v3h14v-3H5z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const EasyAudioPlayer: React.FC<EasyAudioPlayerProps> = ({
  url,
  options = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);

  return (
    <div className={namespace} ref={containerRef}>
      <audio ref={setPlayer} src={url} preload="metadata" />
      {player ? (
        <EasyAudioPlayerController
          player={player}
          url={url}
          options={options}
        />
      ) : null}
    </div>
  );
};

export default EasyAudioPlayer;
