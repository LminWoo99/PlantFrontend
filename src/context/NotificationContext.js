import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

const NotificationContext = createContext();
// const EventSource = EventSourcePolyfill || NativeEventSource;
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const memberNo = localStorage.getItem('id');
  const jwtToken = localStorage.getItem('bbs_access_token'); // JWT 토큰을 로컬 스토리지 또는 적절한 곳에서 불러옵니다.
  useEffect(() => {
    const eventSource = new EventSourcePolyfill(`http://localhost:8000/plant-chat-service/notification/connect`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      
      },
      withCredentials: true,
      heartbeatTimeout: 1740000
    });

    console.log(eventSource.url)
    eventSource.onopen = () => {
        console.log('connected');
      };
      console.log(eventSource.url);
    eventSource.addEventListener('sse', (e) => {
        console.log(e.data);
        if (!e.data.includes('EventStream Created')) {
          console.log("ddd");
          const newNotification = JSON.parse(e.data);
          setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        }
      });
      eventSource.onerror = (e) => {
        console.log("errorrr");
            console.log(e);
            eventSource.close();
    };
         return () => {
          eventSource.close();
        };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
