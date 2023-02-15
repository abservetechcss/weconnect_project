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

import { Editor } from "@tinymce/tinymce-react";

import {
  uploadImageCallBack,
  handlePastedFiles,
} from "../../BuilderConversaionServer";
import { AlertContext } from "../../../../../../common/Alert";
import { unstable_extendSxProp } from "@mui/system";

export default class CustomImageEditor extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    // const contentBlock = htmlToDraft(this.props.html);
    // let messageText = "";
    // if (contentBlock) {
    //   const contentState = ContentState.createFromBlockArray(
    //     contentBlock.contentBlocks
    //   );
    //   const editorState = EditorState.createWithContent(contentState);
    //   messageText = editorState;
    // }

    // const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    //     handleUpload: this.uploadImageCallBack,
    //     addImage: imagePlugin.addImage,
    //   });
    //   plugins.push(dragNDropFileUploadPlugin);

    // this.state = {
    //   messageText: messageText,
    //   isShowEmojiModal: false,
    //   isShowGifImgModal: false,
    // };
  }

  // getHtml = () => {
  //   return draftToHtml(
  //     convertToRaw(this.state.messageText.getCurrentContent())
  //   );
  // };

  // setHtml = (html, callback) => {
  //   const contentBlock = htmlToDraft("<span>" + html + "</span>");
  //   let updateState = {};
  //   try {
  //     let messageText = "";
  //     if (contentBlock) {
  //       const contentState = ContentState.createFromBlockArray(
  //         contentBlock.contentBlocks
  //       );
  //       const editorState = EditorState.createWithContent(contentState);
  //       messageText = editorState;
  //     }
  //     updateState.messageText = messageText;
  //     this.setState(updateState, callback);
  //   } catch (err) {}
  // };

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
    let _this = this;
    return (
      <div>
        <Editor
          apiKey="your-api-key"
          initialValue={_this.props.defaultHtml}
          init={{
            height: 300,
            menubar: false,
            branding: false,
            plugins: [
              "preview",
              "importcss",
              "searchreplace",
              "autolink",
              "autosave",
              "save",
              "directionality",
              "code",
              "visualblocks",
              "visualchars",
              "fullscreen",
              "image",
              "link",
              "media",
              "template",
              "codesample",
              "table",
              "charmap",
              "pagebreak",
              "nonbreaking",
              "anchor",
              "insertdatetime",
              "advlist",
              "lists",
              "wordcount",
              "help",
              "charmap",
              "quickbars",
              "emoticons",
            ],
            toolbar:
              "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
            menubar: "file edit view insert format tools table help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            file_picker_callback: (callback, value, meta) => {
              console.log(meta);
              if (meta.filetype == "image" || meta.filetype == "media") {
                var input = document.getElementById("my-file");
                input.click();
                input.onchange = async function () {
                  var file = input.files[0];
                  _this.context.showLoading();
                  let a = await _this.props.uploadImageCallBackfn(
                    file,
                    meta.filetype == "media" ? "video" : meta.filetype
                  );
                  _this.context.showLoading(false);
                  console.log("name", a);
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    callback(a.data.link, {
                      alt: file.name,
                    });
                  };
                  reader.readAsDataURL(file);
                };
                // alert();
              }
            },
            video_template_callback: function (data) {
              return (
                '<video width="' +
                data.width +
                '" height="' +
                data.height +
                '"' +
                (data.poster ? ' poster="' + data.poster + '"' : "") +
                ' controls="controls" autoplay="autoplay" loop="loop">\n' +
                '<source src="' +
                data.source +
                '"' +
                (data.sourcemime ? ' type="' + data.sourcemime + '"' : "") +
                " />\n" +
                (data.altsource
                  ? '<source src="' +
                    data.altsource +
                    '"' +
                    (data.altsourcemime
                      ? ' type="' + data.altsourcemime + '"'
                      : "") +
                    " />\n"
                  : "") +
                "</video>"
              );
            },
          }}
          onEditorChange={(newValue, editor) => {
            this.props.handleEditorChange(newValue);
          }}
        />
        <input type="file" hidden id="my-file" />
        {/* <AlignmentTool /> */}
      </div>
    );
  }
}
