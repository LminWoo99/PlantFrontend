import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CouponComponent.css'; // 가정한 CSS 파일 경로
import api from "../api"

function CouponComponent() {
  const [isEventTime, setIsEventTime] = useState(false);
  const [couponStatus, setCouponStatus] = useState('ready'); // 'ready', 'claimed', 'ended'

  useEffect(() => {
    const checkEventTime = () => {
      const currentHour = new Date().getUTCHours() + 9; 
      
      setIsEventTime(currentHour >= 13);
    };

    checkEventTime();

    const interval = setInterval(checkEventTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const applyCoupon = async () => {
    if (isEventTime) {
      try {
        const couponData = {
          memberNo: localStorage.getItem("id"),
          discountPrice: 3000,
        };

        const response = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-coupon-service/coupon`, couponData, {
          headers: {
            Authorization: window.localStorage.getItem('bbs_access_token'),
          },
        });

        // 성공적으로 쿠폰을 받았다고 상태 업데이트
        setCouponStatus('claimed');
        console.log(response);
        alert('쿠폰이 성공적으로 발급되었습니다.');
      } catch (error) {
        if (error.response.status === 429) {
          // 100개를 초과했다는 상태 업데이트
          setCouponStatus('ended');
          alert('오늘의 쿠폰은 모두 소진되었습니다.');
        }
        if (error.response.status === 409) {
          // 기타 에러 처리
          setCouponStatus('claimed');
          alert('한 계정당 쿠폰은 하나만 발급 가능합니다.');
        }
      }
    } else {
      alert('아직 이벤트 시작 시간이 아닙니다.');
    }
  };

  return (
    <div className="coupon-container">
      {isEventTime ? (
        <>
          <h1 className="event-title">🎉 3000원 쿠폰 발급 이벤트 🎉</h1>
          <h2 className="event-title"> 중고 거래시 사용 가능! </h2>
          <h5 className="event-subtitle">선착순 100명 매일 오후 1시</h5>
          {couponStatus === 'ready' && (
            <div className="coupon">
              <button className="coupon-button" onClick={applyCoupon}>
                <span className="coupon-text">쿠폰 받기</span>
              </button>
            </div>
          )}
          {couponStatus === 'claimed' && <div className="coupon-claimed">쿠폰을 받았습니다!</div>}
          {couponStatus === 'ended' && <div className="coupon-ended">오늘의 이벤트는 마감되었습니다.</div>}
        </>
      ) : (
        <h1 className="event-waiting">아직 이벤트 시작 시간이 아닙니다.</h1>
      )}
    </div>
  );
}

export default CouponComponent;
