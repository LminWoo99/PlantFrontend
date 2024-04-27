import React from 'react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
  
    return (
      <div className="confirm-modal-overlay">
        <div className="confirm-modal">
          <p className="confirm-modal-message">게시글을 삭제할까요?</p>
          <div className="confirm-modal-actions">
            <button onClick={onConfirm} className="confirm-modal-button confirm">삭제</button>
            <button onClick={onCancel} className="confirm-modal-button cancel">취소</button>
          </div>
        </div>
      </div>
    );
  };
export default ConfirmModal  