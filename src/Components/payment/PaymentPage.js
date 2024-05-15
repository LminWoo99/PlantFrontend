import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/PaymentPage.css';
import api from "../api"

const PayMentPage = () => {
  const memberNo = localStorage.getItem('id');
  const [payMoney, setPayMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chargeAmount, setChargeAmount] = useState('');
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundBank, setRefundBank] = useState('');
  const [refundAccount, setRefundAccount] = useState('');
  const email = localStorage.getItem('email');
  const [selectedBank, setSelectedBank] = useState('');
  const [isDirectInput, setIsDirectInput] = useState(false);
  const token = localStorage.getItem("bbs_access_token");
  useEffect(() => {
    console.log(token)
    api.get(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney/${memberNo}`, {headers: { Authorization: `Bearer ${token}` }})
      .then((response) => {
        setPayMoney(response.data.payMoney);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pay money:', error);
        setLoading(false);
      });
  }, [payMoney]);
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const handleCharge = async () => {
    const { IMP } = window;
    IMP.init('imp66118428');

    IMP.request_pay({
      pg: 'kakaopay.TC0ONETIME',
      pay_method: 'card',
      merchant_uid: new Date().getTime(),
      name: '식구 페이 충전',
      amount: chargeAmount , // 1000을 곱하여 원단위로 변환
      buyer_email: email,
    }, async (rsp) => {
      console.log(rsp);
      try {
        
        const { data } = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/verifyIamport/` + rsp.imp_uid, {
          headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` }
      });
        if (rsp.paid_amount === data.response.amount) {
          alert('결제 성공');
          // 결제 성공 후 서버에 결제 정보 전송
          console.log(data.response.amount);
          const paymentRequestDto= {
            payMoney: data.response.amount,
              memberNo: memberNo
          }
          await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney/charge`,paymentRequestDto,{
            headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` }
        } );
          window.location.reload();
        } else {
          alert('결제 실패');
        }
      } catch (error) {
        console.error('Error while verifying payment:', error);
        alert('결제 실패');
      }
    });
  };

  const handleRefund = async () => {
    
    const refundData = {
      payMoney: refundAmount,
      memberNo: memberNo,
      bank: refundBank || selectedBank,
      account: refundAccount,
    };
    console.log(refundData);
    try {
      await api.patch(
        `${process.env.REACT_APP_SERVER_URL}/plant-pay-service/payMoney/refund`,refundData, {
          headers: { Authorization: `Bearer ${token}` }
      }
      );
      alert('환불이 처리되었습니다.');
      setRefundDialogOpen(false);
      window.location.reload();
    } catch (error) {
      const resp = error.response.data;
      console.log(resp);
      if (resp.errorCodeName === "021"){
        alert(resp.message);
      }
    }
  };

  const renderRefundDialog = () => {
    return (
      <div className="refund-dialog">
        <div className="dialog-title">계좌 환불</div>
        <div className="dialog-content">
          <input
            className="input-field"
            type="number"
            placeholder="환불할 금액"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
          />
          <div className="bank-select">
            <label htmlFor="bank-select">은행 선택</label>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => {
                setSelectedBank(e.target.value);
                setIsDirectInput(e.target.value === '직접입력');
              }}
            >
              <option value="">은행 선택</option>
              <option value="신한은행">신한은행</option>
              <option value="국민은행">국민은행</option>
              <option value="농협은행">농협은행</option>
              <option value="우리은행">우리은행</option>
              <option value="카카오뱅크">카카오뱅크</option>
              <option value="직접입력">은행 직접 입력하기</option>
            </select>
          </div>
          {isDirectInput && (
            <input
              className="input-field"
              type="text"
              placeholder="직접 입력한 은행"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            />
          )}
          <input
            className="input-field"
            type="text"
            placeholder="환불할 계좌번호"
            value={refundAccount}
            onChange={(e) => setRefundAccount(e.target.value)}
          />
        </div>
        <div className="dialog-actions">
          <button onClick={() => setRefundDialogOpen(false)}>취소</button>
          <button className="styled-button" onClick={handleRefund}>
            환불
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="root-container">
          <div className="payment-container">
      <h4>식구 페이 머니</h4>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div>
          <div className="pay-money-display">보유페이머니: {payMoney} 원</div>
          <input
            className="input-field"
            type="number"
            placeholder="충전할 금액"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
          />
          <button className="styled-button" onClick={handleCharge}>
            페이 머니 충전
          </button>
          <button className="styled-button" onClick={() => setRefundDialogOpen(true)}>
            계좌 환불
          </button>
        </div>
      )}
      </div>
      {refundDialogOpen && renderRefundDialog()}
      
    </div>
  );
};

export default PayMentPage;