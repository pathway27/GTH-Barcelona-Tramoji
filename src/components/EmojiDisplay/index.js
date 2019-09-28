import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Badge from "@material-ui/core/Badge";
import emojiNameMap from "emoji-name-map";

import EmojiPicker from "emoji-picker-react";

export const StyledCard = styled(Card)`
  transition: 0.3s ease-in-out all;
  padding: 15px;
  padding-top: 0;
  margin-top: 10px;

  @media (max-width: 940px) {
    margin: 20px;
    margin-top: 90px;
  }
`;

export const Block = styled.div`
  transition: 0.3s ease-in-out all;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 13px;
  cursor: pointer;

  &:last-of-type {
    margin-right: 0;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
  }
`;

export const StyledEmojiContainer = styled.div`
  transition: 0.3s ease-in-out all;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  padding-bottom: 11px;
  font-size: 30px;
  background-color: ${props => (props.userVoted ? "#e5f5fa" : "#f6f6f6")};
  border-radius: 12px;

  ${props =>
    props.userVoted &&
    `box-shadow: rgb(29, 155, 209) 0px 0px 0px 1.5px inset;`};
`;

export const StyledLasto = styled(StyledEmojiContainer)`
  transition: 0.3s ease-in-out all;
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

export const StyledBadge = styled(Badge)`
  span {
    transition: 0.3s ease-in-out all;
    background-color: ${props => (props.userVoted ? "#1c9bd1" : "#a5a5a5")};
    color: white;
  }
`;

const EmojiContainer = ({ emoji, onAdd, onIncrease }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiCode, emojiData) => {
    const selectedEmoji = emojiNameMap.get(`:${emojiData.name}:`);

    onAdd(selectedEmoji);
    setShowPicker(false);
  };

  return emoji ? (
    <Block onClick={onIncrease}>
      <StyledBadge
        userVoted={emoji.userVoted}
        badgeContent={emoji.count}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom"
        }}
      >
        <StyledEmojiContainer userVoted={emoji.userVoted}>
          {emoji.emoji}
        </StyledEmojiContainer>
      </StyledBadge>
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const topEmojis = [
  { emoji: "😂", count: 28, userVoted: false },
  { emoji: "😍", count: 18, userVoted: false },
  { emoji: "❤️", count: 12, userVoted: false },
  { emoji: "😎", count: 9, userVoted: false },
  { emoji: "💩", count: 3, userVoted: false }
];

export const EmojiDisplay = ({ selectedPoi }) => {
  const [emojis, setEmojis] = useState(topEmojis);

  const handleAdd = emoji => {
    setEmojis(value => [...value, { emoji, count: 1, userVoted: true }]);
  };

  useEffect(() => {
    setEmojis(value => {
      const first = { ...value[0], emoji: selectedPoi.emojis };
      return [first, ...value.slice(1)];
    });
  }, [selectedPoi]);

  return (
    <StyledCard>
      <EmojisContainer>
        {emojis.map((emoji, index) => (
          <EmojiContainer
            emoji={emoji}
            onIncrease={() => {
              const isIncreaseDisabled = emojis[index].userVoted;

              setEmojis(current => {
                const updatedEmojis = current.map((v, i) =>
                  i === index
                    ? {
                        ...v,
                        count: isIncreaseDisabled ? v.count - 1 : v.count + 1,
                        userVoted: !isIncreaseDisabled
                      }
                    : v
                );

                return updatedEmojis.filter(emoji => emoji.count);
              });
            }}
          />
        ))}
        <EmojiContainer onAdd={handleAdd} />
      </EmojisContainer>
    </StyledCard>
  );
};
