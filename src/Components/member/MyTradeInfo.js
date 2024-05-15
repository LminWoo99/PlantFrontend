import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/MyTradeInfo.css"
import api from "../api"

function MyTradeInfo() {
  const [tradeList, setTradeList] = useState([]);
  const [activeTab, setActiveTab] = useState("판매중");
  const token = localStorage.getItem("bbs_access_token");
  const memberId = localStorage.getItem("id");

  useEffect(() => {
    if (memberId) {
      fetchTradeList(memberId);
    } else {
      alert("판매중인 내역이 없습니다.");
    }
  }, [memberId]);

  const fetchTradeList = async (id) => {
    try {
      const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/tradeInfo/${id}`,{headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setTradeList(response.data);
      console.log(response);
    } catch (error) {
    
      alert(error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filteredTradeList = tradeList.filter(trade => {
    if (activeTab === "판매중") {
      return trade.status === "판매중";
    } else if (activeTab === "거래완료") {
      return trade.status === "거래완료";
    }
    return false;
  });
  const formatDate = (dateString) => {
    console.log(dateString);

    const year = dateString[0]
    const month = dateString[1]
    const day = dateString[2]
    const hours = dateString[3]
    const minutes = dateString[4]
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};
  return (
    <div className="my-trade-info">
      <h2>나의 판매 내역</h2>
      <div className="tabs">
        <button className={`tab ${activeTab === "판매중" ? "active" : ""}`} onClick={() => handleTabChange("판매중")}>판매중</button>
        <button className={`tab ${activeTab === "거래완료" ? "active" : ""}`} onClick={() => handleTabChange("거래완료")}>거래완료</button>
      </div>
      <div className="trade-list">
        {filteredTradeList.map((trade) => (
          <div key={trade.id} className="trade-card">
            <div className="title">
              <Link to={`/bbsdetail/${trade.id}`} className="bbs-title">
                {trade.title}
              </Link>
            </div>
            <div className="status">
              상태: {trade.status}
            </div>
            <div className="created-at">
              작성일: {formatDate(trade.createdAt)}
            </div>
          </div>
        ))}
        {filteredTradeList.length === 0 && <p>해당 상태의 게시글이 없습니다.</p>}
      </div>
    </div>
  );
}

export default MyTradeInfo;
