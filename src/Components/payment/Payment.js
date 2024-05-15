import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api"

const Payment = () => {
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState('');
  const { IMP } = window;
  const token = localStorage.getItem("bbs_access_token");

  const memberNo=localStorage.getItem("id");
  useEffect(() => {
    
    
    console.log(token);
    const nickname = localStorage.getItem("nickname");
    setEmail(localStorage.getItem("email"));
    // 이하 생략
  }, []);

  const requestPay = async () => {
    
    IMP.init('imp66118428');

    IMP.request_pay({
      pg: 'kakaopay.TC0ONETIME',
      pay_method: 'card',
      merchant_uid: new Date().getTime(),
      name: '식구 페이 충전',
      amount: amount , // 1000을 곱하여 원단위로 변환
      buyer_email: email,
    }, async (rsp) => {
      console.log(rsp);
      try {
        const { data } = api.post(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/verifyIamport/` + rsp.imp_uid, {
          headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` }
      });
        if (rsp.paid_amount === data.response.amount) {
          alert('결제 성공');
          // 결제 성공 후 서버에 결제 정보 전송
          api.post(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` }
        },{
            paymentRequestDto: {
              payMoney: amount,
              memberNo: memberNo
            }
          });
        } else {
          alert('결제 실패');
        }
      } catch (error) {
        console.error('Error while verifying payment:', error);
        alert('결제 실패');
      }
    });
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="금액을 입력하세요"
      />
      <button onClick={requestPay}>충전하기</button>
    </div>
  );
};

export default Payment;
