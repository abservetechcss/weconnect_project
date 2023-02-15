import React, { Component, Fragment } from "react";
import uploadImg from "../../../assets/images/image.svg";
import star from "../../../assets/images/star (2).svg";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import createImagePlugin from "@draft-js-plugins/image";
import ToolbarCustomComponent from "./ToolbarCustomComponent.jsx";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { uploadImageCallBack } from "./server/OfflineMessageServer";
const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

export default class EditorComponent extends Component {
  constructor(props) {
    super(props);
    const editorState = EditorState.createEmpty();
    let messageText = "";
    if(props.mode==="forward")
    messageText = props.message;

    this.state = {
      reply: false,
      editorState,
      anchorEl: null,
      showModal: false,
      star: false,
      isShowEmojiModal: false,
      messageText: messageText,
      isShowGifImgModal: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.message !== prevState.messageText) {
      return {
        messageText: nextProps.message
      }
    }
    return null
  }

  uploadImageCallBack = (file) => {
    return uploadImageCallBack(file);
  };
  render() {
    let _this = this;
    return (
      <Editor
        stripPastedStyles={true}
        plugins={plugins}
        wrapperClassName="c-react-draft"
        editorClassName="demo-editor"
        toolbar={{
          options: ["inline", "list", "textAlign", "image"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
          textAlign: {
            options: ["left", "center", "right", "justify"],
          },
          list: {
            options: ["unordered"],
          },

          image: {
            icon: uploadImg,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: false,
            uploadEnabled: true,
            alignmentEnabled: false,
            uploadCallback: this.uploadImageCallBack,
            previewImage: true,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: "100px",
              width: "100px",
            },
          },
          remove: {
            icon: star,
            className: undefined,
            component: undefined,
          },
        }}
        toolbarCustomButtons={[
          <ToolbarCustomComponent
          {..._this.props}
            handleCustomButtonAction={(action, data)=>{
              if(action==="delete") {
                _this.setState({
                  messageText: ""
                })
              } else {
                _this.props.handleCustomButtonAction(action, data, _this.state.messageText)
              }
            }}
            imagePlugin={imagePlugin}
            _this={_this}
          />,
        ]}
        editorState={_this.state.messageText}
        onEditorStateChange={(value) => {
          _this.setState({
            messageText: value,
            isShowEmojiModal: false,
            isShowGifImgModal: false,
          });
        }}
        spellCheck={true}
      />
    );
  }
}
