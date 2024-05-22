import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { AuthContext } from '../../context/AuthProvider';
import '../../css/bbslist.css';
import '../../css/pageable.css';
import api from '../api';
import { debounce } from 'lodash';

function BbsList() {
    const [tradeBoardDtos, setTradeBoardDtos] = useState([]);
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('bbs_access_token');
    const [searchVal, setSearchVal] = useState('');
    const [pageable, setPageable] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(tradeBoardDtos);

    const getBbsList = async (search, page) => {
        setLoading(true);
        try {
            const { data } = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/list`, {
                params: { search, page: page - 1, size: 9 },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('[BbsList.js] useEffect() success :D', data);
            setTradeBoardDtos(data.content);
            setTotalCnt(data.totalElements);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBbsList('', 1);
    }, []);

    const changeSearch = event => {
        setSearchVal(event.target.value);
        debouncedSearch(event.target.value);
    };

    const debouncedSearch = useCallback(
        debounce((nextValue) => getBbsList(nextValue, 1), 500),
        []
    );

    const search = () => {
        console.log("[BbsList.js searchBtn()] searchVal=" + searchVal);
        navigate("/bbslist");
        getBbsList(searchVal, 1);
    };

    const changePage = (newPage) => {
        console.log(newPage);
        setPageable(newPage);
        getBbsList(searchVal, newPage);
    };

    const handleCardClick = (id) => {
        navigate(`/bbsdetail/${id}`);
    };

    return (
        <div>
            <table className="search">
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="제목, 내용, 키워드로 검색"
                                value={searchVal}
                                onChange={changeSearch}
                            />
                        </td>
                        <td>
                            <button type="button" className="btn btn-outline-secondary" onClick={search}>
                                <i className="fas fa-search"></i> 검색
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table><br />

            {loading ? (
                <div className="loading-message">
                    <div className="loading-spinner"></div>
                    데이터를 가져오는 중입니다. 잠시만 기다려주십시오...
                </div>
            ) : (
                <div className="card-list">
                    {tradeBoardDtos.map((tradeBoardDto) => (
                        <div className="card" key={tradeBoardDto.id} onClick={() => handleCardClick(tradeBoardDto.id)}>
                            <img src={tradeBoardDto.imageUrls || '/images/default-thumbnail.png'} alt="Thumbnail" className="card-thumbnail" />
                            <div className="card-body">
                                <h5 className="card-title">{tradeBoardDto.title}</h5>
                                <p className="card-status">거래상태: {tradeBoardDto.status}</p>
                                <p className="card-author">작성자: {tradeBoardDto.createBy}</p>
                                <p className="card-price">가격: {tradeBoardDto.price} 원</p>
                                <p className="card-views">조회수: {tradeBoardDto.view}</p>
                                <p className="card-likes">⭐️ {tradeBoardDto.goodCount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                className="pagination"
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
