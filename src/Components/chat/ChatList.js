import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../css/ChatList.css';

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const memberId = window.localStorage.getItem("id");
  const { tradeBoardNo } = useParams();
  const token = localStorage.getItem("bbs_access_token");
  
  const navigate = useNavigate(); // useNavigate 훅 추가

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom`, {
          params: {
            tradeBoardNo: tradeBoardNo,
            memberNo: memberId
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response);
        const data = await response.data;

        const chatRoomsWithRelativeTime = data.map(chatRoom => ({
          ...chatRoom,
          latestMessage: {
            ...chatRoom.latestMessage,
            relativeTime: timeSince(chatRoom.latestMessage.sendAt)
          }
        }));
        setChatRooms(chatRoomsWithRelativeTime);
        console.log(data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        const resp = error.response.data;
        console.log(resp);
        if (resp.errorCodeName === "015"){
          alert(resp.message);
        }
      }
    };

    fetchChatRooms();
  }, [tradeBoardNo, memberId, token]); // 의존성 배열에 변수 추가

  // Time since function
  const timeSince = (timestamp) => {
    const now = new Date();
    console.log(timestamp);
    const secondsPast = (now.getTime() - timestamp) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + ' 초전';
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + ' 분전';
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + ' 시간 전';
    }
    if (secondsPast > 86400) {
        let day = parseInt(secondsPast/86400) +'일전';
        // let month = timestamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        // let year = timestamp.getFullYear() == now.getFullYear() ? "" :  " " + timestamp.getFullYear();
        return day;
    }

  };

  // 채팅 영역 클릭 핸들러 함수
  const handleChatClick = (chatNo,nickname) => {
    navigate(`/chatroom/${chatNo}/${tradeBoardNo}/${nickname}`);
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list">
        {chatRooms.map(chatRoom => (
          <div key={chatRoom.chatNo} className="chat-room" onClick={() => handleChatClick(chatRoom.chatNo, chatRoom.participant.nickname)}>
            <div className="chat-avatar">
              <img src='../images/profile-placeholder.png' alt="Avatar" />
            </div>
            <div className="chat-info">
              <div className="nickname">{chatRoom.participant.nickname}</div>
              <div className="last-message">{chatRoom.latestMessage.context}</div>
            </div>
            <div className="chat-meta">
              <div className="time-since">{chatRoom.latestMessage.relativeTime}</div>
              <span className={chatRoom.unReadCount > 0 ? "unread-count" : "unread-count-none"}>
                {chatRoom.unReadCount > 0 ? chatRoom.unReadCount : ''}
              </span>
          
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
