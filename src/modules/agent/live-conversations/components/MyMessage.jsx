import React, { useState, useContext } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";

import Image from "./messageComponents/Image";
import VideoPlayer from "./messageComponents/VideoPlayer";
import Location from "./messageComponents/Location";
import AudioPlayer from "./messageComponents/AudioPlayer";
import Document from "./messageComponents/Document";
import styled from "styled-components";

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
  color: #fff;
`;

const MyMessage = (props) => {
  const [isPreviewerOpened, setIsPreviewerOpened] = useState(false);
  const { lastMessage, message, nextMessage } = props;
  const isLastMessage = !nextMessage || nextMessage.from !== message.from;
  const isFirstMessage = !lastMessage || lastMessage.from !== message.from;

  const topRightRadius = isFirstMessage ? "18px" : "4px";
  const bottomRightRadius = isLastMessage ? "18px" : "4px";

  const borderRadius = `18px ${topRightRadius} ${bottomRightRadius} 18px`;
  const paddingBottom = isLastMessage ? "21px" : "9px";

  const openPreviewer = () => setIsPreviewerOpened(true);
  const closePreviewer = () => setIsPreviewerOpened(false);

  return (
    <>
      <div className="chat_my_msg" style={{ paddingBottom }}>
        <div className="chat_msg" style={{ borderRadius }}>
          {typeof message.chatbot_type === "undefined" ? (
            <div dangerouslySetInnerHTML={{ __html: message.text }} />
          ) : message.chatbot_type === "file_upload" ? (
            message.answer === "jpg" ||
            message.answer === "jpeg" ||
            message.answer === "png" ||
            message.answer === "gif" ? (
              <Image src={message.text} HandleClickImage={openPreviewer} />
            ) : message.answer === "webm" ||
              message.answer === "ogg" ||
              message.answer === "wav" ||
              message.answer === "mp3" ||
              message.answer === "mpeg" ? (
              <AudioPlayer audioUrl={message.text} />
            ) : message.answer === "mp4" || message.answer === "avi" ? (
              <VideoPlayer src={message.text} />
            ) : message.answer === "location" && message.text ? (
              <Location location={message.text} />
            ) : (
              <Document message={message} />
            )
          ) : (
            ""
          )}
          {/* <BiCheckDouble className={'double_tick'} /> */}
        </div>
      </div>
      {isPreviewerOpened ? (
        <>
          <IconDiv onClick={closePreviewer}> &times; </IconDiv>
          <StyledPopImage
            className="styledimage"
            src={message.text}
            alt="image"
          />
          <Backdrop />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default MyMessage;
