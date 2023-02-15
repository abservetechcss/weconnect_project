import PropTypes from "prop-types";
import { EditorState, Modifier } from "draft-js";
import gif1 from "../../../assets/images/Group 20109.svg";
import deleteIcon from "../../../assets/images/trash-2.svg";
import more from "../../../assets/images/Group 20110.svg";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EmojiMartPickerComponent from "../../agent/common/EmojiMartPickerComponent.jsx";
import GifImagesPageComponent from "../../agent/common/GifImagesPageComponent.jsx";
import smile from "../../../assets/images/smile (2).svg";

const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

const SEARCH_DEBOUNCE = 500;
function ToolbarCustomComponent(props) {

  const [term, setTerm] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const customButtonAction = (type) => {
    if (props.handleCustomButtonAction) {
      props.handleCustomButtonAction(type);
    }
  };
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
              });
            }}
          // onClick={() => {
          //   props._this.setState({
          //     isShowGifImgModal: true
          //   });
          // }}
          >
            {" "}
            <img src={gif1} alt="" />
          </IconButton>
          <Button
            className="send_btn"
            variant="contained"
            onClick={() => customButtonAction(props.mode)}
          >
            Send
          </Button>
        </div>
        <div className="more-option">
          <IconButton
            aria-label="delete"
            onClick={() => customButtonAction("delete")}
          >
            {" "}
            <img src={more} alt="" />
          </IconButton>

          <IconButton
            aria-label="delete"
            onClick={() => customButtonAction("delete")}
          >
            <img src={deleteIcon} alt="" />
          </IconButton>
        </div>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button"
          }}
          className="email-reply-model-block"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem onClick={handleClose}>Save Draft</MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default ToolbarCustomComponent;
