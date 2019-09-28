import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { uniqWith } from "lodash";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Map from "../../components/Map";
import data from "../../data/we_da_best_data";
import { EmojiDisplay } from "../../components/EmojiDisplay";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledCard = styled(Card)``;

export const StyledAvatar = styled(Avatar)`
  && {
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
  transition: 0.3s ease-in-out all;
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
  const newData = uniqWith(data.slice(0, 1000), (a, b) => a.city === b.city);

  console.log("newData", newData);

  const [selectedPoi, setSelectedPoi] = useState(null);

  const handleClick = useCallback(poi => {
    console.log("handleClick", poi);
    setSelectedPoi(poi);
  }, []);

  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setSubtitleVisible(true), 1000);
  }, []);

  return (
    <>
      <Map
        emojis={newData}
        onClick={handleClick}
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
          <StyledAvatar>TM</StyledAvatar>
        </Header>
        {selectedPoi && (
          <StyledCity>
            <CityName variant="h6">{selectedPoi.city}</CityName>
            <StyledIcon
              onClick={() => {
                openChatbot(selectedPoi.city);
              }}
            >
              info
            </StyledIcon>
          </StyledCity>
        )}
        {selectedPoi && <EmojiDisplay />}
      </Container>
    </>
  );
};
