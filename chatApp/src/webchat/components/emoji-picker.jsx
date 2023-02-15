import React from "react";
import Picker from "../../EmojiPicker";

import { useComponentVisible } from "../hooks";
import { Wrapper } from "./common";

const OpenedEmojiPicker = (props) => {
  const { ref, isComponentVisible } = useComponentVisible(true, props.onClick);
  return (
    <Wrapper ref={ref}>
      {isComponentVisible && (
        <Picker onEmojiClick={props.onEmojiClick} disableAutoFocus={true} />
      )}
    </Wrapper>
  );
};

export default OpenedEmojiPicker;
