import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthProvider";
import api from "../api";
function Logout() {

	const { auth, setAuth } = useContext(AuthContext);

	const navigate = useNavigate();
	
	const logout = async () => {
		
		localStorage.removeItem("nickname");
		localStorage.removeItem("username");
		localStorage.removeItem("bbs_access_token");
		localStorage.removeItem("id");
		localStorage.removeItem("accessToken");
		
		alert(auth + "님, 성공적으로 로그아웃 됐습니다 🔒");
		setAuth(null);
		
		navigate("/");
	};

	useEffect(() => {
		logoutApi()
		
	}, []);
	const logoutApi =  async () => {
		const token=localStorage.getItem("bbs_access_token");
		await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-service/token/logout`, {}, {
			headers: { 'Authorization': `${token}` }
		  })
		.then((resp) => {

				
			console.log(resp)			
			logout();
		}).catch((err) => {
			console.log("[Logout.js] login() error :<");
		});
	}
}

export default Logout;