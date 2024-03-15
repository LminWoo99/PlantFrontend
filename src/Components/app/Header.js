import myImage from './plant.png';
import image from './KakaoTalk_Photo_2023-10-08-11-43-47.png';
import '../../css/header.css'
function Header() {
	return (
		
		<header className="header">
			
			<div className="container text-center">
			<img src={image}
			className="logo"/>
			<h1>식구하자</h1>
			</div>
		</header>
	);
}

export default Header;