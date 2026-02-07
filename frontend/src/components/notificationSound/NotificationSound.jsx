import { useEffect } from 'react';
import { useRef } from 'react';
import notificationSound from "../notificationSound/notification.mp3"

const NotificationSound = ({notification}) => {
  const audioRef = useRef(null);
  const prevCount = useRef(0);

  useEffect(() => {
    if (notification.length > prevCount.current) {
      audioRef.current.play().catch(() => {});
    }
    prevCount.current = notification.length;
  }, [notification]);


  return (
    <audio ref={audioRef} src={notificationSound} preload="auto" />
  );
};


export default NotificationSound
