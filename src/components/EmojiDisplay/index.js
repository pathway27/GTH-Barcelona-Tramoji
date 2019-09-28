import React, { useState } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

export const StyledCard = styled(Card)`
  padding: 15px;
`;

export const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 20px;
  cursor: pointer;

  &:last-of-type {
    margin-right: 0;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
  }
`;

export const StyledEmojiContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  padding-bottom: 11px;
  border: 1px dashed black;
  font-size: 30px;
`;

export const StyledLasto = styled(StyledEmojiContainer)`
  padding: 6px 22px 11px 22px;
  height: 62px;
  box-sizing: border-box;
`;

export const StyledTypography = styled(Typography)`
  text-align: center;
  margin-top: 9px !important;
  line-height: inherit !important;
`;

const EmojiContainer = ({ emoji }) => {
  const [showPicker, setShowPicker] = useState(false);

  return emoji ? (
    <Block>
      <StyledEmojiContainer>{emoji.emoji}</StyledEmojiContainer>
      <StyledTypography variant="subtitle1">{emoji.count}</StyledTypography>
    </Block>
  ) : (
    <Block>
      <StyledLasto onClick={() => setShowPicker(v => !v)}>+</StyledLasto>
      {showPicker && "SIKE"}
    </Block>
  );
};

export const EmojisContainer = styled.div`
  display: flex;
`;

const topEmojis = [
  { emoji: "😂", count: 28 },
  { emoji: "😍", count: 18 },
  { emoji: "❤️", count: 12 },
  { emoji: "😎", count: 9 },
  { emoji: "💩", count: 3 }
];

export const EmojiDisplay = () => {
  return (
    <StyledCard>
      <EmojisContainer>
        {topEmojis.map(emoji => (
          <EmojiContainer emoji={emoji} />
        ))}
        <EmojiContainer />
      </EmojisContainer>
    </StyledCard>
  );
};
