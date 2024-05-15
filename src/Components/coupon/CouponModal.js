import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CouponModal.css'
import api from "../api"


const CouponModal = ({ onClose , onApplyCoupon}) => {
    const [coupons, setCoupons] = React.useState([]);
    const [selectedCouponId, setSelectedCouponId] = useState(null);
    const memberNo=localStorage.getItem("id")

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-coupon-service/coupon/${memberNo}`, {
                    headers: {
                        Authorization: window.localStorage.getItem('bbs_access_token'),
                    },
                });
                setCoupons(response.data);
            } catch (error) {
                console.error('쿠폰 로딩 실패', error);
            }
        };

        fetchCoupons();
    }, []);

    const applySelectedCoupon = () => {
        // 선택된 쿠폰을 찾아 적용하는 로직
        const selectedCoupon = coupons.find(coupon => coupon.id === selectedCouponId);
        if (selectedCoupon) {
            
            onApplyCoupon(selectedCoupon);
            onClose();
        }
    }; const formatDate = (dateArray) => {
        const [year, month, day, hour, minute, second, nano] = dateArray;
        // JavaScript의 month는 0부터 시작하기 때문에 1을 빼줍니다.
        return new Date(year, month - 1, day, hour, minute, second, nano / 1000000);
      };

      return (
        <div className="coupon-modal">
          <div className="coupon-modal-content">
            <span className="modal-close" onClick={onClose}>
              &times;
            </span>
            <div className="coupon-modal-info">
            <h2>사용 가능한 쿠폰</h2>
            </div>
            {coupons.length > 0 ? (
              <form onSubmit={(e) => e.preventDefault()}>
                {coupons.map((coupon) => {
                  // Use formatDate to convert the regDate array to a Date object
                  const regDate = formatDate(coupon.regDate);
                  // Calculate the expiry date based on regDate
                  const expiryDate = new Date(regDate);
                  expiryDate.setDate(regDate.getDate() + 31);
                  
                  return (
                    <div key={coupon.couponNo} className="coupon-modal-card">
                      <label>
                        <input
                          type="radio"
                          name="selectedCoupon"
                          value={coupon.couponNo}
                          onChange={() => setSelectedCouponId(coupon.id)}
                          checked={selectedCouponId === coupon.id}
                        />
                        <div className="coupon-info">
                        <h3>중고 거래 {coupon.discountPrice}원 할인 쿠폰</h3>
                        <h5>10,000원 이상 거래 시 사용 가능</h5>
                        {/* Display formatted dates */}
                        <p>유효기간: {regDate.toLocaleDateString()} ~ {expiryDate.toLocaleDateString()}</p>
                        </div>
                      </label>
                      
                    </div>
                  );
                })}
                <button type="button" onClick={applySelectedCoupon}>
                  적용하기
                </button>
              </form>
            ) : (
              <p>사용 가능한 쿠폰이 없습니다.</p>
            )}
          </div>
        </div>
      );
    };


export default CouponModal;
