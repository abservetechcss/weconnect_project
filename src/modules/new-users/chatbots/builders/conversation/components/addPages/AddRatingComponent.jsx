import React, { Component, Fragment } from "react";
import face1 from "../../../../../../../assets/images/face1.png";
import face2 from "../../../../../../../assets/images/face2.png";
import face3 from "../../../../../../../assets/images/face3.png";
import face4 from "../../../../../../../assets/images/face4.png";
import face5 from "../../../../../../../assets/images/face5.png";
import smily1 from "../../../../../../../assets/images/sad2.png";
import smily2 from "../../../../../../../assets/images/sad1.png";
import smily3 from "../../../../../../../assets/images/neutral.png";
import smily4 from "../../../../../../../assets/images/happy1.png";
import smily5 from "../../../../../../../assets/images/happy2.png";
import star from "../../../../../../../assets/images/star (3).svg";
import edit from "../../../../../../../assets/images/edit-2.svg";
import { IconButton, Tooltip, Button, Divider } from "@mui/material";
import { Form } from "react-bootstrap";

// import Slider from "react-rangeslider";
// import "react-rangeslider/lib/index.css";
import Slider from "@mui/material/Slider";

import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";
import { AlertContext } from "../../../../../../common/Alert";
import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

export default class AddRatingComponent extends Component {
  static contextType = AlertContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: 1,
      starEditToggle: false,
      faceEditToggle: false,
      rangeEditToggle: false,
      starEditShow: false,
      save: false,
      backButton: 0,
      skipButton: 0,
      rating_type: "star",
      activeEditRating: "",
      rating_1: "Terrible",
      rating_2: "Bad",
      rating_3: "Okay",
      rating_4: "Good",
      rating_5: "Awesome",
      temp_rating_1: "Terrible",
      temp_rating_2: "Bad",
      temp_rating_3: "Okay",
      temp_rating_4: "Good",
      temp_rating_5: "Awesome",
      defaultHtml: "<p>How was your experience?</p>",
      editordata: "",
    };

    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveRatingText = this.saveRatingText.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.defaultHtml,
        back_button: 0,
        skip_button: 0,
        welcome_card_image: "",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        welcome_card_bg_type: "",
        order_no: "0",
        client_id: "309-160-128e2b8f30",
        hide: 0,
      },
      options: {
        rating_1: "Terrible",
        rating_2: "Bad",
        rating_3: "Okay",
        rating_4: "Good",
        rating_5: "Awesome",
        rating_type: "star",
      },
    };
    this.footerRef = React.createRef();
    this.editorRef = React.createRef();
  }

  saveRatingText() {
    this.setState({
      activeEditRating: "",
      rating_1: this.state.temp_rating_1,
      rating_2: this.state.temp_rating_2,
      rating_3: this.state.temp_rating_3,
      rating_4: this.state.temp_rating_4,
      rating_5: this.state.temp_rating_5,
    });
  }

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      console.log("data", this.myRef);
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
        options: this.myRef.options,
      });
    }
  }
  addChatMessagPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current &&
      this.props.widget.addUserMessage
    ) {
      console.log("this.props.type", this.props.type);
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
          options: this.myRef.options,
        },
      };
      console.log("message", message);
      this.props.widget.addUserMessage(message);
    }
  }
  refreshComponent(noUpdate) {
    const html = this.state.editordata;
    let component = {
      ...this.myRef.component,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      question: html,
    };
    this.myRef.component = component;
    let options = {
      rating_1: this.state.rating_1,
      rating_2: this.state.rating_2,
      rating_3: this.state.rating_3,
      rating_4: this.state.rating_4,
      rating_5: this.state.rating_5,
      rating_type: this.state.rating_type,
    };
    this.myRef.options = options;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }
  handleCheckChange = (event) => {
    const name = event.target.name;
    this.setState({ [name]: event.target.checked ? 1 : 0 }, () => {
      this.refreshComponent();
    });
  };
  handleInputChange = (event) => {
    const label = event.target.name;
    this.setState({ [label]: event.target.value }, () => {
      this.refreshComponent();
    });
  };

  componentDidMount() {
    let _this = this;
    if (this.props.questionId !== "") {
      const myparams = `bot_id=${this.props.botId}&type=${this.props.type}&question_id=${this.props.questionId}`;
      this.context.showLoading();
      getSavedComponent(
        myparams,
        (res) => {
          this.context.showLoading(false);
          console.log("response", res);
          if (res.status === "True") {
            // this.editorRef.current.setHtml(res.message);
            this.setState({
              defaultHtml: res.message,
            });
            const updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              rating_1: res.rating_1,
              rating_2: res.rating_2,
              rating_3: res.rating_3,
              rating_4: res.rating_4,
              rating_5: res.rating_5,
              rating_type: res.rating_type,
            };

            this.setState(updateState, () => {
              this.refreshComponent(true);
              this.addChatMessagPreview();
            });
          }
        },
        (error) => {}
      );
    } else {
      // this.editorRef.current.setHtml(this.defaultHtml, () => {
      _this.addChatMessagPreview();
      // });
    }
  }

  componentWillUnmount() {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef &&
      window.WeConnect.webchatRef.current
    )
      window.WeConnect.webchatRef.current.clearMessages();
  }

  insertInMiddle(param) {
    param.orderNo = this.props.orderNo;
    insertComponent(
      param,
      (res) => {
        this.context.showAlert({
          type: "success",
          message: "Component added successfully",
        });
        this.props.handleCloseChatComponent();
      },
      (err) => {
        this.context.showAlert({
          type: "error",
          message: err.message || "Sequence Update Failed",
        });
      }
    );
  }

  handleSave = () => {
    this.context.showLoading();
    if (
      this.footerRef &&
      this.footerRef.current &&
      this.footerRef.current.handleDialogClose
    )
      this.footerRef.current.handleDialogClose();

    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    this.handleDialogClose();
    const botId = this.props.botId;
    const errors = [];
    const textContent = html.replace(
      /<(?!img\s*\/?)(?!video\s*\/?)[^>]+>/g,
      ""
    );
    console.log("textContent", textContent);
    if (textContent.trim() === "") {
      errors.push("Chat Message is Required");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      return;
    }

    const data = {
      type: this.props.type,
      bot_id: botId,
      chat_message: html,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      rating_type: this.state.rating_type,
      order_no: this.props.orderNo,
      rating_1: this.state.rating_1,
      rating_2: this.state.rating_2,
      rating_3: this.state.rating_3,
      rating_4: this.state.rating_4,
      rating_5: this.state.rating_5,
    };
    console.log("this.props.questionId", this.props);
    if (this.props.questionId === "") {
      createComponent(
        data,
        (res) => {
          if (res.status === "True") {
            if (this.props.insertMiddle) {
              this.insertInMiddle(res);
            } else {
              this.context.showAlert({
                type: "success",
                message: "Component added successfully",
              });
              this.props.handleCloseChatComponent();
            }
          } else {
            this.handleDialogClose();
            this.context.showAlert({
              type: "error",
              message: res.message || "Add Component Failed",
            });
          }
        },
        (error) => {
          this.handleDialogClose();
          this.context.showAlert({
            type: "error",
            message: error.message || "Add Component Failed",
          });
        }
      );
    } else {
      data.type = this.props.type;
      data.question_id = this.props.questionId;
      updateComponent(
        data,
        (res) => {
          if (res.status === "True") {
            this.context.showAlert({
              type: "success",
              message: "Component updated successfully",
            });
            this.props.handleCloseChatComponent();
          } else {
            this.handleDialogClose();
            this.context.showAlert({
              type: "error",
              message: res.message || "Update Component Failed",
            });
          }
        },
        (error) => {
          this.context.showAlert({
            type: "error",
            message: error.message || "Update Component Failed",
          });
        }
      );
    }
  };

  uploadImageCallBackfn = (file, filetype) => {
    return uploadImageCallBack(file, filetype);
  };

  EditorChange = (newValue) => {
    if (this.state.defaultHtml !== newValue) {
      console.log(newValue);
      this.setState(
        {
          editordata: newValue,
        },
        () => {
          this.refreshComponent();
        }
      );
    }
  };

  handleDialogClose = () => {
    this.setState({
      save: false,
    });
  };

  handleDialogOpen = () => {
    this.setState({
      save: true,
    });
  };

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleSliderChange = (event, value) => {
    console.log("value", value);
    this.setState({
      value: value,
    });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
  };
  handleRatingEditToggle = (value) => {
    this.setState(
      {
        temp_rating_1: this.state.rating_1,
        temp_rating_2: this.state.rating_2,
        temp_rating_3: this.state.rating_3,
        temp_rating_4: this.state.rating_4,
        temp_rating_5: this.state.rating_5,
        rating_type: value,
      },
      () => {
        this.refreshComponent();
      }
    );
  };
  valueLabelFormat = (x) => {
    return this.state["rating_" + x];
  };
  valueTempLabelFormat = (x) => {
    return this.state["temp_rating_" + x];
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <section className="add-chat-block-section">
          <ConfigureHeader {...this.props} />
          <div className="main-section">
            <div className="chat-msg-block">
              <div className="offline_email_section">
                <div className="email_top">
                  <div className="w-100">
                    <div className="reply_message editor-block-all">
                      <div className="msg_text"></div>
                      <label htmlFor="Chat Message">Chat Message</label>
                      <CustomEditor
                        defaultHtml={_this.state.defaultHtml}
                        uploadImageCallBackfn={_this.uploadImageCallBackfn}
                        handleEditorChange={_this.EditorChange}
                        botId={this.props.botId}
                        questionId={this.props.questionId}
                      />
                    </div>
                  </div>
                  <div className="button_component">
                    <label htmlFor="Chat Message">Button</label>
                    <div>
                      {" "}
                      <Form.Group controlId="formBackCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Back button"
                          onChange={this.handleCheckChange}
                          name="backButton"
                          checked={this.state.backButton === 1}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSkipCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Skip button"
                          onChange={this.handleCheckChange}
                          name="skipButton"
                          checked={this.state.skipButton === 1}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rating-section">
                <label htmlFor="Rating">Rating</label>
                {this.state.activeEditRating === "" ? (
                  <div className="rating-block">
                    <div
                      onClick={() => {
                        this.handleRatingEditToggle("star");
                      }}
                      className={
                        this.state.rating_type === "star" ? "active" : null
                      }
                    >
                      <div className="block star-block">
                        <div className="star">
                          <Tooltip title={this.state.rating_1} placement="top">
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip title={this.state.rating_2} placement="top">
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip title={this.state.rating_3} placement="top">
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip title={this.state.rating_4} placement="top">
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip title={this.state.rating_5} placement="top">
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                      {this.state.rating_type === "star" ? (
                        <div className="edit-label">
                          <IconButton
                            component="span"
                            style={{ borderRadius: 0 }}
                            onClick={() => {
                              this.setState({
                                activeEditRating: "star",
                              });
                            }}
                          >
                            <img src={edit} alt="" />
                            <label htmlFor="Edit Label">Edit Label</label>
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                    <div
                      onClick={() => {
                        this.handleRatingEditToggle("smily");
                      }}
                      className={
                        this.state.rating_type === "smily" ? "active" : null
                      }
                    >
                      <div className="block face-block">
                        <div className="face2">
                          <Tooltip title={this.state.rating_1} placement="top">
                            <img src={smily1} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face2">
                          <Tooltip title={this.state.rating_2} placement="top">
                            <img src={smily2} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face2">
                          <Tooltip title={this.state.rating_3} placement="top">
                            <img src={smily3} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face2">
                          <Tooltip title={this.state.rating_4} placement="top">
                            <img src={smily4} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face2">
                          <Tooltip title={this.state.rating_5} placement="top">
                            <img src={smily5} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                      {this.state.rating_type === "smily" ? (
                        <div className="edit-label">
                          <IconButton
                            component="span"
                            style={{ borderRadius: 0 }}
                            onClick={() => {
                              this.setState({
                                activeEditRating: "smily",
                              });
                            }}
                          >
                            <img src={edit} alt="" />
                            <label htmlFor="Edit Label">Edit Label</label>
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                    <div
                      onClick={() => {
                        this.handleRatingEditToggle("emoji");
                      }}
                      className={
                        this.state.rating_type === "emoji" ? "active" : null
                      }
                    >
                      <div className="block face-block">
                        <div className="face">
                          <Tooltip title={this.state.rating_1} placement="top">
                            <img src={face1} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip title={this.state.rating_2} placement="top">
                            <img src={face2} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip title={this.state.rating_3} placement="top">
                            <img src={face3} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip title={this.state.rating_4} placement="top">
                            <img src={face4} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip title={this.state.rating_5} placement="top">
                            <img src={face5} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                      {this.state.rating_type === "emoji" ? (
                        <div className="edit-label">
                          <IconButton
                            component="span"
                            style={{ borderRadius: 0 }}
                            onClick={() => {
                              this.setState({
                                activeEditRating: "emoji",
                              });
                            }}
                          >
                            <img src={edit} alt="" />
                            <label htmlFor="Edit Label">Edit Label</label>
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                    <div
                      onClick={() => {
                        this.handleRatingEditToggle("slider");
                      }}
                      className={
                        this.state.rating_type === "slider" ? "active" : null
                      }
                    >
                      <div className="block">
                        <div className="range rating_range_unique">
                          {/* https://codesandbox.io/s/create-react-app-0jbd4?file=/src/App.js:339-348 */}
                          <Slider
                            min={1}
                            max={5}
                            value={this.state.value}
                            onChange={this.handleSliderChange}
                            valueLabelDisplay="auto"
                            valueLabelFormat={this.valueLabelFormat}
                          />
                        </div>
                      </div>
                      {this.state.rating_type === "slider" ? (
                        <div className="edit-label">
                          <IconButton
                            component="span"
                            style={{ borderRadius: 0 }}
                            onClick={() => {
                              this.setState({
                                activeEditRating: "slider",
                              });
                            }}
                          >
                            <img src={edit} alt="" />
                            <label htmlFor="Edit Label">Edit Label</label>
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="rating-block individual-rating-block">
                    {this.state.activeEditRating === "star" && (
                      <div className="big-star">
                        <div className="star">
                          <Tooltip
                            title={this.state.temp_rating_5}
                            placement="top"
                          >
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip
                            title={this.state.temp_rating_4}
                            placement="top"
                          >
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip
                            title={this.state.temp_rating_3}
                            placement="top"
                          >
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip
                            title={this.state.temp_rating_2}
                            placement="top"
                          >
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                        <div className="star">
                          <Tooltip
                            title={this.state.temp_rating_1}
                            placement="top"
                          >
                            <img src={star} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                    )}
                    {this.state.activeEditRating === "emoji" && (
                      <div className="big-face">
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_5}
                            placement="top"
                          >
                            <img src={face1} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_4}
                            placement="top"
                          >
                            <img src={face2} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_3}
                            placement="top"
                          >
                            <img src={face3} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_2}
                            placement="top"
                          >
                            <img src={face4} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_1}
                            placement="top"
                          >
                            <img src={face5} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                    )}
                    {this.state.activeEditRating === "smily" && (
                      <div className="big-face">
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_5}
                            placement="top"
                          >
                            <img src={smily1} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_4}
                            placement="top"
                          >
                            <img src={smily2} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_3}
                            placement="top"
                          >
                            <img src={smily3} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_2}
                            placement="top"
                          >
                            <img src={smily4} alt="" />
                          </Tooltip>
                        </div>
                        <div className="face">
                          <Tooltip
                            title={this.state.temp_rating_1}
                            placement="top"
                          >
                            <img src={smily5} alt="" />
                          </Tooltip>
                        </div>
                      </div>
                    )}
                    {this.state.activeEditRating === "slider" && (
                      <div className="big-slider">
                        <div className="block">
                          <div className="range">
                            <Slider
                              min={1}
                              max={5}
                              value={this.state.value}
                              onChange={this.handleSliderChange}
                              valueLabelDisplay="auto"
                              valueLabelFormat={this.valueTempLabelFormat}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Divider />
                    <div className="detail-block">
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">1</span>
                          {this.state.activeEditRating === "star" && (
                            <span className="star">
                              <img src={star} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "emoji" && (
                            <span className="face">
                              <img src={face1} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "smily" && (
                            <span className="face">
                              <img src={smily1} alt="" />
                            </span>
                          )}
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            value={this.state.temp_rating_1}
                            name="temp_rating_1"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">2</span>
                          {this.state.activeEditRating === "star" && (
                            <span className="star">
                              <img src={star} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "emoji" && (
                            <span className="face">
                              <img src={face2} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "smily" && (
                            <span className="face">
                              <img src={smily2} alt="" />
                            </span>
                          )}
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            value={this.state.temp_rating_2}
                            name="temp_rating_2"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">3</span>
                          {this.state.activeEditRating === "star" && (
                            <span className="star">
                              <img src={star} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "emoji" && (
                            <span className="face">
                              <img src={face3} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "smily" && (
                            <span className="face">
                              <img src={smily3} alt="" />
                            </span>
                          )}
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            value={this.state.temp_rating_3}
                            name="temp_rating_3"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">4</span>
                          {this.state.activeEditRating === "star" && (
                            <span className="star">
                              <img src={star} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "emoji" && (
                            <span className="face">
                              <img src={face4} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "smily" && (
                            <span className="face">
                              <img src={smily4} alt="" />
                            </span>
                          )}
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            value={this.state.temp_rating_4}
                            name="temp_rating_4"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">5</span>
                          {this.state.activeEditRating === "star" && (
                            <span className="star">
                              <img src={star} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "emoji" && (
                            <span className="face">
                              <img src={face5} alt="" />
                            </span>
                          )}
                          {this.state.activeEditRating === "smily" && (
                            <span className="face">
                              <img src={smily5} alt="" />
                            </span>
                          )}
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            value={this.state.temp_rating_5}
                            name="temp_rating_5"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="btn_block">
                      <Button
                        variant="contained"
                        className="cancel-btn"
                        onClick={() => {
                          this.setState({
                            activeEditRating: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="save-btn"
                        onClick={this.saveRatingText}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ConfigureFooter
            ref={this.footerRef}
            {...this.props}
            handleSave={this.handleSave}
          />
        </section>
      </Fragment>
    );
  }
}
