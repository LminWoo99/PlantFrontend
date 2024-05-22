import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from "../api";
import './KeywordManager.css'; 

const KeywordList = () => {
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState("");
    const memberNo = localStorage.getItem("id");
    const token = localStorage.getItem("bbs_access_token");

    useEffect(() => {
        fetchKeywords();
        
    }, []);

    const fetchKeywords = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/keyword/${memberNo}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            setKeywords(response.data);
            
        } catch (error) {
            console.error("Error fetching keywords", error);
        }
    };

    const addKeyword = async () => {
        try {
            await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-service/keyword`, {
                keywordContent: newKeyword,
                memberNo: memberNo
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            setNewKeyword("");
            fetchKeywords();
        } catch (error) {
            console.error("Error adding keyword", error);
        }
    };

    const deleteKeyword = async (keywordId) => {
        try {
            await api.delete(`${process.env.REACT_APP_SERVER_URL}/plant-service/keyword/${keywordId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            fetchKeywords();
        } catch (error) {
            console.error("Error deleting keyword", error);
        }
    };

    return (
        <div className="keyword-manager">
            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="알림 받을 키워드를 입력해주세요." 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)} 
                />
                <button onClick={addKeyword}>등록</button>
            </div>
            <ul className="keyword-list">
                {keywords.map((keyword) => (
                    <li key={keyword.keywordId} className="keyword-item">
                        <span>{keyword.keywordContent}</span>
                        <button onClick={() => deleteKeyword(keyword.keywordId)} className="delete-button">
                        <i className="fas fa-trash" style={{ color: '#757e8e' }}></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KeywordList;
