import myImage from './plant.png';
import '../../css/header.css';
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="container text-center">
        <img src={myImage} alt="Logo" className="logo" />
        <h1>식구하자</h1>
        <div className="nav-buttons">
          <Link className="nav-button" to="/">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <Link className="nav-button" to="/myaccount">
            <i className="fas fa-laugh-beam"></i>
            <span>나의 식구</span>
          </Link>
          <Link className="nav-button" to="/bbslist">
            <i className="fas fa-leaf"></i>
            <span>식구 거래</span>
          </Link>
          <Link className="nav-button" to="/plantlist">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>식구 도감</span>
          </Link>
          <Link className="nav-button" to="/snspostlist">
            <i class="fas fa-image"></i>
            <span>식구 SNS</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
