import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/SnsPostList.css';
import ImageGalleryComponent from "../bbs/ImageGalleryComponent";
import ModalComponent from './ModalComponent';
import SearchModalComponent from './SearchModalComponent';
import api from "../api"




const SnsPostList = () => {
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("bbs_access_token");
  const nickname = localStorage.getItem("nickname");
  const [commentsContent, setCommentsContent] = useState({});
  const [activeModalPostId, setActiveModalPostId] = useState(null);
  const memberNo=localStorage.getItem("id");
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState({}); 

  const [topPostsWeek, setTopPostsWeek] = useState([]);
  const [topPostsMonth, setTopPostsMonth] = useState([]);
  const [showTopPostsWeek, setShowTopPostsWeek] = useState(false);
  const [showTopPostsMonth, setShowTopPostsMonth] = useState(false);


  
  
  useEffect(()=>{
    console.log(activeModalPostId);
}, [activeModalPostId])
  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPosts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
        console.log(response);
      } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchPosts();
  }, [token]);
  const toggleComments = postId => {
    setActiveModalPostId(prevPostId => prevPostId === postId ? null : postId);
  };

  const handleCommentChange = (postId, content) => {
    setCommentsContent(prevComments => ({
      ...prevComments,
      [postId]: content
    }));
  };
  const toggleContentExpansion = postId => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  const Sidebar = () => {
    return (
      <div className="sns-sidebar">
        
        <Link to="/snspostform" className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-user-edit"></i>&nbsp; 글 작성하기</button>
        </Link>
        {/* <Link to="/search" className="sidebar-link"> */}
          <button onClick={() => setSearchModalOpen(true) } className="sidebar-button" ><i class="fas fa-search"></i>&nbsp; 검색</button>
        {/* </Link> */}
        <Link to={`/profile/${nickname}`} className="sidebar-link">
          <button className="sidebar-button"><i class="fas fa-id-card-alt"></i>&nbsp; 프로필</button>
        </Link>

        {/* <button className="sidebar-popular-button" onClick={fetchTopPostsWeek}>🔥 이주의 인기 게시글</button>
        <button className="sidebar-popular-button" onClick={fetchTopPostsMonth}>🔥 이달의 인기 게시글</button>


      {showTopPostsWeek && <PopularPostsSection title="이주의 인기 게시글" posts={topPostsWeek} />}
      {showTopPostsMonth && <PopularPostsSection title="이달의 인기 게시글" posts={topPostsMonth} />} */}
        <SearchModalComponent
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      </div>
    );
  };
  const saveComment =  async(postId , createdBy)=> {
    const content = commentsContent[postId] || '';
    const snsCommentRequestDto={
      snsPostId: postId,
      content: content,
      createdBy: createdBy
    }
    try {
      const response =  await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsComment`,snsCommentRequestDto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentsContent(prevComments => ({
        ...prevComments,
        [postId]: ''
      }));
      alert("댓글을 성공적으로 등록했습니다 :D");
    } catch (error) {
      const resp = error.response.data;
      console.log(resp);
      if (resp.errorCodeName === "022"){
        alert(resp.message);
      }
    }
  };
  const handleLikeClick = async (postId, memberNo) => {
    try {
      const response =await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPost/likes/`, null, {
        params: {
          id: postId,
          memberNo: memberNo
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status==200){
        window.location.reload();
      }
    } catch (error) {
      const resp = error.response.data;
      console.log(resp);
      if (resp.errorCodeName === "022"){
        alert(resp.message);
      }
    }
  };
  const getTimeSince = (createdAtArray) => {
    // createdAt 배열에서 Date 객체 생성
    const postDate = new Date(createdAtArray[0], createdAtArray[1] - 1, createdAtArray[2],
                              createdAtArray[3], createdAtArray[4], createdAtArray[5]);
    // 현재 날짜를 얻기
    const now = new Date();
  
    // 시간 차이 계산 (초 단위)
    const secondsPast = (now - postDate) / 1000;
  
    if (secondsPast < 60) {
      return `방금 전`;
    }
    if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)}분 전`;
    }
    if (secondsPast < 86400) {
      return `${Math.round(secondsPast / 3600)}시간 전`;
    }
    if (secondsPast < 172800) {
      return `어제`;
    }
    
    // Intl.DateTimeFormat을 사용하여 한국 시간대의 날짜 포맷으로 변환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Seoul'
    }).format(postDate);
  };
  
  const fetchTopPostsWeek = async () => {
    try {
      const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPost/week/top-ten`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopPostsWeek(response.data);
      setShowTopPostsWeek(true);
      navigate('/top-posts-week', { state: { topPosts: response.data } });
    } catch (error) {
      console.error('Failed to fetch top posts of the week', error);
    }
  };

  const fetchTopPostsMonth = async () => {
    try {
      const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPost/month/top-twenty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopPostsMonth(response.data);
      setShowTopPostsMonth(true);
      navigate('/top-posts-month', { state: { topPosts: response.data } });
    } catch (error) {
      console.error('Failed to fetch top posts of the month', error);
    }
  };
  const fetchTopHashTag = async () => {
    try {
      const response =await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/sns-hash-tag/top-ten`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      
      navigate('/top-hashTags', { state: { topHashTags: response.data } });
    } catch (error) {
      console.error('Failed to fetch top posts of the month', error);
    }
  };
  const PopularPostsHeader = () => {
    return (
      <div className="popular-posts-header">
        <button className="popular-button week" onClick={fetchTopPostsWeek}>🔥 이주의 인기 게시글 🔥</button>
        <button className="popular-button month" onClick={fetchTopPostsMonth}>🔥 이달의 인기 게시글 🔥</button>
        <button className="popular-button month" onClick={fetchTopHashTag}>🔥 인기 해시태그 🔥</button>
        <hr className="posts-divider"/>
      </div>
    );
  };
  return (
    <div className="sns-post-list">

      <Sidebar />
    
      <div className="posts-container">
      <PopularPostsHeader />
        {posts&& posts.map(post => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
            <img
              src="/images/profile-placeholder.png"
              alt="프로필 이미지"
              className="sns-profile-img"></img>&nbsp; <Link to={`/profile/${post.createdBy}`} className="author-link">{post.createdBy}</Link>
                  <span className="post-time">{getTimeSince(post.createdAt)}</span>
            </div>
            {post.imageUrls.length > 0 && (
              <div className="post-image-container">
                <ImageGalleryComponent imageUrls={post.imageUrls} />
              </div>
            )}
            <div className="post-title">
              {post.snsPostTitle}
              </div>
             <div className="post-content">
              <div className={`post-text ${expandedPosts[post.id] ? 'expanded' : ''}`}>
                {expandedPosts[post.id] ? post.snsPostContent : `${post.snsPostContent.slice(0, 70)}`}
              </div>
              {post.snsPostContent.length > 70 && (
                <button className="show-more" onClick={() => toggleContentExpansion(post.id)}>
                  {expandedPosts[post.id] ? '숨기기' : '더보기'}
                </button>

                )}
              
              <div className="post-meta">
                <div className="likes-and-comments">
                  <div className="likes">
                  <i className={`far fa-heart ${post.snsLikesStatus ? 'liked' : ''}`} onClick={() => handleLikeClick(post.id, memberNo)}></i>
                    <span>{post.snsLikesCount}명이 좋아합니다</span>
                  </div>
                  
                  <div className="comments">
                    <i className="far fa-comment"></i>
                    {post.commentCount!=null ? <button onClick={() => toggleComments(post.id)}>
                      {post.commentCount}개 댓글 보기 
                    </button> : null}
                  </div>
                  <div className="view-count">
                  조회수 : {post.snsViewsCount}회
                  </div>
                </div>
                <div className="hashtags">
                {post.hashTags && post.hashTags.map((tag, index) => (
                  <span key={index} className="hashtag">#{tag}</span>
                ))}
                </div>
                <div className="comment-input-container">
                <i class="far fa-smile"></i> &nbsp;&nbsp;<input type="text" placeholder="Add a comment..." className="comment-input"  value={commentsContent[post.id] || ''}
                   onChange={(e) => handleCommentChange(post.id, e.target.value)}/>
                    <button className="post-comment-button" onClick={() => saveComment(post.id, nickname)}>Post</button>
                </div>
                    
              </div>
            </div>
            
          </div>
        ))}
        {activeModalPostId  && (
                   <ModalComponent postId={activeModalPostId} show={true} onClose={() => setActiveModalPostId(null)} />
                )}
      </div>
    </div>
  );
};

export default SnsPostList;
