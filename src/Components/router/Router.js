import { Routes, Route } from "react-router-dom";

import Home from "../app/Home"
import BbsList from "../bbs/BbsList"
import BbsWrite from "../bbs/BbsWrite"
import BbsDetail from "../bbs/BbsDetail"
import BbsUpdate from "../bbs/BbsUpdate"

import Join from "../member/Join"
import Login from "../member/Login"
import Logout from "../member/Logout"
import LoginHandler from '../kakao/LoginHandler';
import MyTradeInfo from "../member/MyTradeInfo";
import WishList from "../member/WishList";
import PlantList from "../plantInfo/PlantList";
import PlantDetail from "../plantInfo/PlantDetail";
import BuyerSelection from "../bbs/BuyerSelection";
import FindId from "../member/FindId";
import ResetPassword from "../member/ResetMember";
import BuyInfo from "../member/BuyInfo";
import ChatRoom from "../chat/ChatRoom";
import ChatList from "../chat/ChatList";
import NoChatRoomExist from "../chat/NoChatRoomExist";
import NotificationList from "../notification/NotificationList";
import Payment from "../payment/Payment";
import PaymentPage from "../payment/PaymentPage";
import MyAccountPage from "../app/MyAccountPage";
import CouponComponent from "../coupon/CouponComponent";
import CouponList from "../coupon/CouponList";
import CouponModal from "../coupon/CouponModal";
import SnsPostList from "../sns/SnsPostList";
import SnsPostForm from "../sns/SnsPostForm";
import SnsProfile from "../sns/SnsProfile";
import SearchResultsComponent from "../sns/SearchResultsComponent";
import TopPostsWeek from "../sns/TopPostsWeek";
import TopPostsMonth from "../sns/TopPostsMonth";
import TopHashTags from "../sns/TopHashTags";
import ModalComponent from "../sns/ModalComponent";
import KeywordList from "../keyword/KeywordList";

function Router() {

	return (
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/oauth2/login/kakao" element={<LoginHandler />}></Route>
				<Route path="/findId" element={<FindId />}></Route>
				<Route path="/resetmember" element={<ResetPassword />}></Route>
				<Route path="/bbslist" element={<BbsList />}></Route>
				<Route path="myaccount" element={<MyAccountPage />}></Route>
				<Route path="/keywordlist" element={<KeywordList />}></Route>
				
				<Route path="/bbswrite" element={<BbsWrite />}></Route>
				<Route path="/bbsdetail/:id" element={<BbsDetail />}></Route>
				
				<Route path="/plantlist" element={<PlantList />}></Route>
				<Route path="/plantdetail/:id" element={<PlantDetail />}></Route>
				<Route path="/bbsupdate" element={<BbsUpdate />}></Route>
				<Route path="/bbsbuyer/:id/:nickname" element={<BuyerSelection />}></Route>

				<Route path="/sales" element={<MyTradeInfo />}> </Route>
				<Route path="/wishlist" element={<WishList />}> </Route>
				<Route path="/buyInfo" element={<BuyInfo />}> </Route>
				<Route path="/coupon" element={<CouponComponent />}> </Route>
				<Route path="/couponList" element={<CouponList />}> </Route>
				<Route path="/couponModal" element={<CouponModal />}> </Route>

				<Route path="/login" element={<Login />}></Route>
				<Route path="/join" element={<Join />}></Route>
				<Route path="/logout" element={<Logout />}></Route>
				<Route path="/noChatRoomExist" element={<NoChatRoomExist />}></Route>
				<Route path="/chatroom/:tradeBoardNo" element={<ChatList />}></Route>
				<Route path="/notificationlist" element={<NotificationList />}></Route>
				<Route path="/chatroom/:id/:tradeBoardNo/:nickname" element={<ChatRoom />} />
				<Route path="/payment" element={<Payment />}></Route>
				<Route path="/paymentpage" element={<PaymentPage />}></Route>

				<Route path="/snspostlist" element={<SnsPostList />}></Route>
				<Route path="/snspostlist/:postId" element={<SnsPostList />} />
				<Route path="/snspostform" element={<SnsPostForm />}></Route>
				<Route path="/profile/:createdBy" element={<SnsProfile />}></Route>
				<Route path="/search-results" element={<SearchResultsComponent />} />

				<Route path="/top-posts-week" element={<TopPostsWeek />} />
				<Route path="/top-posts-month" element={<TopPostsMonth />} />
				<Route path="/top-hashTags" element={<TopHashTags />} />

			</Routes>
	);
}

export default Router;