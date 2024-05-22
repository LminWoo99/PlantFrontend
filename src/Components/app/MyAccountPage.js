// MyAccountPage.js 수정본
import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/MyAccountPage.css'; // CSS 파일 임포트


const MyAccountPage = () => {
  const nickname=localStorage.getItem("nickname");
  return (
    <div className="account-container">
      <h2 className="account-header"><i class="fas fa-user" style={{ color: "#04B486" }}></i>&nbsp; {nickname}님 </h2>
      <ul className="account-list">
        <li className="account-item">
          <Link to="/sales" className="account-link"><i class="fas fa-receipt" style={{ color: "#04B486" }}></i>&nbsp;  판매 내역</Link>
        </li>
        <li className="account-item">
          <Link to="/wishlist" className="account-link"><i class="fas fa-heart" style={{ color: "#ff0000" }}></i>&nbsp;  찜 내역</Link>
        </li>
        <li className="account-item">
          <Link to="/buyInfo" className="account-link"><i class="fas fa-credit-card" style={{ color: "#1EA4FF" }}></i>&nbsp;  구매 내역</Link>
        </li>
        <li className="account-item">
          <Link to="/paymentpage" className="account-link"><i class="fas fa-coins" style={{ color: "#9EF048" }}></i>&nbsp;  식구 페이 머니</Link>
        </li>
        <li className="account-item">
          <Link to="/couponList" className="account-link"><i class="fas fa-ticket-alt" style={{ color: "#FFD43B" }}></i>&nbsp;  나의 쿠폰 내역</Link>
        </li>   
        <li className="account-item">
          <Link to="/keywordList" className="account-link"><i class="fas fa-list" style={{ color: "#ff0000" }}></i>&nbsp;  키워드 설정 정보</Link>
        </li>
      </ul>

    </div>
  );
};

export default MyAccountPage;