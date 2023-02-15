import GiphyPicker from "./GiphyPicker";
import React from "react";

import { useComponentVisible } from "../hooks";
import { Wrapper } from "./common";

const OpenedGiphyPicker = (props) => {
  const { ref, isComponentVisible } = useComponentVisible(true, props.onClick);
  return (
    <Wrapper ref={ref}>
      {isComponentVisible && <GiphyPicker {...props} />}
    </Wrapper>
  );
};

export default OpenedGiphyPicker;
