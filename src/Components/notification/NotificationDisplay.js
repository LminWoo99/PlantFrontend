import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import '../../css/NotificationDisplay.css'; // 스타일 시트 임포트

const NotificationsDisplay = () => {
  const { notifications } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // 새 알림이 있을 때만 처리
    if (notifications.length > 0) {
      const lastNotification = notifications[notifications.length - 1];
      setVisibleNotifications([lastNotification]);

      // 2초 후 알림 사라지게 처리
      const timer = setTimeout(() => {
        setVisibleNotifications([]);
      }, 6000);

      // Cleanup function
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const closeNotification = () => {
    setVisibleNotifications([]);
  };

  return (
    <div className="notification-list">
      {visibleNotifications.map((notification, index) => (
        <div key={index} className="notification-item animated fadeInRight">
          <div className="notification-image">
            <img src={'/images/profile-placeholder.png'} alt="notification" />
          </div>
          <div className="notification-text">
            <p className="notification-sender">{notification.senderName}</p>
            <p className="notification-content">{notification.content}</p>
            <a href={notification.url} className="notification-link">자세히 보기</a>
          </div>
          <button className="notification-close" onClick={closeNotification}>X</button>
        </div>
      ))}
    </div>
  );
};


export default NotificationsDisplay;