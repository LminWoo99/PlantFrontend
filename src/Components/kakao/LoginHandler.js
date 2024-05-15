import { useNavigate } from "react-router-dom";
import { useEffect , useContext} from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import api from "../api"



function LoginHandler() {
    const { auth, setAuth } = useContext(AuthContext);
const { headers, setHeaders } = useContext(HttpHeadersContext);
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");
    console.log(code);

    // 인가코드 백으로 보내는 코드
    useEffect(() => {
        const kakaoLogin = async () => {
            await api({
                method: "GET",
                url: `${process.env.REACT_APP_SERVER_URL}/plant-service/api/oauth2/login/kakao/?code=${code}`,
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                
                }
            }).then((res) => {
                console.log(res);
                localStorage.setItem("id", res.data.id);
                localStorage.setItem("nickname", res.data.nickname);
                localStorage.setItem("bbs_access_token", res.data.access_token);
                localStorage.setItem("username", res.data.username);
                setAuth(res.data.id);
                setHeaders({"Authorization": `Bearer ${res.data.jwt}`});
                localStorage.setItem("email", res.data.email);

                
                navigate("/");
              

                window.location.reload()
            });
        };

        kakaoLogin();
    }, [navigate]);


    return (
        <div className="LoginHandeler">
            <div className="notice">
                <p>로그인 중입니다.</p>
                <p>잠시만 기다려주세요.</p>
                <div className="spinner"></div>
            </div>
        </div>
    );
}

export default LoginHandler;
