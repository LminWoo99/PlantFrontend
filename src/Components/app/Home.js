import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/Home.css";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const textToType = ""; // The text you want to type
  let charIndex = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < textToType.length) {
        setInputValue((prev) => prev + textToType[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingInterval); // Stop typing once the full text has been typed out
      }
    }, 150); // Adjust speed as needed

    return () => clearInterval(typingInterval);
  }, []);

  const textArray = [

    "당신의 식물을\n공유하고 식물의 정보를 얻어가세요",
    "🍀식구하자를 통해서🍀",
  ];

  return (
    <div className="home-container">
      <div className="text-container">
        <div className="animated-text">{textArray[currentIndex]}</div>
      </div>
      <div className="banner-container">
        <Link to="/coupon">
          <p className="coupon-text">🎉 매일 13시, 식물 거래 할인 쿠폰 100명까지! 🎉</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
