import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/Home.css";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const textArray = [
    "당신의 식물을\n공유하고 식물의 정보를 얻어가세요",
    "🍀식구하자를 통해서🍀",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    
    <div className="home-container">
      <div className="text-container">
        <div className="animated-text">{textArray[currentIndex]}</div>
      </div>
      <div className="banner-container">
        <Link to="/coupon" className="coupon-link">
          <p className="coupon-text">🎉 매일 13시, 식물 거래 할인 쿠폰 100명까지! 🎉</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
