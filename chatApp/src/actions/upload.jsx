import { Text, CommonReply, CustomReply } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
// import "../assets/css/upload.css";
import UploadSvg from "../assets/upload.svg";
import "yet-another-abortcontroller-polyfill";
import { fetch } from "whatwg-fetch";
import { WEBCHAT } from "../constants";

const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 3px 10px 6px 10px;
  border: none;
  margin: 10px auto 4px auto;
  background: #f2f3f5;
  color: #1e1e1e;
  display: flex;
  font-family: inherit;
  justify-content: center;
`;

const UploadContainer = styled.div`
  text-align: left;
  background: #fff;
  white-space: normal;
  margin: 0 0 15px 50px;
  -webkit-box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  max-width: 210px;
  padding: 2%;
  border: 1px solid #00424f42;
  max-height: 200px;
  box-shadow: 0px 6px 42px #2425330f;
  border-radius: 10px;
`;

let ajaxRequest = null;
export default class Upload extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      reply: false,
      file: null,
      fileName: "Choose file",
      extension: "",
      active: false,
      uploading: false,
      error: false,
      exceeded: false
    };
    this.fontStyle = context.getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.fontStyle, {});
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onDropHandler = this.onDropHandler.bind(this);
    this.submitFile = this.submitFile.bind(this);
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    let bot = {};
    if (req.session && req.session.bot) {
      bot = req.session.bot;
    }
    return { component: item.component || {}, bot: bot };
  }

  submitFile(e) {
    e.preventDefault();
    // this.context.sendInput({
    //   type: "image",
    //   from: "user",
    //   // src: res.data.Image
    //   src: "https://weconnect.chat/wp-content/uploads/2021/12/MicrosoftTeams-image.png",
    // });
    // return;
    if (this.state.file && this.state.exceeded === false) {
      this.setState({
        active: "Please Wait...",
        uploading: true
      });
      this.context.updateChatSettings({
        loading: true
      });

      var formData = new FormData();
      formData.append("bot_id", this.props.bot.id);
      formData.append("question_id", this.props.component.question_id);
      formData.append("client_id", this.props.bot.client_id);
      formData.append("file", this.state.file);
      //bot_id, question_id, file_id


      const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
      abortableFetch(
        `${process.env.REACT_APP_ENV_API_URL}websocket/fileUpload`, {
        method: "post",
        body: formData
      }).then((response) => {
        return response.json()
      }).then(res => {
        this.context.updateChatSettings({
          loading: false
        });
        if (res.status === "True") {
          this.setState({
            active: false,
            file: null,
            reply: true,
          });
          let type = "document"
          if (this.state.extension === "jpg" || this.state.extension === "jpeg" || this.state.extension === "png") {
            type = "image";
          }
          this.context.updateLastMessage({
            reply: true
          });
          this.context.sendInput({
            type: type,
            from: "user",
            // src: res.data.Image
            src: res.file,
            item: {
              btn_text: this.state.extension
            }
          });

        } else {
          this.setState({
            active: false,
            reply: true,
            error: true,
            uploading: false,
          });
        }

      }).catch((err) => {
        this.context.updateChatSettings({
          loading: false
        });
        this.setState({
          active: false,
          uploading: false,
          error: true
        });

      });
    }

  }

  onChangeHandler(ev) {
    if (ev.target.files && ev.target.files.length > 0) {
      const filesizeInMb = ev.target.files[0].size / 1024 / 1024;
      let Notexceeded = true;
      if (filesizeInMb > 10) {
        Notexceeded = false;
      }
      this.setState({
        exceeded: !Notexceeded
      });
      if (Notexceeded)
        this.validateFile(ev.target.files[0]);
    }
  }

  validateFile(file) {
    const fileName = file.name.replace("C:\\fakepath\\", "");
    const extension = file.name.split(".").pop();
    const allowedExtension = [
      "jpg",
      "jpeg",
      "png",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "zip",
      "xlsx",
      "xls",
      "pdf",
    ];
    if (allowedExtension.includes(extension)) {
      this.setState({
        fileName,
        file: file,
        extension: extension
      });
    } else {
      alert("Only jpg, png, doc, docx, ppt, pptx, zip, xlsx, pdf is allowed");
    }
  }

  onDropHandler(ev) {
    ev.preventDefault();
    let files = [];
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          var file = ev.dataTransfer.items[i].getAsFile();
          files.push(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      files = ev.dataTransfer.files;
    }
    this.validateFile(files[0]);
  }

  render() {
    return (
      <>

        <style>
          {`
        .file-upload {
    display: block;
    text-align: center;
    font-family: inherit;
    font-size: 12px;
}
.file-upload .file-select {
    border: 1px solid #00424f;
    color: #111;
    cursor: pointer;
    height: 30px;
    line-height: 40px;
    width: 120px;
    text-align: left;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 7px;
    overflow: hidden;
    position: relative;
    border-radius: 22px;
}
.file-upload .file-select .file-select-name {
    line-height: 40px;
    display: inline-block;
    padding: 0 10px;
    color: #000;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: inherit;
    overflow: hidden;
    color: #00424f;
    width: 75%;
}
.file-upload .file-select .file-select-name img {
    width: 13px;
    margin: 0px 7px -1px 0;
}
.file-upload .file-select input[type=file] {
    z-index: 100;
    cursor: pointer;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    filter: alpha(opacity=0);
}
.file-upload small {
    text-align: left;
    color: #1e1e1e;
    opacity: .6;
    font-weight: 600;
    margin: 4px 0;
    font-family: inherit;
    display: block;
}
        `}
        </style>
        <Text>
          {this.props.component.question}
        </Text>

        {this.state.reply === false && this.props.reply !== true && (
          <UploadContainer>
            <form
              encType="multipart/form-data"
              method="post"
              onSubmit={this.submitFile}
            >
              <div className="file-upload">
                <div className="file-select">
                  {/* <div className="file-select-button">
                    <img src={upload}></img>
                  </div> */}
                  <div className="file-select-name ">
                    {" "}
                    <img src={UploadSvg} alt=""></img>
                    {this.state.fileName}
                  </div>
                  <input
                    type="file"
                    onChange={this.onChangeHandler}
                    onDrop={this.onDropHandler}
                    className="custom-file-browser"
                    required=""
                  />
                </div>

                <small>- Only jpg, png, doc, docx, ppt, pptx, xlsx, pdf</small>

                <small>- File must not exceed 10MB</small>
                {this.state.exceeded && <small style={{ color: "red" }}>{this.props.component.message_error}</small>}
                {this.state.error && <small style={{ color: "red" }}>{this.props.component.message_error_failed}</small>}
                {this.state.uploading && this.state.active && <small style={{ color: "red" }}>{this.state.active}</small>}
              </div>
              {/* <input name="session_id" type="hidden" value="D74ED383-4383-44AD-BE72-F15AA6F06667"><input name="bot_id" type="hidden" value="N1JLY2toL2pKWk9BZFg0eHpUYjVuQT09"><input name="question_id" type="hidden" value="40FA7BBB-A1FA-4B82-9A53-61C0D0D614DD"><br><span id="error96" style="color:red"></span> */}

              <StyledButton
                type="submit"
                className={
                  this.state.selectedTimeSlot === null ? "disabled" : ""
                }
                isdisabled={this.state.uploading}
                style={this.fontStyle}
              >
                Confirm
              </StyledButton>
            </form>
          </UploadContainer>
        )}
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </>
    );
  }
}
