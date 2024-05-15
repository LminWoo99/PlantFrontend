import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../css/TopPostsSection.css';
import ModalComponent from './ModalComponent';
import SearchModalComponent from './SearchModalComponent';

const TopPostsWeek = () => {
  const location = useLocation();
  const topPosts = location.state?.topPosts || [];
  const [activeModalPostId, setActiveModalPostId] = useState(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const nickname = localStorage.getItem("nickname");

  const togglePosts = postId => {
    setActiveModalPostId(prevPostId => prevPostId === postId ? null : postId);
  };

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
          <h2 className="top-section-title">🔥 이주의 인기 게시글 🔥 </h2>
          {topPosts.length === 0 ? (
            <p className="no-posts-message">게시글이 없습니다.</p>
          ) : (
            <div className="top-posts-list">
              {topPosts.map((post, index) => (
                <div key={post.id} className="top-post-item">
                  <div className="top-post-rank">{index + 1}</div>
                  <div className="top-post-content">
                    <div className="top-post-title" onClick={() => togglePosts(post.id)}>
                      {post.snsPostTitle}
                    </div>
                    <div className="top-post-author">
                      작성자: <Link to={`/profile/${post.createdBy}`}>{post.createdBy}</Link>
                    </div>
                    <div className="top-post-meta">
                      <span className="top-post-likes">
                        <i className="far fa-heart"></i> {post.snsLikesCount}
                      </span>
                      <span className="top-post-comments">
                      조회수 : {post.snsViewsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {activeModalPostId  && (
                   <ModalComponent postId={activeModalPostId} show={true} onClose={() => setActiveModalPostId(null)} />
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPostsWeek;