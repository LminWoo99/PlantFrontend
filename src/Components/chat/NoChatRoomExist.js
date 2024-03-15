import React from 'react';
import '../../css/NoChatRoomExist.css'; // Ensure you have this CSS file in your project

const NoChatRoomExist = () => {
  return (
    <div className="no-chat-room">
      <div className="no-chat-header">
        <span className="back-arrow">{"<"}</span>
        <h1 className="header-title">채팅하기</h1>
      </div>
      <div className="divider"></div>
      <div className="no-chat-content">

        <p className="no-chat-text">대화하거나 채팅을 남긴 사람이<br/>아직 없어요. 😔</p>
      </div>
    </div>
  );
};

export default NoChatRoomExist;
