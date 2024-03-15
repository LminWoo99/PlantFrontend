import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import { AuthContext } from "../../context/AuthProvider";
import "../../css/bbslist.css";
import "../../css/pageable.css";


function BbsList() {

	const [tradeBoardDtos, setTradeBoardDtos] = useState([]);
	const { auth, setAuth } = useContext(AuthContext)

	const token = localStorage.getItem("bbs_access_token");
	
	const [searchVal, setSearchVal] = useState("");


	const [pageable, setPageable] = useState(1);
	const [totalCnt, setTotalCnt] = useState(0);

	
	let navigate = useNavigate();

	const getBbsList = async (search, pageable) => {
		await axios.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/write`, { params: { "search": search, "page": pageable-1 }, headers: {
			Authorization: `Bearer ${token}`,
		  } })
			.then((resp) => {
				console.log("[BbsList.js] useEffect() success :D");
				console.log(resp.data);
				console.log(pageable);
				setTradeBoardDtos(resp.data.content);
				setTotalCnt(resp.data.totalElements);
			
			})
			.catch((err) => {
				console.log("[BbsList.js] useEffect() error :<");

				// // console.log(""err);
				// alert("로그인이 필요한 서비스입니다");

				
			});
	}

	useEffect(() => {
		getBbsList("",  1);
	}, []);


	
	const changeSearch = (event) => { setSearchVal(event.target.value); }
	const search = () => {
		console.log("[BbsList.js searchBtn()] searchVal=" + searchVal);

		navigate("/bbslist");
		getBbsList(searchVal, 1);
	}

	const changePage = (pageable) => {
		console.log(pageable);
		setPageable(pageable);
		getBbsList(searchVal, pageable);
	}

	return (

		<div>

			{ /* 검색 */}
			<table className="search">
				<tbody>
					<tr>
					
						<td>
							<input type="text" className="form-control" placeholder="제목, 내용으로 검색" value={searchVal} onChange={changeSearch} />
						</td>
						<td>
							<button type="button" className="btn btn-outline-secondary" onClick={search}><i className="fas fa-search"></i> 검색</button>
						</td>
					</tr>
				</tbody>
			</table><br />

			<table className="table table-hover">
				{/* <thead>
					<tr>
						<th className="col-1">번호</th>
						<th className="col-6">제목</th>
						
						<th className="col-2">거래 상태</th>
						<th className="col-2">작성자</th>
						<th className="col-1">조회수</th>
						<th className="col-1">⭐️</th>
						
					</tr>
				</thead> */}

				<div className="card-list">
					{
						  tradeBoardDtos.map((tradeBoardDto, idx) => (
							<div className="card" key={tradeBoardDto.id}>
							<div className="card-header">
							  <Link to={`/bbsdetail/${tradeBoardDto.id}`}>
								<h5 className="card-title">{tradeBoardDto.title}</h5>
							  </Link>
							</div>
							<div className="card-body">
							  <p className="card-status">거래상태: {tradeBoardDto.status}</p>
							  <p className="card-author">작성자 : {tradeBoardDto.createBy}</p>
							  <p className="card-author">가격 : {tradeBoardDto.price} 원</p>
							  <p className="card-views">조회수 : {tradeBoardDto.view}</p>
							  <p className="card-likes">⭐️ {tradeBoardDto.goodCount}</p>
							</div>
						  </div>
						))
						}
					
				</div>
			</table>

			<Pagination className="pagination"
				activePage={pageable}
				itemsCountPerPage={10}
				totalItemsCount={totalCnt}
				pageRangeDisplayed={5}
				prevPageText={"‹"}
				nextPageText={"›"}
				onChange={changePage} />
				
			<div className="my-5 d-flex justify-content-center">
				<Link className="btn btn-outline-secondary" to="/bbswrite"><i className="fas fa-pen"></i> &nbsp; 글쓰기</Link>
			</div>

		</div>
	);
}

/* 글 목록 테이블 행 컴포넌트 */
// function TableRow(props) {
// 	console.log(props.obj);
// 	const tradeBoardDto = props.obj;

// 	return (
// 			<tr>
// 					<th>{props.cnt}</th>
// 					{
// 						// 삭제되지 않은 게시글
// 						<>
// 							<td >

// 								<Link to={{ pathname: `/bbsdetail/${tradeBoardDto.id}` }}> { /* 게시글 상세 링크 */}
// 									<span className="underline bbs-title" >{tradeBoardDto.title} </span> { /* 게시글 제목 */}
// 								</Link>
// 							</td>
							
// 							<td>{tradeBoardDto.status}</td>
// 							<td>{tradeBoardDto.createBy}</td>
// 							<td>{tradeBoardDto.view}</td>
// 							<td>{tradeBoardDto.goodCount}</td>
// 						</>
					
// 					}
					
				
// 			</tr>
		
// 	);
// }

export default BbsList;