import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Map from "../../components/Map";

export const Container = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const CenteredTypography = styled(Typography)`
  text-align: center;
`;

export const MainPage = () => {
  return (
    <>
      <Map />
      <Container>
        <Typography variant="h1">Tramoji</Typography>
        <CenteredTypography variant="h4">
          Discover local destinations,
          <br /> with the power of user curated emoji reviews
        </CenteredTypography>
      </Container>
    </>
  );
};
