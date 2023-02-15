import React, { Component } from "react";

import bold from "../../../../../../../assets/images/bold.svg";
import italic from "../../../../../../../assets/images/italic.svg";
import underline from "../../../../../../../assets/images/underline.svg";
import align_center from "../../../../../../../assets/images/align-center.svg";
import align_justify from "../../../../../../../assets/images/align-justify.svg";
import align_left from "../../../../../../../assets/images/align-left.svg";
import align_right from "../../../../../../../assets/images/align-right.svg";
import list from "../../../../../../../assets/images/list (1).svg";
import uploadImg from "../../../../../../../assets/images/image.svg";
import star from "../../../../../../../assets/images/star (2).svg";

import { EditorState, convertToRaw, ContentState } from "draft-js";
// import { composeDecorators } from '@draft-js-plugins/editor';
import { Editor } from "react-draft-wysiwyg";
import createImagePlugin from "@draft-js-plugins/image";
// import createAlignmentPlugin from '@draft-js-plugins/alignment';
// import createFocusPlugin from '@draft-js-plugins/focus';
// import createResizeablePlugin from '@draft-js-plugins/resizeable';
// import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "@draft-js-plugins/image/lib/plugin.css";
// import '@draft-js-plugins/alignment/lib/plugin.css';
// import '@draft-js-plugins/focus/lib/plugin.css';

import ToolbarCustomComponent from "../../../../../common/ToolbarCustomComponent.jsx";
import {
  uploadImageCallBack,
  handlePastedFiles,
} from "../../BuilderConversaionServer";

// const focusPlugin = createFocusPlugin();
// const resizeablePlugin = createResizeablePlugin();
// const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;

//   const decorator = composeDecorators(
//   resizeablePlugin.decorator,
//   alignmentPlugin.decorator,
//   focusPlugin.decorator,
// );
const imagePlugin = createImagePlugin();

// const plugins = [imagePlugin, focusPlugin, alignmentPlugin, resizeablePlugin];
const plugins = [imagePlugin];
// const decor = [resizeablePlugin.decorator, alignmentPlugin.decorator, focusPlugin.decorator,];

const decor = [];

export default class CustomImageEditor extends Component {
  constructor(props) {
    super(props);

    const contentBlock = htmlToDraft(this.props.html);
    let messageText = "";
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      messageText = editorState;
    }

    // const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    //     handleUpload: this.uploadImageCallBack,
    //     addImage: imagePlugin.addImage,
    //   });
    //   plugins.push(dragNDropFileUploadPlugin);

    this.state = {
      messageText: messageText,
      isShowEmojiModal: false,
      isShowGifImgModal: false,
    };
  }

  getHtml = () => {
    return draftToHtml(
      convertToRaw(this.state.messageText.getCurrentContent())
    );
  };

  setHtml = (html, callback) => {
    const contentBlock = htmlToDraft("<span>" + html + "</span>");
    let updateState = {};
    try {
      let messageText = "";
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        messageText = editorState;
      }
      updateState.messageText = messageText;
      this.setState(updateState, callback);
    } catch (err) {}
  };

  uploadImageCallBack = (file) => {
    return uploadImageCallBack(file, this.props.botId, this.props.questionId);
  };

  changeEditorState = (state) => {
    this.setState({
      messageText: state,
    });
  };

  handlePastedFiles = (files) => {
    const file = files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/gif")
    ) {
      return handlePastedFiles(
        file,
        this.props.botId,
        this.props.questionId,
        this.state.messageText,
        this.changeEditorState
      );
    }
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <Editor
          stripPastedStyles={true}
          plugins={plugins}
          customDecorators={decor}
          wrapperClassName="c-react-draft"
          editorClassName="demo-editor"
          handlePastedFiles={this.handlePastedFiles}
          toolbar={{
            options: ["inline", "list", "textAlign", "image"],
            // inline: {
            // options: ["bold", "italic", "underline"]
            // },

            inline: {
              options: ["bold", "italic", "underline"],
              bold: {
                icon: bold,
                className: "demo-option-custom",
              },
              italic: {
                icon: italic,
                className: "demo-option-custom",
              },
              underline: {
                icon: underline,
                className: "demo-option-custom",
              },
            },

            textAlign: {
              options: ["left", "center", "right", "justify"],
              left: {
                icon: align_left,
                className: "demo-option-custom",
              },
              center: {
                icon: align_center,
                className: "demo-option-custom",
              },
              right: {
                icon: align_right,
                className: "demo-option-custom",
              },
              justify: {
                icon: align_justify,
                className: "demo-option-custom",
              },
            },
            list: {
              options: ["unordered"],
              unordered: {
                icon: list,
                className: "demo-option-custom",
              },
            },

            image: {
              icon: uploadImg,
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              urlEnabled: true,
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
              customButtonAction={this.customButtonAction}
              imagePlugin={imagePlugin}
              {...this.props}
              _this={this}
            />,
          ]}
          editorState={this.state.messageText}
          onEditorStateChange={(value) => {
            this.setState(
              {
                messageText: value,
                isShowEmojiModal: false,
                isShowGifImgModal: false,
              },
              () => {
                this.props.refreshComponent();
              }
            );
          }}
          spellCheck={true}
        />
        {/* <AlignmentTool /> */}
      </div>
    );
  }
}
