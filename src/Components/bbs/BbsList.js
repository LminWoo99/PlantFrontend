import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { AuthContext } from '../../context/AuthProvider';
import '../../css/bbslist.css';
import '../../css/pageable.css';
import api from '../api';

function BbsList() {
    const [tradeBoardDtos, setTradeBoardDtos] = useState([]);
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('bbs_access_token');
    const [searchVal, setSearchVal] = useState('');
    const [searchCondition, setSearchCondition] = useState(''); // 기본 검색 조건을 빈 문자열로 설정
    const [pageable, setPageable] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getBbsList = async (searchCondition, searchVal, page) => {
        try {
            const params = {
                page: page - 1,
                size: 9,
                ...((searchCondition && searchVal) && { [searchCondition]: searchVal }), // 검색 조건이 있을 경우에만 추가
            };
            const { data } = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/list`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('[BbsList.js] useEffect() success :D', data);
            const mappedData = data.content.map(item => ({
                id: item[0],
                title: item[1],
                content: item[2], // 적절한 이름으로 변경 필요
                createBy: item[3],
                memberId: item[4],
                view: item[5],
                status: item[6],
                createdAt: item[7],
                updatedAt: item[8],
                price: item[9],
                goodCount: item[10],
                buyer: item[11],
                keywordContent: item[12],
                imageUrls: item[13],
            }));
            setTradeBoardDtos(mappedData);
            setTotalCnt(data.totalElements);

            console.log(tradeBoardDtos);
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBbsList(null, '', 1); // 초기 로드 시 검색 조건 없이 호출
    }, []);

    const changeSearch = event => {
        setSearchVal(event.target.value);
    };

    const handleSearchConditionChange = (event) => {
        setSearchCondition(event.target.value);
    };

    const search = () => {
        console.log("[BbsList.js searchBtn()] searchVal=" + searchVal);
        navigate("/bbslist");
        const condition = searchCondition || null;
        getBbsList(condition, searchVal, 1);
    };

    const changePage = (newPage) => {
        console.log(newPage);
        setPageable(newPage);
        const condition = searchCondition || null;
        getBbsList(condition, searchVal, newPage);
    };

    const handleCardClick = (id) => {
        navigate(`/bbsdetail/${id}`);
    };

    return (
        <div className="tradeBoard-bbs-list-container">
            <div className="tradeBoard-search-container">
                <input
                    type="text"
                    className="form-control tradeBoard-search-input"
                    placeholder="검색어를 입력하세요"
                    value={searchVal}
                    onChange={changeSearch}
                />
                <div className="tradeBoard-search-condition-selector">
                    <label>
                        <input
                            type="radio"
                            value="title"
                            checked={searchCondition === 'title'}
                            onChange={handleSearchConditionChange}
                        />
                        제목
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="keyword"
                            checked={searchCondition === 'keyword'}
                            onChange={handleSearchConditionChange}
                        />
                        키워드
                    </label>
                </div>
                <button type="button" className="btn btn-outline-secondary tradeBoard-search-button" onClick={search}>
                    <i className="fas fa-search"></i> 검색
                </button>
            </div>

            {loading ? (
                <div className="tradeBoard-loading-message">
                    <div className="tradeBoard-loading-spinner"></div>
                    데이터를 가져오는 중입니다. 잠시만 기다려주십시오...
                </div>
            ) : (
                <div className="tradeBoard-card-list">
                    {tradeBoardDtos.map((tradeBoardResponseDto) => (
                        <div className="tradeBoard-card" key={tradeBoardResponseDto.id} onClick={() => handleCardClick(tradeBoardResponseDto.id)}>
                            <img src={tradeBoardResponseDto.imageUrls || '/images/default-thumbnail.png'} alt="Thumbnail" className="tradeBoard-card-thumbnail" />
                            <div className="tradeBoard-card-body">
                                <h5 className="tradeBoard-card-title">{tradeBoardResponseDto.title}</h5>
                                <p className="tradeBoard-card-status">거래상태: {tradeBoardResponseDto.status}</p>
                                <p className="tradeBoard-card-author">작성자: {tradeBoardResponseDto.createBy}</p>
                                <p className="tradeBoard-card-price">가격: {tradeBoardResponseDto.price} 원</p>
                                <p className="tradeBoard-card-views">조회수: {tradeBoardResponseDto.view}</p>
                                <p className="tradeBoard-card-likes">⭐️ {tradeBoardResponseDto.goodCount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                className="tradeBoard-pagination"
                activePage={pageable}
                itemsCountPerPage={9}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={changePage}
            />

            <div className="my-5 d-flex justify-content-center">
                <Link className="btn btn-outline-secondary" to="/bbswrite"><i className="fas fa-pen"></i> &nbsp; 글쓰기</Link>
            </div>
        </div>
    );
}

export default BbsList;
