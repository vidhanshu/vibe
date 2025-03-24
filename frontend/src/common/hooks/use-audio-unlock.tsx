import { useEffect, useRef, useState } from "react";

const useAudioUnlock = (src?: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [unlocked, setUnlocked] = useState(false);

  const content = (
    <audio ref={audioRef} src={src || "/audios/msg-receive-ig.mp3"} />
  );

  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;
        setUnlocked(true);
      }
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  return { audioRef, unlocked, content };
};

export default useAudioUnlock;
