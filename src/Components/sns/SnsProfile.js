import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import '../../css/SnsProfile.css';
import { Link } from 'react-router-dom';
import ModalComponent from './ModalComponent';
import SearchModalComponent from './SearchModalComponent';
import api from "../api"

const SnsProfile = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("bbs_access_token");
  const [activeModalPostId, setActiveModalPostId] = useState(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const { createdBy } = useParams(); // URL 파라미터에서 id 추출

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPosts/nickname/${createdBy}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts.', error);
      }
    };
    fetchPosts();
  }, [createdBy, token]);

  const toggleComments = postId => {
    setActiveModalPostId(prevPostId => prevPostId === postId ? null : postId);
  };
  

  return (
    <div className="sns-profile">
      <aside className="sidebar">
      <Link to="/snspostlist" className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-home"></i>&nbsp; Sns Home</button>
        </Link>
        <button onClick={() => setSearchModalOpen(true) } className="sidebar-button" ><i class="fas fa-search"></i>&nbsp; 검색</button>
        <Link to="/snspostform" className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-user-edit"></i>&nbsp; 글 작성하기</button>
        </Link>
        <Link to="/profile" className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-id-card-alt"></i>&nbsp; 프로필</button>
        </Link>
        <SearchModalComponent
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      </aside>
      <main className="main-content">
        <section className="user-info">
          <div className="profile-header">
            <img
              src='/images/profile-placeholder.png'
              alt={`${createdBy}의 프로필`}
              className="profile-img"
            />
            <div className="profile-stats">
              <h2 className="username">{createdBy}</h2>
              </div>
          </div>
          <div className="profile-stats">
              게시물 : {posts.length}
              </div>
        </section>
        
        <section className="user-posts">
          {posts.map(post => (
            <div key={post.id} className="post-thumbnail-container" onClick={() => toggleComments(post.id)}>
              <img src={post.imageUrls[0]} alt={post.snsPostTitle} className="post-thumbnail" />
            </div>
          ))}
        </section>
        {activeModalPostId && (
          <ModalComponent postId={activeModalPostId} show={true} onClose={() => setActiveModalPostId(null)} />
        )}
      </main>
    </div>
  );
};

export default SnsProfile;
