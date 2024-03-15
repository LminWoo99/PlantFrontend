import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";


function BuyerSelection() {
  const [selectedBuyer, setSelectedBuyer] = useState(''); // 구매자 닉네임 상태
  const { id, nickname } = useParams(); // URL 파라미터에서 id 추출
  let navigate = useNavigate();

  const { headers, setHeaders } = useContext(HttpHeadersContext);

  const setBuyer = async () => {
    const tradeBoardDto = {
      buyer: nickname,
    };
  
    try {
      // 첫 번째 요청: 구매자 설정
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/plant-service/api/buyer/${id}`,
        tradeBoardDto,
        { headers: headers }
      );
      console.log(response);
  
      // 첫 번째 요청이 성공하면, 상태 업데이트 요청
      if (response.status === 200) {
        const updateResponse = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/plant-service/api/updateStatus/${id}`,
          {}, // PUT 요청의 경우, 별도의 데이터가 필요하지 않은 경우 빈 객체 전달
          { headers: headers }
        );
  
        // 상태 업데이트 요청이 성공하면, 특정 페이지로 이동
        if (updateResponse.status === 200) {

          navigate(`/bbsdetail/${id}`);
        }
      }
    } catch (error) {
      console.error('요청 처리 중 오류 발생: ', error);
    }
  };
  return (
    <div>

        <div>
          <strong>선택된 구매자: {nickname}</strong>
          <button onClick={setBuyer}>구매자 선택 확인</button>
        </div>
      
    </div>
  );
}

export default BuyerSelection;
