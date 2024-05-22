import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { HttpHeadersContext } from "../../context/HttpHeadersProvider";
import api from "../api";

function PlantDetail() {
  const [plantDto, setPlantDto] = useState({});
  const { id } = useParams();
  const { headers, setHeaders } = useContext(HttpHeadersContext);

  useEffect(() => {
    async function fetchPlantDetail() {
      try {
        const response = await api.get(`${process.env.REACT_APP_SERVER_URL}/plant-service/api/plantList/${id}`, { headers: headers });
        setPlantDto(response.data);
      } catch (error) {
        console.error("[PlantDetail.js] fetchPlantDetail() error:", error);
      }
    }

    fetchPlantDetail();
  }, [id]);

  const renderField = (label, value) => {
    return (
      value && (
        <PlantInfoItem key={label}>
          <Title>{label}</Title>
          <Value>{value}</Value>
        </PlantInfoItem>
      )
    );
  };

  return (
    <Wrapper>
      <Container>
        <PlantImage src={plantDto.image} alt="식물 이미지" />
        <PlantInfo>
          <PlantName>{plantDto.plantName}</PlantName>
          <TagsContainer>
            <PlantTags>{plantDto.manage}</PlantTags>
            <PlantTags>{plantDto.category}</PlantTags>
          </TagsContainer>
          <PlantSpecial>{plantDto.special}</PlantSpecial>
          <InfoTable>
            <PlantInfoContainer>
              <CrossLayout>
                {renderField("팁", plantDto.plantInfo)}
                {renderField("높이", plantDto.height && `${plantDto.height}cm`)}
                {renderField("번식시기", plantDto.breed)}
                {renderField("기르는 난이도", plantDto.manage)}
                {renderField("생장속도", plantDto.growthRate)}
                {renderField("잘 자라는 온도", plantDto.growthTmp)}
                {renderField("비료", plantDto.fertilizer)}
                {renderField("습도", plantDto.humidity)}
                {renderField("광", plantDto.light)}
                {renderField("발화계절", plantDto.season)}
              </CrossLayout>
            </PlantInfoContainer>
          </InfoTable>
        </PlantInfo>
      </Container>
      <AdditionalInfoContainer>
        <SectionTitle>계절별 물주는 방법</SectionTitle>
        <SubTitle>자세히 알아보기</SubTitle>
        <SeasonalWateringInfo>
          <SeasonInfo>
            <SeasonName>봄</SeasonName>
            <SeasonDescription>{plantDto.plantSpring}</SeasonDescription>
          </SeasonInfo>
          <SeasonInfo>
            <SeasonName>여름</SeasonName>
            <SeasonDescription>{plantDto.plantSummer}</SeasonDescription>
          </SeasonInfo>
          <SeasonInfo>
            <SeasonName>가을</SeasonName>
            <SeasonDescription>{plantDto.plantAutumn}</SeasonDescription>
          </SeasonInfo>
          <SeasonInfo>
            <SeasonName>겨울</SeasonName>
            <SeasonDescription>{plantDto.plantWinter}</SeasonDescription>
          </SeasonInfo>
        </SeasonalWateringInfo>
      </AdditionalInfoContainer>
    </Wrapper>
  );
}

export default PlantDetail;

const Wrapper = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const PlantImage = styled.img`
  max-width: 40%;
  height: auto;
  margin-right: 30px;
  border-radius: 10px;
  object-fit: cover;
`;

const PlantInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PlantName = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const TagsContainer = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
`;

const PlantTags = styled.li`
  background: #e0e0e0;
  color: #333;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
`;

const PlantSpecial = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #555;
`;

const InfoTable = styled.div`
  width: 100%;
`;

const PlantInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;

const CrossLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const PlantInfoItem = styled.div`
  flex-basis: calc(50% - 20px);
  padding: 15px;
  display: flex;
  flex-direction: column;
  background: #f4f4f4;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Value = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const AdditionalInfoContainer = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
`;

const SubTitle = styled.h4`
  font-size: 1.2rem;
  color: #04B486;
  text-align: center;
  margin-bottom: 20px;
`;

const SeasonalWateringInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const SeasonInfo = styled.div`
  flex-basis: calc(50% - 20px);
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
`;

const SeasonName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const SeasonDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
`;
