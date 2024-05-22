import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import "../../css/nav.css";

function Nav() {
  const { auth } = useContext(AuthContext);
  const [showMyFamily, setShowMyFamily] = useState(false);
  const [showMyAccountModal, setShowMyAccountModal] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const toggleMyAccountModal = () => {
    setShowMyAccountModal(!showMyAccountModal);
  };

  const toggleMyFamily = () => {
    setShowMyFamily((prevShowMyFamily) => !prevShowMyFamily);
  };

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark sticky-top custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          식구하자
        </Link>
        <button
          className="custom-toggler navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
          {auth ? (
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/myaccount">
                  <i className="fas fa-laugh-beam"></i>&nbsp; 나의 식구
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  <i className="fas fa-sign-out-alt"></i> 로그아웃
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/notificationlist">
                  <i className="fas fa-bell"></i>&nbsp; 알림
                </Link>
              </li>
            </ul>
          ) : null}
          <ul className="navbar-nav ml-auto flex-row">
            {auth && (
              <li className="nav-item">
                <span className="nav-link"> {auth} 님 반갑습니다 <i className="fab fa-ello"></i> &nbsp; </span>
              </li>
            )}
            {!auth && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    로그인
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/join">
                    회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
