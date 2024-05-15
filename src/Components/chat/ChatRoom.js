import React, { useEffect, useRef, useState, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../css/ChatRoom.css'; // CSS 파일 임포트
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import CouponModal from '../coupon/CouponModal';
import api from '../api';

function ChatRoom() {
    const { id, tradeBoardNo, nickname } = useParams();
    const { auth, setAuth } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const stompClient = useRef(null);
    const memberId = JSON.parse(window.localStorage.getItem('id'));
    const messagesEndRef = useRef(null); 
    const email = window.localStorage.getItem('email');
    const mineNickname = window.localStorage.getItem('username');
    const [receiverNo, setReceiverNo] = useState();
    const [isMine, setIsMine] = useState(false);
    const [price, setPrice] = useState(0);
    const [sellerNo, setSellerNo] = useState(0);
    const navigate = useNavigate();
    const [payMoney, setPayMoney] = useState(0);

    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null); 
    const [showCouponsModal, setShowCouponsModal] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(price);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        console.log(memberId);
        api.get(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney/${memberId}`, {
            headers: {
                Authorization: window.localStorage.getItem('bbs_access_token'),
            },
        })
        .then((response) => {
            setPayMoney(response.data.payMoney);
        })
        .catch((error) => {
            console.error('Error fetching pay money:', error);
        });
    }, [payMoney]);

    useEffect(() => {
        fetchCoupons();
        initInfo();
    }, [id]);

    useEffect(() => {
        const socket = new SockJS(`https://api.sikguhaza.site:8443/plant-chat-service/chat`, null);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({
            Authorization: window.localStorage.getItem('bbs_access_token'),
            chatRoomNo: id,
            keepalive: true
        }, () => {
            console.log('Connected to WebSocket');
            stompClient.current.subscribe(`/subscribe/public/${id}`, (message) => {
                console.log(message);
                fetchChattingHistory();
            },{
                Authorization: window.localStorage.getItem('bbs_access_token'),
            });
            if (window.localStorage.getItem('bbs_access_token')) {
                fetchChattingHistory();
            }
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log("Disconnected WebSocket");
                    disconnectChat();
                });
            }
        };
    }, [id]);

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function initInfo(){
        const resp = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/${tradeBoardNo}`, {
            headers: {
                Authorization: window.localStorage.getItem('bbs_access_token'),
            },
        });
        console.log(resp);
        setPrice(resp.data.price);
        setSellerNo(resp.data.memberId);
        if (resp.data.memberId === memberId){
            setIsMine(true);
        }
    }

    async function disconnectChat() {
        await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/${id}?username=${mineNickname}`,
        {
            headers: {
                Authorization: window.localStorage.getItem('bbs_access_token'),
            },
        })
            .then(response => {
                console.log("Chatroom disconnected successfully");
            })
            .catch(error => {
                console.error("Error disconnecting chatroom:", error);
            });
    }

    const onApplyCoupon = (coupon) => {
        if (price < 10000) {
            alert("쿠폰은 거래금액이 10,000원 이상부터 사용 가능합니다.");
            return;
        }

        const discountAmount = coupon.discountPrice;
        const calculatedPrice = Math.max(price - discountAmount, 0);
        setDiscountedPrice(calculatedPrice);
        setSelectedCoupon(coupon);
        setShowCouponsModal(false);
        setDiscount(discountAmount);
    };

    async function fetchChattingHistory() {
        try {
            const response = await api.get(
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
                    setReceiverNo(chat.receiverNo);
                    const DATE = new Date(chat.sendDate);
                    const dateString = `${(DATE.getMonth() + 1).toString().padStart(2, '0')}/${DATE.getDate().toString().padStart(2, '0')}`;
                    const hours = DATE.getHours();
                    const minutes = DATE.getMinutes();
                    const timeString = hours < 12 ? `오전 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : `오후 ${(hours - 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

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
            const resp = error.response.data;
            console.log(resp);
            if (resp.errorCodeName === "015"){
              alert(resp.message);
            }
        }
    }

    const fetchCoupons = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-coupon-service/coupon/${id}`, 
            {
                headers: {
                    Authorization: window.localStorage.getItem('bbs_access_token'),
                },
            });
            console.log(response.data);
            setCoupons(response.data);
        } catch (error) {
            console.error('쿠폰을 불러오는데 실패했습니다', error);
        }
    };

    const handleOpenPaymentModal = () => {
        setShowPaymentPopup(true); 
    };

    const handleClosePaymentModal = () => {
        setShowPaymentPopup(false); 
        setSelectedCoupon(null);
    };

    const handleCompleteTrade = () => {
        navigate(`/bbsbuyer/${tradeBoardNo}/${nickname}`);
    };

    const validatePayment = async (paymentRequestDto) => {
        try {
            const validationResp = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney/validation`, paymentRequestDto, {
                headers: { Authorization: window.localStorage.getItem('bbs_access_token') },
            });
            console.log(validationResp);
            return validationResp.status === 200; // 검증 성공 여부 반환
        } catch (error) {
            console.error('Error sending message:', error);
            const resp = error.response.data;
              if (resp.errorCodeName === "011"){
                  alert(resp.message);
                  return false; // 검증 실패
                }
        }
    };

    const sendPayment = async (paymentRequestDto) => {
        try {
            const resp = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-coupon-service/coupon/payment`, paymentRequestDto, {
                headers: { Authorization: window.localStorage.getItem('bbs_access_token') },
            });
            console.log(resp);

            if (resp.status === 200) {
                setShowPaymentPopup(false);
                alert("성공적으로 송금되었습니다.");
                setMessages(prevMessages => [...prevMessages, { content: '성공적으로 송금되었습니다.', mine: true }]);
            } else {
                alert('결제 처리 중 문제가 발생했습니다.');
            }
        } catch (error) {
            const resp = error.response.data;
            if (resp.errorCodeName === "021"){
                alert(resp.message);
              }
              if (resp.errorCodeName === "011"){
                  alert(resp.message);
                }
                if(resp.errorCodeName==="026"){
                  alert(resp.message);
                }
        }
    };

    const handleSendPayment = async () => {
        const paymentRequestDto = {
            payMoney: selectedCoupon ? discountedPrice : price,
            discountPrice: discount, 
            memberNo: memberId,
            couponNo: selectedCoupon?.couponNo,
            couponStatus: selectedCoupon ? '쿠폰사용' : '쿠폰미사용', 
            sellerNo: sellerNo
        };

        const isValid = await validatePayment(paymentRequestDto);
        if (isValid) {
            await sendPayment(paymentRequestDto);
        }
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
            stompClient.current.send(
                '/publish/message',
                { Authorization: window.localStorage.getItem('bbs_access_token') },
                JSON.stringify(messageData)
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
        
        try {
            await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/notification`, messageData, {
                headers: {
                    Authorization: window.localStorage.getItem('bbs_access_token'),
                },
            });
        } catch (error) {
            console.error('Error sending message:', error);
            const resp = error.response.data;
            console.log(resp);
            if (resp.errorCodeName === "015"){
              alert(resp.message);
            }
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
         <div ref={messagesEndRef} /> {/* 스크롤을 맨 아래로 이동시키기 위한 요소 */}

            <div className="chat-input">
                <input 
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="chat-complete-trade">
            {isMine === true && (
                <button onClick={handleCompleteTrade}>거래 완료</button>
            )}
                {isMine === false && (
              
              <button onClick={handleOpenPaymentModal} className="button-spacing">식구 페이로 송금</button>
              
            )}
            </div>
          

            {showPaymentPopup && (
                <div className="payment-modal">
                    <div className="payment-modal-content">
                    <span className="close" onClick={handleClosePaymentModal}>
                        &times;
                    </span>
                    {showCouponsModal && (
                        <CouponModal
                        onClose={() => setShowCouponsModal(false)}
                        onApplyCoupon={onApplyCoupon}
                        />
                    )}
                    <span className="clickable" onClick={() => setShowCouponsModal(true)} >
                        사용 가능한 쿠폰 보기
                    </span>
                    <p>송금할 금액</p>
                    <p>보유 페이 머니 : {payMoney}원</p>
                    <Link
                        to="/paymentpage"
                        className="account-link"
                        style={{ textDecoration: 'underline', textDecorationThickness: '3px' }}
                    >
                        <i className="fas fa-coins" style={{ color: '#04B486' }}></i>&nbsp; 식구 페이 머니 충전하러가기
                    </Link>
                    <input
                        type="text"
                        value={selectedCoupon ? discountedPrice : price}
                        readOnly
                        />
                    <button onClick={handleSendPayment}>송금하기</button>
                    </div>
                </div>
                )}
            </div>
    );
}

export default ChatRoom;
