import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import "../../css/BbsDetail.css";
import ImageGalleryComponent from "./ImageGalleryComponent";
import api from "../api"

function BbsDetail() {
    const { auth } = useContext(AuthContext);
    const { headers } = useContext(HttpHeadersContext);
    const [tradeBoardDto, setTradeBoardDto] = useState({});
    const { id } = useParams();
    const token = localStorage.getItem("bbs_access_token");
    const [tradeId, setTradeId] = useState(0);
    const [view, setView] = useState(0);
    const [memberId, setMemberId] = useState(0);
    const [price, setPrice] = useState();
    const [goodStatus, setGoodStatus] = useState(false);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [chatButtonText, setChatButtonText] = useState("");
    const [status, setStatus] = useState("");
    const [keywordContent, setKeywordContent] = useState("");

    function formatDate(dateString) {
        if (!dateString || !Array.isArray(dateString) || dateString.length < 5) {
            return "Invalid date";
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
                console.log(resp);
                setTradeBoardDto(resp.data);
                setTradeId(resp.data.id);
                setView(resp.data.view);
                setMemberId(resp.data.memberId);
                setStatus(resp.data.status);
                setPrice(resp.data.price);
                setKeywordContent(resp.data.keywordContent);
                setImageUrls(resp.data.imageUrls);

                if (auth === resp.data.createBy) {
                    setChatButtonText("대화중인 채팅방 가기");
                } else {
                    setChatButtonText("채팅하기");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getGoodsStatus = async () => {
        try {
            const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/status`, {
                params: { memberId: localStorage.getItem("id"), tradeBoardId: id },
                headers: { Authorization: `Bearer ${token}` },
            });

            setGoodStatus(response.data);
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        getBbsDetail();
        getGoodsStatus();
    }, []);

    const deleteBbs = async () => {
        await api.delete(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/list/${id}`, { headers })
            .then(() => {
                alert("게시글을 성공적으로 삭제했습니다 :D");
                navigate("/bbslist");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleLikeClick = async () => {
        if (!auth) {
            navigate("/login");
            return;
        }

        const goodsRequestDto = {
            memberId: localStorage.getItem("id"),
            tradeBoardId: tradeId,
        };

        try {
            if (!goodStatus) {
                await api.post(
                    `${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/${memberId}`,
                    goodsRequestDto,
                    { headers }
                );
                setGoodStatus(true);
                alert("찜 목록에 추가되었어요!");
            } else {
                await api.post(
                    `${process.env.REACT_APP_SERVER_URL}/plant-service/api/goods/${memberId}`,
                    goodsRequestDto,
                    { headers }
                );
                setGoodStatus(false);
                alert("찜 취소하셨습니다!");
            }
            window.location.reload();
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChatClick = async () => {
        console.log(tradeBoardDto.memberId);
        console.log(localStorage.getItem("id"));
        try {
            
            if (localStorage.getItem("nickname") === tradeBoardDto.createBy) {
                
                const resp = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom/exist/seller`, {
                    params: { 
                        tradeBoardNo: Number(tradeId),
                        memberNo: Number(localStorage.getItem("id"))
                    },
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!resp.data) {
                    navigate("/noChatRoomExist");
                } else {
                    navigate(`/chatroom/${tradeId}`);
                }
            } else {
                const chatRequestDto = {
                    tradeBoardNo: tradeId,
                    createMember: Number(localStorage.getItem("id")),
                };
                const response = await api.post(`${process.env.REACT_APP_SERVER_URL}/plant-chat-service/chatroom`, chatRequestDto, {
                    params: { memberNo: tradeBoardDto.memberId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const chatNo = response.data.data.chatNo;
                navigate(`/chatroom/${chatNo}/${chatRequestDto.tradeBoardNo}/${tradeBoardDto.createBy}`);
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    const updateBbs = {
        id: tradeBoardDto.id,
        createBy: tradeBoardDto.createBy,
        title: tradeBoardDto.title,
        content: tradeBoardDto.content,
        status: tradeBoardDto.status,
        price: tradeBoardDto.price,
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
                </button>
                <Link className="btn btn-outline-secondary" onClick={handleChatClick}>{chatButtonText}</Link>
                {auth === tradeBoardDto.createBy && (
                    <>
                        <Link className="btn btn-outline-secondary" to="/bbsupdate" state={{ tradeBoardDto: updateBbs }}>
                            <i className="fas fa-edit"></i> 수정
                        </Link>
                        <button className="btn btn-outline-danger" onClick={deleteBbs}>
                            <i className="fas fa-trash-alt"></i> 삭제
                        </button>
                    </>
                )}
            </div>

            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>이미지</th>
                        <td>
                            <button className="btn btn-outline-primary" onClick={() => setShowImage(!showImage)}>
                                {showImage ? "이미지 감추기" : "상품 이미지 상세히 보기"}
                            </button>
                            {showImage && <ImageGalleryComponent imageUrls={imageUrls} />}
                        </td>
                    </tr>
                    <tr>
                        <th className="col-3">작성자</th>
                        <td><span>{tradeBoardDto.createBy}</span></td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td><span>{tradeBoardDto.title}</span></td>
                    </tr>
                    <tr>
                        <th>작성일</th>
                        <td><span>{formatDate(tradeBoardDto.updatedAt || tradeBoardDto.createdAt)}</span></td>
                    </tr>
                    <tr>
                        <th>조회수</th>
                        <td><span>{tradeBoardDto.view}</span></td>
                    </tr>
                    <tr>
                        <th>거래 상태</th>
                        <td><span>{status}</span></td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <div className="content-section">{tradeBoardDto.content}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>카테고리</th>
                        <td><span>{keywordContent}</span></td>
                    </tr>
                    <tr>
                        <th>가격</th>
                        <td><span>{new Intl.NumberFormat().format(price)}원</span></td>
                    </tr>
                </tbody>
            </table>

            <div className="my-3 d-flex justify-content-center">
                <Link className="btn btn-outline-secondary" to="/bbslist">
                    <i className="fas fa-list"></i> 글목록
                </Link>
            </div>
        </div>
    );
}

export default BbsDetail;
