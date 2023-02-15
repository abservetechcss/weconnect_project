
import gif1 from "../../../assets/images/Group 20109.svg";
import React, { useState } from "react";
import { IconButton } from "@mui/material";

import EmojiMartPickerComponent from "../../agent/common/EmojiMartPickerComponent.jsx";
import GifImagesPageComponent from "../../agent/common/GifImagesPageComponent.jsx";
import smile from "../../../assets/images/smile (2).svg";
function ToolbarCustomComponent(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <div className="gif-block">
        <IconButton
          aria-label="delete"
          role="button"
          onClick={() => {
            props._this.setState({
              isShowEmojiModal: props._this.isShowEmojiModal == true ? (false) : (true),
              isShowGifImgModal: false,
            });
          }}
        >
          {" "}
          <img src={smile} alt="" />
        </IconButton>
        {props._this.state.isShowEmojiModal ? (
          <EmojiMartPickerComponent
            isShowEmojiModal={props._this.state.isShowEmojiModal}
            messageText={props._this.state.messageText}
            textEditor={true}
            {...props}
          />
        ) : null}
        {props._this.state.isShowGifImgModal ? (
          <GifImagesPageComponent
            isShowGifImgModal={props._this.state.isShowGifImgModal}
            messageText={props._this.state.messageText}
            textEditor={true}
            {...props}
          />
        ) : null}
        <div className="gif_main">
          <IconButton
            aria-label="delete"
            role="button"
            onClick={() => {
              props._this.setState({
                isShowGifImgModal: !props._this.state.isShowGifImgModal,
                isShowEmojiModal: false,
              },()=>{
                props._this.props.refreshComponent();
              });
            }}         
          >
            {" "}
            <img src={gif1} alt="" />
          </IconButton>        
        </div>        
      </div>
    </>
  );
}

export default ToolbarCustomComponent;
