import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Map from "../../components/Map";
import data from "../../data/barcelona-restaurant-partial";

export const Container = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledCard = styled(Card)`
  padding: 15px;
`;

export const StyledTypography = styled(Typography)``;

export const CenteredTypography = styled(StyledTypography)`
  text-align: center;
`;

export const MainPage = () => {
  console.log("data", data);

  const newData = [data[0]];

  console.log("newData", newData);

  return (
    <>
      <Map />
      <Container>
        <StyledCard>
          <CenteredTypography variant="h1" gutterBottom>
            Tramoji
          </CenteredTypography>
          <CenteredTypography variant="h4">
            Connect with emojions.
          </CenteredTypography>
        </StyledCard>
      </Container>
    </>
  );
};
