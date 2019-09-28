import React from "react";
import styled from "styled-components";
import Map from "../../components/Map";

export const Container = styled.div`
  background: white;
`;

export const MainPage = () => {
  return (
    <>
      <Map />
      <Container>
        <h1>Tramoji :)</h1>
        <div>Main Page</div>
        <div>{process.env.REACT_APP_GOOGLE_MAP_API_KEY}</div>
      </Container>
    </>
  );
};
