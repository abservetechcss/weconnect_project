import { INPUT, isBrowser } from "@botonic/core";
import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";

import { ROLES, WEBCHAT } from "../constants";
import { WebchatContext } from "../contexts";
import { Message } from "./message";

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 100px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: pointer;
`;

const StyledPopImage = styled.img`
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 99999;
  margin: auto;
  border-radius: 8px;
  max-width: 270px;
  transition: 1s;
  object-fit: contain;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 99998;
  background-color: #0000008c;
  backdrop-filter: blur(2px);
`;

const IconDiv = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  font-size: 30px;
  z-index: 99999;
  cursor: pointer;
`;

const serialize = (imageProps) => {
  return { image: imageProps.src };
};

export const Image = (props) => {
  let content = props.children;

  const [isPreviewerOpened, setIsPreviewerOpened] = useState(false);

  const openPreviewer = () => setIsPreviewerOpened(true);
  const closePreviewer = () => setIsPreviewerOpened(false);

  const { getThemeProperty } = useContext(WebchatContext);
  const imagePreviewer = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.imagePreviewer,
    null
  );
  if (isBrowser()) {
    content = (
      <>
        <StyledImage src={props.src} onClick={openPreviewer} alt="image" />
        {/* {imagePreviewer &&
          imagePreviewer({
            src: props.src,
            isPreviewerOpened,
            openPreviewer,
            closePreviewer,
          })} */}
        {isPreviewerOpened ? (
          <>
            <IconDiv onClick={closePreviewer}> &times; </IconDiv>
            <StyledPopImage
              className="styledimage"
              src={props.src}
              alt="image"
            />
            {imagePreviewer &&
              imagePreviewer({
                src: props.src,
                isPreviewerOpened,
                openPreviewer,
                closePreviewer,
              })}
            <Backdrop />
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
  return (
    <>
      <Message
        role={ROLES.IMAGE_MESSAGE}
        json={serialize(props)}
        {...props}
        style={{ background: "transparent" }}
        type={INPUT.IMAGE}
      >
        {content}
      </Message>
    </>
  );
};

Image.serialize = serialize;
