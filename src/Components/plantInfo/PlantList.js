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
      <Title>식물 목록</Title>
      <ButtonWrapper>
        <ResetButton onClick={handleReset}><i className="fas fa-redo"></i></ResetButton>
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
            <FadeInDiv key={plant.id}>
              <PlantCard>
                <Link to={{ pathname: `/plantdetail/${plant.id}` }}>
                  <PlantImage src={plant.thumbFile} alt="식물 이미지" />
                </Link>
              </PlantCard>
              <PlantName>{plant.plantName}</PlantName>
            </FadeInDiv>
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
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchInput = styled.input`
  width: 70%;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
  @media (max-width: 768px) {
    width: 90%;
    border-radius: 4px;
    margin-bottom: 10px;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: 2px solid #007bff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
  @media (max-width: 768px) {
    width: 90%;
    border-radius: 4px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MainButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
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
  font-size: 1rem;
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
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SubButton = styled.button`
  padding: 10px 15px;
  font-size: 0.9rem;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
  margin-top: 20px;
`;

const PlantCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PlantImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
`;

const PlantName = styled.h2`
  margin: 10px 0;
  font-size: 1.2rem;
  color: #333;
`;

const PaginationWrapper = styled.div`
  margin-top: 20px;
`;
