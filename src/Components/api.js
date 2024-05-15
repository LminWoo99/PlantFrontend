import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const api =  axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json'
  }
});
const token = localStorage.getItem("bbs_access_token");
api.interceptors.response.use(
    
  response => response,
  async error => {
    const originalRequest = error.config;

    // 로그인 필요 에러 처리
    if (error.response.status === 401 && error.response.data === '로그인이 필요한 서비스입니다.') {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // JWT 토큰 만료 처리
    if (error.response.status === 401 && error.response.data === 'Jwt token is not vaild') {
        console.log(token)
      if (token) {
        try {
            const tokenResponse = await api.post('/plant-service/token/refresh', {}, {
                headers: { 'Authorization': `${token}` }
              });
              console.log(tokenResponse);
        if (tokenResponse.data.status==200){
          localStorage.setItem('bbs_access_token', tokenResponse.data.accessToken);

          // 원래 요청 다시 시도
          originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
          return axios(originalRequest);}
        } catch (refreshError) {
          console.error('Unable to refresh token', refreshError);
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;