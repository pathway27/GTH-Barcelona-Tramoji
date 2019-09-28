import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { uniqWith } from "lodash";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Map from "../../components/Map";
import data from "../../data/we_da_best_data";

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
  const newData = uniqWith(data.slice(0, 1000), (a, b) => a.city === b.city);

  console.log("newData", newData);

  const [selectedPoi, setSelectedPoi] = useState(null);

  const handleClick = useCallback(poi => {
    console.log("handleClick", poi);
    setSelectedPoi(poi);
  }, []);

  return (
    <>
      <Map emojis={newData} onClick={handleClick} selectedPoi={selectedPoi} />
      <Container>
        <StyledCard>
          <CenteredTypography variant="h4" gutterBottom>
            Tramoji
          </CenteredTypography>
          <CenteredTypography variant="h6">
            Connect with emojions.
          </CenteredTypography>
          {selectedPoi && (
            <CenteredTypography variant="h6">
              {selectedPoi.city}.
            </CenteredTypography>
          )}
        </StyledCard>
      </Container>
    </>
  );
};
