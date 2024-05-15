import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CouponList.css'; 
import api from "../api"

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
 const memberNo=localStorage.getItem("id");
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-coupon-service/coupon/${memberNo}`, 
        {headers: {
            Authorization: window.localStorage.getItem('bbs_access_token'),
        },
        
    });
    console.log(response.data);
        setCoupons(response.data);
      } catch (error) {
        console.error('쿠폰을 불러오는데 실패했습니다', error);
      }
    };

    fetchCoupons();
  }, [memberNo]);

  const formatDate = (dateArray) => {
    const [year, month, day, hour, minute, second, nano] = dateArray;
    // JavaScript의 month는 0부터 시작하기 때문에 1을 빼줍니다.
    return new Date(year, month - 1, day, hour, minute, second, nano / 1000000);
  };

  return (
    <div className="coupon-container">
      {coupons.length > 0 ? (
        coupons.map((coupon, index) => {
          // Date 객체 생성
          const regDate = formatDate(coupon.regDate);
          // 유효 기간 계산
          const expiryDate = new Date(regDate);
          expiryDate.setDate(regDate.getDate() + 31);

          return (
            <div className="coupon-list-container">
            <div className="coupon-card" key={index}>
              <div className="coupon-info">
                <h3>중고 거래 3,000원 할인 쿠폰</h3>
                <p>10,000원 이상 거래 시 사용 가능</p>
              </div>
              <div className="coupon-validity">
                <p>유효기간: {regDate.toLocaleDateString()} ~ {expiryDate.toLocaleDateString()}</p>
              </div>
            </div>
            </div>

          );
        })
      ) : (
        <p className="no-coupons">사용 가능한 쿠폰이 없습니다.</p>
      )}
    </div>
  );
};

export default CouponList;
