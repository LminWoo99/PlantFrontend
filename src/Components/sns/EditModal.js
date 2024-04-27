import React, { useState, useEffect , useRef} from 'react';
import '../../css/EditModal.css';

const EditModal = ({ imageUrls, content, tags, onContentChange, onTagsChange, onSave, onClose }) => {
  // Convert array of tags to a string with each tag prefixed by `#` and separated by ", "
  const tagsString = tags.map(tag => `#${tag}`).join(', ');

  // Handle changes to the input for tags, converting from string to array
  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(/,\s*/).map(tag => tag.replace(/^#/, ''));
    onTagsChange(newTags);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>게시글 수정</h3>
          <button onClick={onClose} className="edit-modal-close-button">X</button>
        </div>
        <div className="edit-modal-body">
          <div className="edit-modal-image-container">
            {imageUrls && imageUrls[0] && <img src={imageUrls[0]} alt="Post" />}
          </div>
          <div className="edit-modal-form">
            <label htmlFor="post-content">내용</label>
            <textarea
              id="post-content"
              className="edit-modal-textarea"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
            />
            <label htmlFor="post-tags">해시태그</label>
            <input
              id="post-tags"
              type="text"
              className="edit-modal-input"
              value={tagsString}
              onChange={handleTagsChange}
            />
            <button onClick={onSave} className="edit-modal-save-button">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
