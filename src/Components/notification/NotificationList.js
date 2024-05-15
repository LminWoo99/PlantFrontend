import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../../css/NotificationList.css';
import api from "../api"

const NotificationList = () => {
    const token = localStorage.getItem("bbs_access_token");
    const memberNo = window.localStorage.getItem("id");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/notification/all?memberNo=${memberNo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();
    }, [memberNo]);
    

    const NotificationItem = ({ notification }) => {
        const [senderName, setSenderName] = useState('');

        useEffect(() => {
            const fetchSenderName = async () => {
                try {
                    const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/user/pk?id=${notification.senderNo}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSenderName(response.data.nickname); 
                } catch (error) {
                    console.error("Failed to fetch sender's name", error);
                }
            };

            fetchSenderName(); // 이 함수를 호출해야 합니다.
        }, [notification.senderId, token]); // senderId가 변경될 때마다 호출됩니다.

        const handleViewClick = async (event) => {
            // event.preventDefault(); // 기본 이벤트를 방지합니다.
            try {
                
                const response = await api.patch(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/notification/checked/${notification.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to update notification status", error);
            }
        };
        const handleDeleteClick = async () => {
            try {
                const response = await api.delete(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/notification`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { idList: [notification.id] } 
                });
                // 삭제가 성공적으로 이루어지면, UI에서 해당 알림을 제거합니다.
                setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
            } catch (error) {
                const resp = error.response.data;
                console.log(resp);
                if (resp.errorCodeName === "020"){
                alert(resp.message);

                }
            }
        };

        return (
            <div className={`list_notification-item ${notification.checked ? 'read' : ''}`}>
                {!notification.checked && <span className="list_notification-unread-indicator"></span>}
                <div className="list_notification-content">
                    <span className="list_notification-type">{notification.type}</span>
                </div>
                <div className="list_notification-content">
                    <span className="list_notification-sender">{senderName}</span>
                    <span className="list_notification-message">{notification.content}</span>
                    </div>
                
                <div className="list_notification-meta">
                    <span className="list_notification-date">{moment(notification.publishedAt).format('YY년 MM월 DD일 HH시')}</span>
                    <a href={notification.url} onClick={handleViewClick} className="list_notification-link">View</a>
                    <button onClick={handleDeleteClick} className="list_notification-delete">알림 삭제</button>
                </div>
            </div>
        );
    };

    return (
        <div className="list_notification-list">
            {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

export default NotificationList;
