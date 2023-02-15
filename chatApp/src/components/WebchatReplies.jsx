import React, { useContext } from "react";
import styled from "styled-components";

import { WEBCHAT } from "../constants";
import { WebchatContext } from "../contexts";
import { StyledScrollbar } from "../webchat/components/styled-scrollbar";

const RepliesContainer = styled.div`
  text-align: center;
  justify-content: ${(props) => props.justify};
  padding-bottom: 10px;
  max-width: 98%;
`;

const ReplyContainer = styled.div`
  flex: none;
  display: inline-block;
  width: 100%;
`;

const options = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

export const WebchatReplies = (props) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext);

  // for delayed input, to avoid rerendering we provide this code
  if (props.nextMsg && props.nextMsg.display === false) return null;

  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.scrollbar),
  };

  let justifyContent = "center";
  const flexWrap = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.wrapReplies,
    "wrap"
  );
  if (flexWrap === "nowrap") justifyContent = "flex-start";
  else if (getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies))
    justifyContent =
      options[getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies)];

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      autoHide={scrollbarOptions.autoHide}
    >
      <RepliesContainer
        justify={justifyContent}
        wrap={flexWrap}
        style={{
          ...props.style,
        }}
      >
        {webchatState.replies.map((r, i) => (
          <ReplyContainer key={i}>{r}</ReplyContainer>
        ))}
      </RepliesContainer>
    </StyledScrollbar>
  );
};
