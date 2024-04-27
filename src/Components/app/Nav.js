import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import MyTradeInfo from "../member/MyTradeInfo"; 
import "../../css/nav.css";


function Nav() {
  const { auth, setAuth } = useContext(AuthContext);
  const [showMyFamily, setShowMyFamily] = useState(false);
  const [showMyAccountModal, setShowMyAccountModal] = useState(false);

  const toggleMyAccountModal = () => {
    setShowMyAccountModal(!showMyAccountModal);
  };

 
  const toggleMyFamily = () => {
    setShowMyFamily(prevShowMyFamily => !prevShowMyFamily); // 이 부분 수정
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark sticky-top" style={{ backgroundColor: "#04B486", color: "" }}>
      <div className="container">

        <div className="navbar-collapse collapse justify-content-between" id="navbar-content">

          
          {auth ? (
      
      // 로그아웃
      <ul className="navbar-nav mr-auto ">
            <li className="nav-item">
                <Link className="nav-link" to="/myaccount" style={{ color: '#2F4F4F' }}><i class="fas fa-laugh-beam" style={{ color: "#2F4F4F" }}></i>&nbsp; 나의 식구</Link></li>
                <li className="nav-item">
              <Link className="nav-link" style={{ color: "#2F4F4F" }} to="/logout"><i className="fas fa-sign-out-alt" style={{ color: "#2F4F4F" }}></i> 로그아웃</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/notificationlist">
                {/* 알림 */}
                {/* <FontAwesomeIcon icon="fa-regular fa-bell" /> */}
                <i class="fas fa-bell" style={{ color: "#2F4F4F" }}></i>
                &nbsp;  알림
                </Link>
            </li>
            </ul>      

          ) : (<></>)}
          

          <ul className="navbar-nav ml-auto flex-row">
            {/* 회원 정보 */}
            {auth &&
              <li className="nav-item" style={{ color: "#2F4F4F" }}>
                <span className="nav-link"> {auth} 님 반갑습니다 <i className="fab fa-ello"></i> &nbsp; </span>
              </li>
            }

            {/* 나의 식구 토글 */}
    {/* 나의 식구 토글 */}

           
              {/* // 로그인 및 회원가입 */}
            {!auth && <>
                <li className="nav-item">
                  <Link className="nav-link" style={{ color: "#2F4F4F" }} to="/login">로그인</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" style={{ color: "#2F4F4F" }} to="/join">회원가입</Link>
                </li>
              </>}
          
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
