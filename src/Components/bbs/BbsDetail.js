import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import { AuthContext } from "../../context/AuthProvider";
import Comment from "../comment/Comment";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import "../../css/BbsDetail.css";
import ImageGalleryComponent from "./ImageGalleryComponent";
import api from "../api"
function BbsDetail() {
    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [tradeBoardDto, setTradeBoardDto] = useState({});
    const { id } = useParams();
    const token = localStorage.getItem("bbs_access_token");
    const [tradeId, setTradeId] = useState(0);

    const [view, setView] = useState(0);
    const [replyList, setReplyList] = useState([]);

    const [memberId, setMemberId] = useState(0);
	// const [chatNo, setChatNo] = useState(0);
    const [price, setPrice] = useState();
    const [goodStatus, setGoodStatus] = useState(false);
    const navigate = useNavigate();

    const [imageUrls, setImageUrls] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [chatButtonText, setChatButtonText] = useState("");
    const [status, setStatus] = useState("");
    const [isOpen, setIsOpen]=useState(false);
    function formatDate(dateString) {
        if (!dateString || !Array.isArray(dateString) || dateString.length < 5) {
            console.log("Invalid or incomplete date data", dateString);
            return "Invalid date";  // You can return an empty string or any placeholder text
        }
    
        const year = dateString[0];
        const month = String(dateString[1]).padStart(2, "0");
        const day = String(dateString[2]).padStart(2, "0");
        const hours = String(dateString[3]).padStart(2, "0");
        const minutes = String(dateString[4]).padStart(2, "0");
    
        return `${year}/${month}/${day} ${hours}시 ${minutes}분`;
    }



    const getBbsDetail = async () => {
        await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/list/${id}`, { headers })
            .then((resp) => {
                console.log("[BbsDetail.js] getBbsDetail() success :D");
                console.log(resp.data);
                

                setTradeBoardDto(resp.data);
                setTradeId(resp.data.id);
                setView(resp.data.view); 
                setMemberId(resp.data.memberId);
                setStatus(resp.data.status);
                setPrice(resp.data.price);
                
                setImageUrls(resp.data.imageUrls);

                console.log(tradeBoardDto.createdAt);
                if (auth == resp.data.createBy) {
                    setChatButtonText("대화중인 채팅방 가기");
                } 
                else { 
                    setChatButtonText("채팅하기");
                }
            })
            .catch((err) => {
                // const resp = err.response.data;
                // console.log(resp);
                // if (resp.errorCodeName === "016"){
                // alert(resp.message);
                // }
            });
    };
    const getBbsView = async () => {
        await api
            .get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/view/${id}`, { headers })
            .then((resp) => {
                console.log("[BbsDetail.js] getBbsView() success :D");
                setView(resp.data); // view 값 업데이트
            })
            .catch((err) => {
                console.log("[BbsDetail.js] getBbsView() error :<");
                console.log(err);
                
            });
    };

    const deleteBbs = async () => {
        await api
            .delete(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/list/${id}`, { headers })
            .then((resp) => {
                console.log("[BbsDetail.js] deleteBbs() success :D");
                console.log(resp.data);

                alert("게시글을 성공적으로 삭제했습니다 :D");
                navigate("/bbslist");
            })
            .catch((err) => {
                console.log("[BbsDetail.js] deleteBbs() error :<");
                console.log(err);
            });
    };
    const handleLikeClick = async () => {
        try {
            if (!auth) {
                // 로그인하지 않았을 경우 로그인 페이지로 이동
                navigate("/login");
                return;
            }

            const goodsRequestDto = {
                memberId: localStorage.getItem("id"),
                tradeBoardId: tradeId,
            };

            if (!goodStatus) {
                const response = await api.post(
                    `${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/${memberId}`,
                    goodsRequestDto,
                    { headers }
                );

                // 찜 목록에 추가되었을 때 상태 업데이트
                setGoodStatus(true);
                alert("찜 목록에 추가되었어요!");
                window.location.reload();
                console.log(response.data);
            } else {
                const response = await api.post(
                    `${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/${memberId}`,
                    goodsRequestDto,
                    { headers }
                );
                // 찜 취소되었을 때 상태 업데이트
                setGoodStatus(false);
                alert("찜 취소하셨습니다!");
                window.location.reload();
            }
        } catch (error) {
            const resp = error.response;
            console.log(resp);
            // if (resp.errorCodeName === "016"){
            // alert(resp.message);
            // }
        }
    };

    const getGoodsStatus = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/status`, {
                params: { memberId: localStorage.getItem("id"), tradeBoardId: id },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data == true) {
                console.log(response.data);
                setGoodStatus(true);
            } else {

                setGoodStatus(false);
            }
        } catch (error) {
            const resp = error.response.data;
            console.log(resp);
            if (resp.errorCodeName === "007"){
            alert(resp.message);

            }
        }
    };


    useEffect(() => {
        getBbsDetail();
        getGoodsStatus();
        // getReplyList();
 

    }, []);
    const updateBbs = {
        id: tradeBoardDto.id,
        createBy: tradeBoardDto.createBy,
        title: tradeBoardDto.title,
        content: tradeBoardDto.content,
        status: tradeBoardDto.status,
        price: tradeBoardDto.price,
    };

    const parentBbs = {
        id: tradeBoardDto.id,
        title: tradeBoardDto.title,
    };
    const data = {
        tradeBoardId: tradeBoardDto.id,
        memberId: tradeBoardDto.memberId,
    };



// 채팅 클릭 핸들러 함수
const handleChatClick = async () => {
    try {
        if(localStorage.getItem("id")==tradeBoardDto.memberId){
            const resp = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/exist/seller` ,{
                params: { 
                    tradeBoardNo: Number(tradeId),
                    memberNo: Number(localStorage.getItem("id"))
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
                
            }
        );
        console.log(resp);
            if (resp.data==false){
                navigate("/noChatRoomExist");
            }
            else{
                navigate(`/chatroom/${tradeId}`);
            }

        }
        else{
        const chatRequestDto = {
            tradeBoardNo: tradeId,
            createMember: Number(localStorage.getItem("id")),
        };
        const accessToken = `Bearer ${window.localStorage.getItem('bbs_access_token')}`;
        // 채팅 방 생성 요청
        const response = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom`, chatRequestDto, {
            params: { memberNo: tradeBoardDto.memberId },
            headers: {
                Authorization: accessToken,
            },
        });
        console.log(response);
        const chatNo = response.data.data.chatNo;
        console.log(chatNo);
        navigate(`/chatroom/${chatNo}/${chatRequestDto.tradeBoardNo}/${tradeBoardDto.createBy}`);

        
        
        }
    } catch (error) {
        const resp = error.response;
        console.log(resp);
        // if (resp.errorCodeName === "016"){
        //   alert(resp.message);
        // }
    }
};



    return (
        <div>
            {status === "거래완료" && (
                <div className="modal-container">
                    <div className="modal-content">
                        <p style={{ color: "red", fontSize: "24px" }}>거래 완료된 게시글 입니다</p>
                        <div className="my-3">
                            <Link className="btn btn-outline-secondary" to="/bbslist">
                                <i className="fas fa-list"></i> 글목록
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <div className="my-3 d-flex justify-content-end">
                <span className="ml-2" style={{ padding: "0.5em" }}>
                    {tradeBoardDto.goodCount}명이 찜했어요
                </span>
                <button className="btn btn-outline-info" onClick={handleLikeClick}>
                    <i className={`fas ${goodStatus ? "fa-check" : "fa-star"}`}></i>{" "}
                    {goodStatus ? "찜취소하기" : "찜하기"}
                </button>{" "}
                <Link className="btn btn-outline-secondary" onClick={handleChatClick}>{chatButtonText}</Link>

                {" "}
                {/*
                자신이 작성한 게시글인 경우에만 수정 삭제 가능
                */}
                {auth == tradeBoardDto.createBy ? (
                    <>
                        {/* 찜 버튼 추가 */}
                        <Link className="btn btn-outline-secondary" to="/bbsupdate" state={{ tradeBoardDto: updateBbs }}>
                            <i className="fas fa-edit"></i> 수정
                        </Link>{" "}
                        <button className="btn btn-outline-danger" onClick={deleteBbs}>
                            <i className="fas fa-trash-alt"></i> 삭제
                        </button>
                    </>
                ) : null}
            </div>

            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>이미지</th>
                        <td>
                            {/* 이미지 상세히 보기 버튼 */}
                            <button className="btn btn-outline-primary" onClick={() => setShowImage(!showImage)}>
                                {showImage ? "이미지 감추기" : "상품 이미지 상세히 보기"}
                            </button>
                            {showImage && <ImageGalleryComponent imageUrls={imageUrls} />}
                        </td>
                    </tr>
                    <tr>
                        <th className="col-3">작성자</th>
                        <td>
                            <span>{tradeBoardDto.createBy}</span>
                        </td>
                    </tr>

                    <tr>
                        <th>제목</th>
                        <td>
                            <span>{tradeBoardDto.title}</span>
                        </td>
                    </tr>

                    <tr>
                        <th>작성일</th>
                        <td>
                            <span>{formatDate(tradeBoardDto.updatedAt || tradeBoardDto.createdAt)}</span>
                        </td>
                    </tr>

                    <tr>
                        <th>조회수</th>
                        <td>
                            <span>{tradeBoardDto.view}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>거래 상태</th>
                        <td>
                            <span>{status}</span>
                        </td>
                    </tr>

                    <tr>
                        <th>내용</th>
                        <td>
                            <div style={{ maxHeight: "400px", overflowY: "auto" }}>{tradeBoardDto.content}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>가격</th>
                        <td>
                            <span>{new Intl.NumberFormat().format(price)}원</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="my-3 d-flex justify-content-center">
                <Link className="btn btn-outline-secondary" to="/bbslist">
                    <i className="fas fa-list"></i> 글목록
                </Link>
            </div>
            <br />
            <br />

    
        </div>
    );

}

export default BbsDetail;
