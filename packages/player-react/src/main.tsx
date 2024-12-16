import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { EasyAudioPlayerProps, bem, namespace } from 'easy-audio-player-shared';
import PlayerVolume from './components/volume';
import PlayerProgress from './components/progress';

const useStopOtherPlayers = (closePlayer: () => void) => {
  const EventName = 'stop-easy-audio-player';
  const id = useId();

  const stopOtherPlayers = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent(EventName, {
        detail: { excludedId: id },
      }),
    );
  }, []);

  const stopOtherPlayersHandler = useCallback(
    (event: CustomEvent<{ excludedId: string }>) => {
      if (event.detail.excludedId === id) return;
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
  }, [closePlayer]);

  return { stopOtherPlayers };
};

const EasyAudioPlayer: React.FC<EasyAudioPlayerProps> = ({
  url,
  options = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { stopOthersOnPlay = true, showDownloadButton = true } = options;

  const onUpdateVolume = useCallback((volume: number) => {
    if (!playerRef.current) return;
    playerRef.current.volume = volume;
  }, []);

  const closePlayer = useCallback(() => {
    playerRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const { stopOtherPlayers } = useStopOtherPlayers(closePlayer);

  const togglePlay = useCallback(async () => {
    if (!playerRef.current) return;

    try {
      if (playerRef.current.paused) {
        if (stopOthersOnPlay) {
          stopOtherPlayers();
        }
        setIsLoading(true);
        await playerRef.current.play();
        setIsPlaying(true);
      } else {
        closePlayer();
      }
    } catch (error) {
      console.error('Play fail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [closePlayer, stopOtherPlayers]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    player.addEventListener('waiting', onWaiting);
    player.addEventListener('canplay', onCanPlay);

    return () => {
      player.removeEventListener('waiting', onWaiting);
      player.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  const downloadAudio = useCallback(() => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'audio';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [url]);

  return (
    <div className={namespace} ref={containerRef}>
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

        <PlayerProgress player={playerRef.current} />

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

        <audio ref={playerRef} src={url} preload="metadata" />
      </div>
    </div>
  );
};

export default EasyAudioPlayer;
