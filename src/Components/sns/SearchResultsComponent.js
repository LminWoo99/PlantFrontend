import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../css/SnsProfile.css'; 
import ModalComponent from './ModalComponent';
import SearchModalComponent from './SearchModalComponent';
import api from "../api"

const SearchResultsComponent = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("bbs_access_token");
  const [activeModalPostId, setActiveModalPostId] = useState(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const nickname=localStorage.getItem("nickname");
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('term');
  const searchCondition=queryParams.get('searchCondition');

  useEffect(() => {
    console.log(searchCondition);

    fetchSearchResults();
  }, [location, token]);


  const fetchSearchResults = async () => {
    try {
      const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPosts/search?${searchCondition}=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleComments = postId => {
    setActiveModalPostId(prevPostId => prevPostId === postId ? null : postId);
  };
  if (searchCondition === 'nickname') {
    return (
      <div className="sns-profile">
        <aside className="sidebar">
          <Link to="/snspostlist" className="sidebar-link">
            <button className="sidebar-button"><i className="fas fa-home"></i>&nbsp; Sns Home</button>
          </Link>
          <Link to="/snspostform" className="sidebar-link">
            <button className="sidebar-button"><i className="fas fa-user-edit"></i>&nbsp; 글 작성하기</button>
          </Link>
          <Link to={`/profile/${searchTerm}`} className="sidebar-link">
            <button className="sidebar-button"><i className="fas fa-id-card-alt"></i>&nbsp; 프로필</button>
          </Link>
        </aside>
        <main className="main-content">
          <section className="user-info">
            <div className="profile-header">
              <img src='/images/profile-placeholder.png' alt={`${searchTerm}의 프로필`} className="profile-img"/>
              <div className="profile-stats">
                <h2 className="username">{searchTerm}</h2>
                <div className="profile-stats">
                  게시물 : {searchResults.length}
                </div>
              </div>
            </div>
          </section>
          <section className="user-posts">
            {searchResults.length > 0 ? (
              searchResults.map(post => (
                <div key={post.id} className="post-thumbnail-container" onClick={() => toggleComments(post.id)}>
                  <img src={post.imageUrls[0]} alt={post.snsPostTitle} className="post-thumbnail" />
                </div>
              ))
            ) : (
              <div className="no-results">{`'${searchTerm}'닉네임으로 올린 게시글이 없습니다.`}</div>
            )}
          </section>
          {activeModalPostId && (
            <ModalComponent postId={activeModalPostId} show={true} onClose={() => setActiveModalPostId(null)} />
          )}
        </main>
      </div>
    );
  }
  else{
  return (
    <div className="sns-profile">
      <aside className="sidebar">
        <Link to="/snspostlist" className="sidebar-link">
          <button className="sidebar-button"><i className="fas fa-home"></i>&nbsp; Sns Home</button>
        </Link>
        <button onClick={() => setSearchModalOpen(true)} className="sidebar-button">
          <i className="fas fa-search"></i>&nbsp; 검색
        </button>
        <Link to="/snspostform" className="sidebar-link">
          <button className="sidebar-button"><i className="fas fa-user-edit"></i>&nbsp; 글 작성하기</button>
        </Link>
        <Link to={`/profile/${nickname}`} className="sidebar-link">
          <button className="sidebar-button"><i className="fas fa-id-card-alt"></i>&nbsp; 프로필</button>
        </Link>
        <SearchModalComponent
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      </aside>
      <main className="main-content">
        <section className="user-info">
          <div className="profile-stats">
            게시물 : {searchResults.length}
          </div>
        </section>
        
        <section className="user-posts">
          {searchResults.length > 0 ? (
            searchResults.map(post => (
              <div key={post.id} className="post-thumbnail-container" onClick={() => toggleComments(post.id)}>
                <img src={post.imageUrls[0]} alt={post.snsPostTitle} className="post-thumbnail" />
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다.</div>
          )}
        </section>
        {activeModalPostId && (
          <ModalComponent postId={activeModalPostId} show={true} onClose={() => setActiveModalPostId(null)} />
        )}
      </main>
    </div>
  );
};
}

export default SearchResultsComponent;
