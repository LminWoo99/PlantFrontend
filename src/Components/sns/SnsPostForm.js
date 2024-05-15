import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../css/SnsPostForm.css';
import api from "../api"

const SnsPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashTags, setHashTags] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem("bbs_access_token");
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const oversizedFiles = files.filter(file => file.size > 1048576); // 1MB = 1048576 bytes

    if (oversizedFiles.length > 0) {
      alert('파일 크기가 1MB를 초과합니다.');
      return; // 이 경우 추가 작업을 중지
    }

    setSelectedFiles(files);
  };

  const handleHashTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim().replace(/^#/, ''));
    setHashTags(tags);
  };

  const hashTagsString = hashTags.map(tag => `#${tag}`).join(', ');

  const validateFields = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return false;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return false;
    }
    if (hashTags.length === 0 || hashTags.includes("")) {
      alert('적어도 하나 이상의 해시태그를 입력해주세요.');
      return false;
    }
    if (selectedFiles.length === 0) {
      alert('하나 이상의 이미지를 업로드해주세요.');
      return false;
    }
    return true; // 모든 검사 통과
  };

  const uploadPost = async () => {
    const snsPostRequestDto = {
      snsPostTitle: title,
      snsPostContent: content,
      memberNo: localStorage.getItem("id"),
      hashTags: hashTags,
      createdBy: localStorage.getItem("nickname"),
      snsLikesCount: 0,
      snsViewsCount: 0,
    };

    const formData = new FormData();
    formData.append("snsPostRequestDto", new Blob([JSON.stringify(snsPostRequestDto)], {type: "application/json"}));
    
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-sns-service/snsPosts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('게시글이 업로드되었습니다.');
      navigate("/snspostlist");
      return response.data;
    } catch (error) {
      const resp = error.response.data;
      console.log(resp);
      if (resp.errorCodeName === "025"){
        alert(resp.message);
      }
      if (resp.errorCodeName === "008"){
        alert(resp.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) { // 필드 유효성 검사
      try {
        const snsPostId = await uploadPost();
        console.log(snsPostId);
        
      } catch (error) {
        alert('업로드에 실패했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sns-post-form">
      <div>
        <label>제목:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>내용:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="hashtags-input">
        <label>해시태그:</label>
        <input type="text" placeholder="해시태그 입력, 쉼표로 구분" value={hashTagsString} onChange={handleHashTagsChange} />
      </div>
      <div className="image-upload">
        <label>이미지:</label>
        <input type="file" multiple onChange={handleImageChange} />
      </div>
      <button type="submit">게시글 업로드</button>
    </form>
  );
};

export default SnsPostForm;
