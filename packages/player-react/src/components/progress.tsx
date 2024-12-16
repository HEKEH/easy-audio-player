import { useEffect, useRef, useState } from 'react';
import { formatTime, bem } from 'easy-audio-player-shared';

interface PlayerProgressProps {
  player: HTMLAudioElement | null;
}

const useProcess = (player: HTMLAudioElement | null) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarPinRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [isDragging, setIsDragging] = useState(false);
  const [percent, setPercent] = useState(0);

  const updateProgress = () => {
    if (!player || !progressBarRef.current || isDragging) return;

    const current = player.currentTime;
    const duration = player.duration;
    setPercent(current / duration);
    setCurrentTime(formatTime(current));
  };

  const handleProgressBarClick = (event: React.MouseEvent) => {
    if (!player || !progressBarRef.current?.parentElement) return;

    const bounds = progressBarRef.current.parentElement.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const width = bounds.width;
    const newPercent = x / width;
    setPercent(newPercent);
    player.currentTime = newPercent * player.duration;
  };

  const handleDraggingProcess = (event: MouseEvent) => {
    if (!player || !progressBarRef.current?.parentElement) return;

    const bounds = progressBarRef.current.parentElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const newPercent = x / bounds.width;
    setPercent(newPercent);
    player.currentTime = newPercent * player.duration;
  };

  const stopDraggingProcess = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDraggingProcess);
    document.removeEventListener('mouseup', stopDraggingProcess);
  };

  const startDraggingProcess = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleDraggingProcess);
    document.addEventListener('mouseup', stopDraggingProcess);
  };

  useEffect(() => {
    if (!player) return;

    const handleLoadedMetadata = () => {
      setTotalTime(formatTime(player.duration));
    };

    player.addEventListener('timeupdate', updateProgress);
    player.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      player.removeEventListener('timeupdate', updateProgress);
      player.removeEventListener('loadedmetadata', handleLoadedMetadata);
      document.removeEventListener('mousemove', handleDraggingProcess);
      document.removeEventListener('mouseup', stopDraggingProcess);
    };
  }, [player]);

  return {
    progressBarRef,
    progressBarPinRef,
    currentTime,
    totalTime,
    percent,
    handleProgressBarClick,
    startDraggingProcess,
  };
};

const PlayerProgress: React.FC<PlayerProgressProps> = ({ player }) => {
  const {
    progressBarRef,
    progressBarPinRef,
    currentTime,
    totalTime,
    percent,
    handleProgressBarClick,
    startDraggingProcess,
  } = useProcess(player);

  return (
    <div className={bem('progress')}>
      <span className={bem('progress', 'current-time')}>{currentTime}</span>
      <div
        className={bem('progress-bar', 'wrapper')}
        onClick={handleProgressBarClick}
      >
        <div className={bem('progress-bar')}>
          <div
            className={bem('progress-bar', 'fill')}
            ref={progressBarRef}
            style={{ width: `${percent * 100}%` }}
          >
            <div
              className={bem('progress-bar', 'pin')}
              ref={progressBarPinRef}
              onMouseDown={startDraggingProcess}
              onDragStart={e => e.preventDefault()}
            />
          </div>
        </div>
      </div>
      <span className={bem('progress', 'total-time')}>{totalTime}</span>
    </div>
  );
};

export default PlayerProgress;
