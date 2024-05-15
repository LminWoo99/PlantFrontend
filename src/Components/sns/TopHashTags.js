import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../css/TopPostsSection.css';
import SearchModalComponent from './SearchModalComponent';

const TopHashTags = () => {
  const location = useLocation();
  const topHashTags = location.state?.topHashTags || [];
  
  const [activeModalPostId, setActiveModalPostId] = useState(null);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const nickname = localStorage.getItem("nickname");

  const Sidebar = () => {
    return (
      <div className="sns-sidebar">
        <Link to="/snspostlist" className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-home"></i>&nbsp; Sns Home</button>
        </Link>
        <Link to="/snspostform" className="sidebar-link">
          <button className="sidebar-button"><i className="fas fa-user-edit"></i>&nbsp; 글 작성하기</button>
        </Link>
        <button onClick={() => setSearchModalOpen(true)} className="sidebar-button"><i className="fas fa-search"></i>&nbsp; 검색</button>
        <Link to={`/profile/${nickname}`} className="sidebar-link">
          <button className="sidebar-button"><i className="fas fa-id-card-alt"></i>&nbsp; 프로필</button>
        </Link>
        <SearchModalComponent isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />
      </div>
    );
  };

  return (
    <div className="top-posts-section">
      <div className="top-posts-container">
        <Sidebar />
        <div className="top-posts-content">
          <h2 className="top-section-title">🔥 인기 해시태그 🔥 </h2>
          {topHashTags.length === 0 ? (
            <p className="no-posts-message">해시태그가 없습니다.</p>
          ) : (
            <div className="top-hashtags-list">
              {topHashTags.map((hashtag, index) => (
                <div key={hashtag.id} className="top-post-item">
                  <div className="top-post-rank">{index + 1}</div>
                  <div className="top-post-content">
                    <div className="top-post-title">
                     #{hashtag.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHashTags;