import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { uniqWith } from "lodash";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import Map from "../../components/Map";
import aggregateData from "../../data/aggregate_data";
import granularData from "../../data/granular_data";
import { EmojiDisplay } from "../../components/EmojiDisplay";
import Tooltip from "@material-ui/core/Tooltip";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledCard = styled(Card)``;

export const StyledAvatar = styled(Avatar)`
  && {
    cursor: pointer;
    background-color: #5553b7 !important;
    position: absolute;
    right: 38px;
  }
`;

export const StyledIcon = styled(Icon)`
  color: #5553b7;
  margin-left: 10px;
  cursor: pointer;
`;

export const StyledTypography = styled(Typography)``;

export const StyledCity = styled(Card)`
  padding: 18px;
  position: absolute;
  top: 80px;
  left: 10px;
  display: flex;
  align-items: center;
`;

export const CenteredTypography = styled(StyledTypography)`
  text-align: center;
`;

export const Subtitle = styled(CenteredTypography)`
  transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) all;
  text-align: center;
  opacity: 0;
  transform: translateY(+30px);

  @media (max-width: 940px) {
    display: none;
  }

  ${props => props.subtitleVisible && `opacity: 1; transform: translateY(0px);`}
`;

export const CityName = styled(CenteredTypography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

function openChatbot(eventName) {
  if (
    !(
      eventName === "Barcelona" ||
      eventName === "Razzmatazz" ||
      eventName === "Gracia"
    )
  ) {
    eventName = "WELCOME";
  }

  var conversationDetail = {
    skipBotEvent: '["WELCOME_EVENT"]'
  };
  window.Kommunicate.startConversation(conversationDetail, function(response) {
    console.log(response);
    window.KommunicateGlobal.Applozic.ALApiService.sendMessage({
      data: {
        message: {
          type: 5,
          contentType: 10,
          message: "Event: " + eventName,
          groupId: response,
          metadata: { category: "HIDDEN", KM_TRIGGER_EVENT: eventName },
          source: 1
        }
      },
      success: function(response2) {
        console.log(response2);
      },
      error: function() {}
    });
  });
}

export const MainPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedPoi, setSelectedPoi] = useState(null);

  const handleClick = useCallback(poi => {
    setSelectedPoi(poi);
  }, []);

  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setSubtitleVisible(true), 1000);

    setTimeout(
      () =>
        enqueueSnackbar(
          "🔥 Extra points for the next 2 hours in locations near you!",
          {
            action: () => (
              <Button color="secondary" size="small">
                Click here!
              </Button>
            )
          }
        ),
      1000 * 4
    );

    setTimeout(
      () =>
        enqueueSnackbar(
          "😲 You are 5 points away from your next achievement!",
          {
            action: () => (
              <Button color="secondary" size="small">
                Tell me more
              </Button>
            )
          }
        ),
      1000 * 12
    );
  }, []);

  const [zoomLevel, setZoomLevel] = useState(null);

  const onZoomChanged = useCallback(level => setZoomLevel(level), []);

  const newData = useMemo(() => {
    const zoomedIn = zoomLevel >= 13;
    const dataSource = zoomedIn ? granularData : aggregateData;

    const filterNumber = zoomedIn ? 200 : 400;

    const filteredData = dataSource.slice(0, filterNumber);
    return filteredData;
  }, [zoomLevel]);

  return (
    <>
      <Map
        emojis={newData}
        onClick={handleClick}
        onZoomChanged={onZoomChanged}
        selectedPoi={selectedPoi}
        onNothingClick={() => setSelectedPoi(null)}
      />
      <Container>
        <Header>
          <CenteredTypography variant="h4" style={{ marginRight: "15px" }}>
            Tramoji™️
          </CenteredTypography>
          <Subtitle variant="h6" subtitleVisible={subtitleVisible}>
            Connect with emojions.
          </Subtitle>
          <Tooltip title="User Profile" placement="bottom">
            <StyledAvatar>TM</StyledAvatar>
          </Tooltip>
        </Header>
        {selectedPoi && (
          <StyledCity>
            <CityName variant="h6">{selectedPoi.city}</CityName>
            <Tooltip title="More information" placement="bottom">
              <StyledIcon
                onClick={() => {
                  openChatbot(selectedPoi.city);
                }}
              >
                info
              </StyledIcon>
            </Tooltip>
          </StyledCity>
        )}
        {selectedPoi && <EmojiDisplay selectedPoi={selectedPoi} />}
      </Container>
    </>
  );
};
