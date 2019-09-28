import React, { useState } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import EmojiPicker from "emoji-picker-react";
import JSEMOJI from "emoji-js";

const jsemoji = new JSEMOJI();

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

export const StyledModal = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`;

const EmojiContainer = ({ emoji, onAdd, onIncrease }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiCode, emojiData) => {
    const selectedEmoji = jsemoji.replace_colons(`:${emojiData.name}:`);

    onAdd(selectedEmoji);
    setShowPicker(false);
  };

  return emoji ? (
    <Block onClick={onIncrease}>
      <StyledEmojiContainer>{emoji.emoji}</StyledEmojiContainer>
      <StyledTypography variant="subtitle1">{emoji.count}</StyledTypography>
    </Block>
  ) : (
    <Block>
      <StyledLasto onClick={() => setShowPicker(v => !v)}>+</StyledLasto>
      {showPicker && (
        <Modal open={showPicker} onClose={() => setShowPicker(v => !v)}>
          <StyledModal>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </StyledModal>
        </Modal>
      )}
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
  const [emojis, setEmojis] = useState(topEmojis);

  const handleAdd = emoji => {
    setEmojis(value => [...value, { emoji, count: 1 }]);
  };

  return (
    <StyledCard>
      <EmojisContainer>
        {emojis.map((emoji, index) => (
          <EmojiContainer
            emoji={emoji}
            onIncrease={() => {
              setEmojis(current =>
                current.map((v, i) =>
                  i === index ? { ...v, count: v.count + 1 } : v
                )
              );
            }}
          />
        ))}
        <EmojiContainer onAdd={handleAdd} />
      </EmojisContainer>
    </StyledCard>
  );
};
