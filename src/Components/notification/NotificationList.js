import React, { useEffect, useState } from 'react';
import api from "../api";
import '../../css/NotificationList.css';

const NotificationList = () => {
    const token = localStorage.getItem("bbs_access_token");
    const memberNo = window.localStorage.getItem("id");
    const [notifications, setNotifications] = useState([]);
    console.log(notifications);

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
                    const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/user/pk?id=${notification.senderNo}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSenderName(response.data.nickname); 
                } catch (error) {
                    console.error("Failed to fetch sender's name", error);
                }
            };

            fetchSenderName();
        }, [notification.senderNo, token]);

        const handleViewClick = async (event) => {
            try {
                await api.patch(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/notification/checked/${notification.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to update notification status", error);
            }
        };

        const handleDeleteClick = async () => {
            try {
                await api.delete(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/notification`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { idList: [notification.id] } 
                });
                setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
            } catch (error) {
                const resp = error.response.data;
                console.log(resp);
                if (resp.errorCodeName === "020") {
                    alert(resp.message);
                }
            }
        };

        const renderNotificationContent = () => {
            switch (notification.type) {
                case "댓글":
                    return `${senderName}님이 회원님의 게시글에 댓글을 남겼습니다.`;
                case "찜":
                    return `${senderName}님이 회원님의 중고 거래글을 찜하셨습니다.`;
                case "좋아요":
                    return `${senderName}님이 회원님의 게시글에 좋아요를 누르셨습니다.`;
                case "채팅":
                default:
                    return notification.content;
            }
        };

        const getNotificationClass = () => {
            switch (notification.type) {
                case "댓글":
                    return "sns-comment";
                case "찜":
                    return "tradeboard-goods";
                case "좋아요":
                    return "sns-heart";
                case "채팅":
                default:
                    return "chat";
            }
        };

        // Function to format the date
        const formatDate = (dateString) => {
            console.log(dateString);

            const year = dateString[0]
            const month = dateString[1]
            const day = dateString[2]
            const hours = dateString[3]
            const minutes = dateString[4]
            return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
        };

        return (
            <div className={`list_notification-item ${getNotificationClass()} ${notification.checked ? 'read' : ''}`}>
                {!notification.checked && <span className="list_notification-unread-indicator"></span>}
                <div className="list_notification-content">
                    <span className="list_notification-type">{notification.type}</span>
                </div>
                <div className="list_notification-content">
                    <span className="list_notification-sender">{notification.type === "채팅" ? senderName : ''}</span>
                    <span className="list_notification-message">{renderNotificationContent()}</span>
                </div>
                <div className="list_notification-meta">
                    <span className="list_notification-date">{formatDate(notification.publishedAt)}</span>
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
