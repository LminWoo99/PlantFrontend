import React, { useEffect, useRef, useState , useContext} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../css/ChatRoom.css'; // CSS 파일 임포트
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";

function ChatRoom() {
    const { id, tradeBoardNo, nickname } = useParams();
    const { auth, setAuth } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const stompClient = useRef(null);
    const memberId = JSON.parse(window.localStorage.getItem('id'));
    const email = window.localStorage.getItem('email');
    const [receiverNo, setReceiverNo] =useState();
    const navigate = useNavigate();
    useEffect(() => {
        // STOMP 클라이언트 초기화
        const socket = new SockJS('http://localhost:8000/plant-chat-service/chat', null,{
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        });
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({
            Authorization: window.localStorage.getItem('bbs_access_token'),
            chatRoomNo: id,
            keepalive: true
        }, () => {
            console.log('Connected to WebSocket');

            // 연결 성공 시 메시지 구독
            stompClient.current.subscribe(`/subscribe/public/${id}`, (message) => {
                handleMessage(JSON.parse(message.body));
            },{
                Authorization: window.localStorage.getItem('bbs_access_token'),
            });
        });
        if (window.localStorage.getItem('bbs_access_token')) {
            fetchChattingHistory();
        }

        window.addEventListener('beforeunload', () => {
			disconnectChat();
		});
        
    }, []);
    function disconnectChat() {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/${id}?nickname=${nickname}`,
        {
            headers: {
                Authorization: window.localStorage.getItem('bbs_access_token'),
            },
        }
        
        )
            .then(response => {
                console.log("Chatroom disconnected successfully");
            })
            .catch(error => {
                console.error("Error disconnecting chatroom:", error);
            });
            console.log(window.localStorage.getItem('bbs_access_token'));
    }
       // 채팅 내역 조회
       async function fetchChattingHistory() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/${id}?memberNo=${memberId}`, 
                {
                    headers: {
                        Authorization: window.localStorage.getItem('bbs_access_token'),
                    },
                }
            );
            console.log(response);
            if (response) {
                const chattingList = response.data.chatList.map((chat, index, array) => {
                    setReceiverNo(chat.receiverNo)
                    const DATE = new Date(chat.sendDate);
                    const dateString = `${(DATE.getMonth() + 1).toString().padStart(2, '0')}/${DATE.getDate().toString().padStart(2, '0')}`;
                    const hours = DATE.getHours();
                    const minutes = DATE.getMinutes();
                    const timeString = hours < 12 ? `오전 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : `오후 ${(hours - 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    
                    // 현재 메시지와 이전 메시지의 날짜가 다를 경우, 새로운 날짜를 추가
                    if (index === 0 || new Date(array[index - 1].sendDate).toDateString() !== DATE.toDateString()) {
                        return {
                            ...chat,
                            timestamp: timeString,
                            dateString: dateString
                        };
                    } else {
                        return {
                            ...chat,
                            timestamp: timeString
                        };
                    }
                });
                setMessages(chattingList);
            } else {
                console.error('Failed to fetch chatting history');
            }
        } catch (error) {
            console.error('Error fetching chatting history:', error);
        }
    }

    const handleMessage = (message) => {
        const DATE = new Date(message.sendDate);
        const hours = DATE.getHours();
        const minutes = DATE.getMinutes();
        const timeString = hours < 12 ? `오전 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : `오후 ${(hours - 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // 메시지 객체에 추가
        const formattedMessage = {
            ...message,
            timestamp: timeString
        };

        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    };
    const handleCompleteTrade = () => {
        // navigate 함수를 사용하여 지정된 경로로 이동
        navigate(`/bbsbuyer/${tradeBoardNo}/${nickname}`);
    };
    const sendMessage = async () => {
        const messageData = {
            chatNo: id,
            contentType: "application/json",
            content: inputMessage,
            senderNo: memberId,
            senderName: auth,
            sendTime: Date.now(),
            tradeBoardNo: tradeBoardNo,
            readCount: Number(1),
            senderEmail: email
        };

        try {
            // 메시지 전송
            stompClient.current.send(
                '/publish/message',
                { Authorization: window.localStorage.getItem('bbs_access_token') },
                JSON.stringify(messageData)
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
        
        try {
            // 채팅 저장 및 알림 호출
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/notification`, messageData, {
                headers: {
                    Authorization: window.localStorage.getItem('bbs_access_token'),
                },
                
            }
            
            );
            fetchChattingHistory();

        } catch (error) {
            console.error('Error sending message:', error);
        }
        
        setInputMessage('');
    };

    return (
        <div className="chat-room-container">
            {messages.map((message, index) => (
            <div className="chat-message-container" key={index}>
                {message.dateString && <div className="message-date">{message.dateString}</div>}
                <div className={`message-bubble ${message.mine ? 'sent' : 'received'}`}>
                <div>{message.content}</div>
                <div className="message-time">{message.timestamp}
                    {message.mine && message.readCount === 1 && <span className="unread-indicator">1</span>}
                </div>
                </div>
            </div>
            ))}

            <div className="chat-input">
                <input 
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="chat-complete-trade">
                <button onClick={handleCompleteTrade}>거래 완료</button>
            </div>
        </div>
    );
}

export default ChatRoom;
