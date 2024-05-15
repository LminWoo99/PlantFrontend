import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api"

function ResetPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("bbs_access_token");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage("");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const memberDto = {
        username: username,
        password: newPassword
      };

      await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/user/pwd`, memberDto,{headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      setSuccessMessage("비밀번호가 재설정되었습니다.");
      setErrorMessage("");

      // 비밀번호 재설정 완료 후 '/'로 이동
      navigate("/");

      // 비밀번호 재설정 완료 후 alert 메시지 표시
      alert("비밀번호가 재설정되었습니다.");
    } catch (error) {
      const resp = error.response.data;
      console.log(resp);
      if (resp.errorCodeName === "006"){
        alert(resp.message);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>비밀번호 재설정</h2>
      <div>
        <input
          type="text"
          placeholder="아이디 입력"
          value={username}
          onChange={handleUsernameChange}
          style={{ width: "300px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="새로운 비밀번호 입력"
          value={newPassword}
          onChange={handleNewPasswordChange}
          style={{ width: "300px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          style={{ width: "300px", marginBottom: "10px" }}
        />
        <button onClick={handleResetPassword}>비밀번호 재설정</button>
        {errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
