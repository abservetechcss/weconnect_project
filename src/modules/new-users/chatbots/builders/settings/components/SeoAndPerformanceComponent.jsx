import React, { Component, Fragment } from "react";
import { Button } from "@mui/material";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import reactImageSize from "react-image-size";

import image from "../../../../../../assets/images/image.svg";

import {
  EditorState,
  Modifier,
  convertFromHTML,
  convertToRaw,
  ContentState,
} from "draft-js";
import { FloatingLabel, Form } from "react-bootstrap";

import ToolbarCustomComponent from "../../../../common/ToolbarCustomComponent";
import createImagePlugin from "@draft-js-plugins/image";
import star from "../../../../../../assets/images/star (2).svg";
import uploadImg from "../../../../../../assets/images/image.svg";
import SimpleReactValidator from "simple-react-validator";
import {
  getSeoAndPerformanceList,
  createSeoAndPerformance,
} from "../server/SeoandPerformanceServer";
import { successAlert, errorAlert } from "../../../../../../js/alerts.js";
import htmlToDraft from "html-to-draftjs";
const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];
export class SeoAndPerformanceComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      messageText: "",
      isShowEmojiModal: false,
      isShowGifImgModal: false,
      seoAndPerformance: {
        meta_title: "",
        meta_description: "",
        meta_image: null,
        meta_favicon: null,
        google_analytics_path: "",
        facebook_pixel_path: "",
        hotjar_path: "",
        custom_tracking_code_path: "",
      },
      setMeta_image: null,
      setMeta_favicon: null,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    getSeoAndPerformanceList(
      params,
      (res) => {
        let temp = res.seoperformancemonitor;
        const contentBlock = htmlToDraft(temp.meta_description);
        let messageText = "";
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          messageText = editorState;
        }
        _this.setState({
          seoAndPerformance: temp,
          setMeta_image: temp.meta_image,
          setMeta_favicon: temp.meta_favicon,
          messageText: messageText,
        });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;

    let tempObj = _this.state.seoAndPerformance;
    if (_this.state.messageText !== "") {
      tempObj.meta_description = draftToHtml(
        convertToRaw(_this.state.messageText.getCurrentContent())
      );
    } else {
      tempObj.meta_description = "";
    }
    if (_this.state.setMeta_image !== null) {
      tempObj.meta_image = _this.state.setMeta_image;
    }
    if (_this.state.setMeta_favicon !== null) {
      tempObj.meta_favicon = _this.state.setMeta_favicon;
    }
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      createSeoAndPerformance(
        params,
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Updated Successfully!", _this.props.superThis);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(8);
        },
        (res) => {
          _this.setState({ loading: false });
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.seoAndPerformance;
    newObj[e.target.name] = e.target.value;
    _this.setState({ seoAndPerformance: newObj });
  };
  handleMetaImgChange = (files, name) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0 && files[0].type.includes("image")) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }
      if (files[0].name.includes(".png") || files[0].name.includes(".jpg")) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            // _this.checkImageDimension(reader.result, name);
            _this.setState({
              icon_files: files[0],
              setMeta_image: reader.result,
              showIcon: true,
            });
          },
          false
        );
        reader.readAsDataURL(files[0]);
      } else {
        _this.setState({
          icon_files: "",
          showIcon: false,
          setMeta_image: null,
        });
        errorAlert(`Please select a valid Image file type.`, _this.props._this);
      }
    }
  };
  handleMetaFaviconChange = (files, name) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0 && files[0].type.includes("image")) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }
      if (
        files[0].name.includes(".png") ||
        files[0].name.includes(".jpg") ||
        files[0].name.includes(".ico")
      ) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            // _this.checkImageDimension(reader.result, name);
            _this.setState({
              icon_files: files[0],
              setMeta_favicon: reader.result,
              showIcon: true,
            });
          },
          false
        );
        reader.readAsDataURL(files[0]);
      } else {
        _this.setState({
          icon_files: "",
          showIcon: false,
          setMeta_favicon: null,
        });
        errorAlert(
          `Please select a valid Image file type.`,
          _this.props.superThis
        );
      }
    }
  };
  checkImageDimension = async (url, name) => {
    let _this = this;
    const { width, height } = await reactImageSize(url);
    if (name === "meta_image" && width > 0 && height > 0) {
      if (
        (width === 3840 && height === 2160) ||
        (width === 1920 && height === 1080)
      ) {
      } else {
        errorAlert(
          `Uploaded meta image has invalid Height and Width.`,
          _this.props._this
        );
        _this.setState({
          icon_files: "",
          showIcon: false,
          setMeta_image: null,
        });
      }
    } else if (name === "meta_favicon" && width > 0 && height > 0) {
      if (
        (width === 3840 && height === 2160) ||
        (width === 1920 && height === 1080)
      ) {
      } else {
        errorAlert(
          `Uploaded favicon image has invalid Height and Width.`,

          _this.props.superThis
        );
        _this.setState({
          image_files: "",
          showImage: false,
          setMeta_favicon: null,
        });
      }
    }
  };
  uploadImageCallBack = (file) => {
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };
    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };
  render() {
    let _this = this;
    const Input = styled("input")({
      display: "none",
    });
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Seo and performance monitoring</p>
            {/* <p className="desc">
              
            </p> */}
          </div>
          <div className="seo-perfom-block">
            <div className="basic-acc-block block ">
              <div className="show-on-block">
                <p className="title">Meta title</p>

                <div className="text-small-block mb-3">
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Enter title"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      name="meta_title"
                      value={
                        _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.meta_title
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "title",
                      _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.meta_title,
                      "required"
                    )}
                  </div>
                </div>
              </div>

              <div className="show-on-block">
                <p className="title">Meta description</p>

                <div className="text-small-block mb-3">
                  <div className="offline_email_section">
                    <div className="email_top">
                      <div className="w-100">
                        <div className="reply_message editor-block-all right-emoji-show">
                          <div className="msg_text"></div>

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
                                urlEnabled: true,
                                uploadEnabled: true,
                                alignmentEnabled: false,
                                uploadCallback: _this.uploadImageCallBack,
                                previewImage: true,
                                inputAccept:
                                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
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
                                {..._this.props}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="show-on-block">
                <p className="title">Meta image</p>
                <div className="basic-acc-block block ">
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE">Upload image</label>
                    <div className="preview-upload">
                      <div
                        style={
                          _this.state.setMeta_image == null
                            ? { backgroundColor: "#edf3f2" }
                            : { backgroundColor: "#ffff" }
                        }
                        className="preview"
                      >
                        {this.state.setMeta_image == null ? (
                          <img src={image} alt="" />
                        ) : (
                          <img
                            src={_this.state.setMeta_image}
                            alt=""
                            className="show-preview"
                          />
                        )}
                      </div>
                      <div className="upload">
                        <label htmlFor="contained-button-file">
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            // multiple
                            type="file"
                            onChange={(e) =>
                              _this.handleMetaImgChange(
                                e.target.files,
                                "meta_image"
                              )
                            }
                          />
                          <Button variant="contained" component="span">
                            Choose file
                          </Button>
                        </label>
                      </div>
                    </div>
                    <div className="condition-block">
                      <ul>
                        <li>Image format: JPG/PNG</li>
                        <li>Aspect Ratio: 16:9 </li>
                        <li>Recommended size: 3840x2160 or 1920x1080 pixels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="show-on-block">
                <p className="title">Meta favicon</p>
                <div className="basic-acc-block block ">
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE">Choose icon</label>
                    <div className="preview-upload">
                      <div className="preview">
                        {this.state.setMeta_favicon == null ? (
                          <img src={image} alt="" />
                        ) : (
                          <img
                            src={_this.state.setMeta_favicon}
                            alt=""
                            className="show-preview"
                          />
                        )}
                      </div>
                      <div className="upload">
                        <label htmlFor="contained-button-file1">
                          <Input
                            accept="image/*"
                            id="contained-button-file1"
                            // multiple
                            type="file"
                            onChange={(e) =>
                              _this.handleMetaFaviconChange(
                                e.target.files,
                                "meta_favicon"
                              )
                            }
                          />
                          <Button variant="contained" component="span">
                            Choose file
                          </Button>
                        </label>
                      </div>
                    </div>
                    <div className="condition-block">
                      <ul>
                        <li>Image format: SVG/PNG</li>
                        <li>Aspect Ratio: 16:9 </li>
                        <li>Recommended size: 3840x2160 or 1920x1080 pixels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="basic-acc-block block ">
              <div className="show-on-block frame-block">
                <p className="title">Google analytics</p>
                <p className="title-small">Doesn’t work for embedded bots</p>

                <div className="new-tab-block" style={{ width: "100%" }}>
                  <div className="link-block">
                    <input
                      className="trackers_input"
                      type="text"
                      placeholder="Google Analytics ID"
                      name="google_analytics_path"
                      value={
                        _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.google_analytics_path
                      }
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="show-on-block frame-block">
                <p className="title">Facebook pixel</p>
                {/* <p className="title-small">
                  
                </p> */}

                <div className="new-tab-block" style={{ width: "100%" }}>
                  <div className="link-block">
                    <input
                      className="trackers_input"
                      type="text"
                      placeholder="Facebook Pixel ID"
                      name="facebook_pixel_path"
                      value={
                        _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.facebook_pixel_path
                      }
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="show-on-block frame-block">
                <p className="title">Hotjar</p>
                {/* <p className="title-small">
                  
                </p> */}

                <div className="new-tab-block" style={{ width: "100%" }}>
                  <div className="link-block">
                    <input
                      className="trackers_input"
                      type="text"
                      placeholder="Hotjar ID"
                      name="hotjar_path"
                      value={
                        _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.hotjar_path
                      }
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="show-on-block frame-block">
                <p className="title">Custom tracking code</p>
                {/* <p className="title-small">
                  
                </p> */}

                <div className="new-tab-block" style={{ width: "100%" }}>
                  <div className="link-block">
                    <input
                      className="trackers_input"
                      type="text"
                      placeholder="Custom tracking code"
                      name="custom_tracking_code_path"
                      value={
                        _this.state.seoAndPerformance &&
                        _this.state.seoAndPerformance.custom_tracking_code_path
                      }
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <Button
              type="button"
              onClick={() => {
                _this.fetchDataFromServer();
              }}
              variant="outlined"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              variant="outlined"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SeoAndPerformanceComponent;
