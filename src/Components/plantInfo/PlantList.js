import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import styled, { keyframes } from "styled-components";
import "../../css/PlantList.css";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import api from "../api";

function PlantList() {
  const [plants, setPlants] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [pageable, setPageable] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCondition, setSearchCondition] = useState('');
  const [showCategoryButtons, setShowCategoryButtons] = useState(false);
  const [showManageButtons, setShowManageButtons] = useState(false);
  const { headers, setHeaders } = useContext(HttpHeadersContext);

  useEffect(() => {
    const savedSearchResults = JSON.parse(localStorage.getItem('searchResults'));
    const savedSearchCondition = localStorage.getItem('searchCondition');
    const savedSearchTerm = localStorage.getItem('searchTerm');
    if (savedSearchResults && savedSearchCondition && savedSearchTerm) {
      setSearchResults(savedSearchResults);
      setSearchCondition(savedSearchCondition);
      setSearchTerm(savedSearchTerm);
    } else {
      loadPlants();
    }
  }, [pageable]);

  const loadPlants = async () => {
    await api
    .get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/plantList?search=${searchVal}&page=${pageable-1}`, { headers: headers })
      .then((response) => {
        setPlants(response.data.content);
        setTotalCnt(response.data.totalElements);
        setSearchResults([]); // Clear search results when loading plants
        localStorage.removeItem('searchResults');
        localStorage.removeItem('searchCondition');
        localStorage.removeItem('searchTerm');
      })
      .catch((error) => {
        const resp = error.response.data;
        console.log(resp);
        if (resp.errorCodeName === "017") {
          alert(resp.message);
        }
      });
  };

  const fetchSearchResults = async () => {
    if (!searchCondition || !searchTerm) return;
    try {
      const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/plantList/condition?${searchCondition}=${searchTerm}`, 
        { headers: headers });
      setSearchResults(response.data);
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      localStorage.setItem('searchCondition', searchCondition);
      localStorage.setItem('searchTerm', searchTerm);
      console.log(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearchSubmit = () => {
    setPageable(1);
    loadPlants();
  };

  const handlePageChange = (pageNumber) => {
    setPageable(pageNumber);
  };

  const handleCategoryClick = () => {
    setShowCategoryButtons(!showCategoryButtons);
    setShowManageButtons(false);
  };

  const handleManageClick = () => {
    setShowManageButtons(!showManageButtons);
    setShowCategoryButtons(false);
  };

  const handleCategorySelect = (value) => {
    setSearchTerm(value);
    setSearchCondition('category');
  };

  const handleManageSelect = (value) => {
    setSearchTerm(value);
    setSearchCondition('manage');
  };

  const handleFetchSearchResults = () => {
    fetchSearchResults();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchCondition('');
    setSearchResults([]);
    loadPlants();
  };

  useEffect(() => {
    if (searchCondition && searchTerm) {
      fetchSearchResults();
    }
  }, [searchCondition, searchTerm]);

  return (
    <Container>
      <h2>식물 목록</h2>
      <ButtonWrapper>
      <ResetButton onClick={handleReset}><i class="fas fa-redo"></i></ResetButton>
        <MainButton onClick={handleCategoryClick}>식물 종류 별 검색</MainButton>
        <MainButton onClick={handleManageClick}>관리 난이도 검색</MainButton>
        
      </ButtonWrapper>
        
      {showCategoryButtons && (
        <SubButtonGroup>
          <SubButton onClick={() => handleCategorySelect("잎")}>잎</SubButton>
          <SubButton onClick={() => handleCategorySelect("꽃")}>꽃</SubButton>
          <SubButton onClick={() => handleCategorySelect("열매")}>열매</SubButton>
          <SubButton onClick={() => handleCategorySelect("선인장")}>선인장</SubButton>
        </SubButtonGroup>
      )}
      {showManageButtons && (
        <SubButtonGroup>
          <SubButton onClick={() => handleManageSelect("경험자")}>경험자</SubButton>
          <SubButton onClick={() => handleManageSelect("초보자")}>초보자</SubButton>
          <SubButton onClick={() => handleManageSelect("전문가")}>전문가</SubButton>
        </SubButtonGroup>
      )}
      <SearchWrapper>
        <SearchInput
          className="search__input"
          id="search__input"
          type="text"
          placeholder="식물 이름을 검색해 주세요"
          value={searchVal}
          onChange={handleSearchChange}
        />
        <SearchButton onClick={handleSearchSubmit}>검색</SearchButton>
      </SearchWrapper>

      <PlantGrid>
        {searchResults.length > 0 ? (
          searchResults.map((plant) => (
            <FadeInDiv key={plant.id}>
              <PlantCard>
                <Link to={{ pathname: `/plantdetail/${plant.id}` }}>
                  <PlantImage src={plant.thumbFile} alt="식물 이미지" />
                </Link>
              </PlantCard>
              <PlantName>{plant.plantName}</PlantName>
            </FadeInDiv>
          ))
        ) : (
          plants.map((plant) => (
            <div key={plant.id}>
              <PlantCard>
                <Link to={{ pathname: `/plantdetail/${plant.id}` }}>
                  <PlantImage src={plant.thumbFile} alt="식물 이미지" />
                </Link>
              </PlantCard>
              <PlantName>{plant.plantName}</PlantName>
            </div>
          ))
        )}
      </PlantGrid>
      <PaginationWrapper>
        <Pagination
          activePage={pageable}
          itemsCountPerPage={9}
          totalItemsCount={totalCnt}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </PaginationWrapper>
    </Container>
  );
}

export default PlantList;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const SearchWrapper = styled.div`
  margin: 20px 0;
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonWrapper = styled.div`
  margin: 20px 0;
`;

const MainButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const SubButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const SubButton = styled.button`
  padding: 10px 15px;
  font-size: 14px;
  margin: 0 5px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e0a800;
  }
`;

const FadeInDiv = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;

const PlantCard = styled.div`
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
`;

const PlantImage = styled.img`
  width: 60%;
  height: auto;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PlantName = styled.h2`
  margin: 10px 0;
  font-size: 18px;
  color: black;
`;

const PaginationWrapper = styled.div`
  margin-top: 20px;
`;
