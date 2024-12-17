import { bem } from 'easy-audio-player-shared';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

interface PlayerVolumeProps {
  onVolumeChange: (volume: number) => void;
}

function useVolume(onVolumeChange: (volume: number) => void) {
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const volumeBarPinRef = useRef<HTMLDivElement>(null);
  const volumeBarWrapperRef = useRef<HTMLDivElement>(null);
  const [volumePercentage, setVolumePercentage] = useState(1);
  const [isVolumeOpen, setIsVolumeOpen] = useState(true);
  const isDraggingRef = useRef(false);

  const handleVolumeBarClick = useCallback((event: React.MouseEvent) => {
    if (!volumeBarRef.current?.parentElement || isDraggingRef.current) {
      return;
    }
    setIsVolumeOpen(true);
    const bounds = volumeBarRef.current.parentElement.getBoundingClientRect();
    const y = bounds.bottom - event.clientY;
    const height = bounds.height;
    const percentage = Math.max(0, Math.min(y / height, 1));
    setVolumePercentage(percentage);
  }, []);

  const handleDraggingVolume = useCallback((event: MouseEvent) => {
    if (!volumeBarRef.current?.parentElement) {
      return;
    }
    const bounds = volumeBarRef.current.parentElement.getBoundingClientRect();
    if (bounds.height === 0) {
      return;
    }
    const y = bounds.bottom - event.clientY;
    const percentage =
      Math.round(Math.max(0, Math.min((y / bounds.height) * 100, 100))) / 100;
    setVolumePercentage(percentage);
  }, []);

  const stopDraggingVolume = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleDraggingVolume);
    document.removeEventListener('mouseup', stopDraggingVolume);
  }, [handleDraggingVolume]);

  const startDraggingVolume = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleDraggingVolume);
      document.addEventListener('mouseup', stopDraggingVolume);
    },
    [handleDraggingVolume, stopDraggingVolume],
  );

  const toggleVolumeOpen = useCallback(() => {
    setIsVolumeOpen(prev => !prev);
  }, []);

  const volume = isVolumeOpen ? volumePercentage : 0;

  useEffect(() => {
    onVolumeChange(volume);
  }, [volume, onVolumeChange]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDraggingVolume);
    };
  }, [handleDraggingVolume]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', stopDraggingVolume);
    };
  }, [stopDraggingVolume]);

  return {
    volumeBarRef,
    volumeBarPinRef,
    volumeBarWrapperRef,
    volume,
    handleVolumeBarClick,
    startDraggingVolume,
    toggleVolumeOpen,
  };
}

const PlayerVolume: React.FC<PlayerVolumeProps> = ({ onVolumeChange }) => {
  const {
    volumeBarRef,
    volumeBarPinRef,
    volumeBarWrapperRef,
    volume,
    handleVolumeBarClick,
    startDraggingVolume,
    toggleVolumeOpen,
  } = useVolume(onVolumeChange);

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const hideTimeoutRef = useRef<number>();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      { name: 'offset', options: { offset: [0, 2] } },
      { name: 'arrow', enabled: false },
    ],
  });

  const handleMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    setIsPopperOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsPopperOpen(false);
    }, 200);
  }, []);

  return (
    <>
      <button
        ref={setReferenceElement}
        className={bem('control-btn')}
        onClick={toggleVolumeOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          className={bem('control-btn', 'icon')}
        >
          {volume === 0 ? (
            <>
              <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z" />
              <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zm5.195 13.195-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z" />
            </>
          ) : (
            <>
              <path
                fillRule="evenodd"
                d="M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zm4.258-.872a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"
              />
              <path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z" />
            </>
          )}
        </svg>
      </button>

      {isPopperOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          className={bem('volume', 'popover')}
          {...attributes.popper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={bem('volume-bar', 'wrapper')}
            ref={volumeBarWrapperRef}
          >
            <div className={bem('volume-bar')} onClick={handleVolumeBarClick}>
              <div
                className={bem('volume-bar', 'fill')}
                ref={volumeBarRef}
                style={{ height: `${volume * 100}%` }}
              >
                <div
                  className={bem('volume-bar', 'pin')}
                  ref={volumeBarPinRef}
                  onMouseDown={startDraggingVolume}
                  onDragStart={e => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerVolume;
