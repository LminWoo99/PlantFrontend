import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/SearchModal.css';
import { useNavigate } from 'react-router-dom';

const SearchModalComponent = ({ isOpen, onClose }) => {
  const token = localStorage.getItem("bbs_access_token");
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCondition, setSearchCondition] = useState('nickname');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchConditionChange = (e) => {
    setSearchCondition(e.target.value);
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      alert('검색어를 입력해주세요.');
      return;
    }

    let searchQuery = trimmedSearchTerm;
    if (searchCondition === 'hashTagName') {
      searchQuery = trimmedSearchTerm.replace(/#/g, ''); // '#' 제거
    }

    navigate(`/search-results?searchCondition=${encodeURIComponent(searchCondition)}&term=${encodeURIComponent(searchQuery)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal">
        <div className="search-modal-content">
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch}>검색</button>
          <div className="search-condition-selector">
            <label>
              <input
                type="radio"
                value="nickname"
                checked={searchCondition === 'nickname'}
                onChange={handleSearchConditionChange}
              />
              닉네임
            </label>
            <label>
              <input
                type="radio"
                value="snsPostTitle"
                checked={searchCondition === 'snsPostTitle'}
                onChange={handleSearchConditionChange}
              />
              제목
            </label>
            <label>
              <input
                type="radio"
                value="snsPostContent"
                checked={searchCondition === 'snsPostContent'}
                onChange={handleSearchConditionChange}
              />
              내용
            </label>
            <label>
              <input
                type="radio"
                value="hashTagName"
                checked={searchCondition === 'hashTagName'}
                onChange={handleSearchConditionChange}
              />
              해시태그
            </label>
          </div>
          <button className="search-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModalComponent;