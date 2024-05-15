import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import api from "../api";
import "../../css/BuyerSelection.css"; // CSS 파일 임포트

function BuyerSelection() {
  const [buyers, setBuyers] = useState([]); // 구매자 목록 상태
  const [selectedBuyer, setSelectedBuyer] = useState(''); // 선택된 구매자 닉네임 상태
  const { id, nickname } = useParams();
  let navigate = useNavigate();

  const { headers } = useContext(HttpHeadersContext);

  useEffect(() => {
    setBuyers([{ memberId: nickname, nickname }]);
  }, []);



  const setBuyer = async () => {
    try {
      const response = await api.post(
        `${process.env.REACT_APP_SERVER_URL}/plant-service/api/buyer/${id}`,
        { nickname: selectedBuyer },
        { headers }
      );
      if (response.status === 200) {
        navigate(`/bbsdetail/${id}`);
      }
    } catch (error) {
      console.error('Error setting buyer:', error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedBuyer(event.target.value);
  };

  return (
    <div className="buyer-selection-container">
      <div className="select-container">
        <select value={selectedBuyer} onChange={handleSelectChange} className="buyer-select">
          <option value="">구매자를 선택하세요</option>
          {buyers.map(buyer => (
            <option key={buyer.memberId} value={buyer.memberId}>{buyer.nickname}</option>
          ))}
        </select>
        <button onClick={setBuyer} className="confirm-button">구매자 선택 확인</button>
      </div>
    </div>
  );
}

export default BuyerSelection;
