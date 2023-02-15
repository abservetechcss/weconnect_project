import React, { Component, Fragment } from "react";
import menu from "../../../../../../../assets/images/userdash/Group 18691.svg";
import trash from "../../../../../../../assets/images/userdash/trash-2.svg";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IconButton, Button } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";

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

export default class AddMultiSelectComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.defaultHtml = "Please select yours options";

    this.state = {
      save: false,
      transparency: 0,
      backButton: 0,
      skipButton: 0,
      btnstyle: "",
      savedButtons: [],
      btnDetail: [
        {
          btn_text: "Sample option",
          btn_id: 0,
          link: "",
          new_tab: 0,
          status: 0,
        },
      ],
      defaultHtml: "<p>Please select yours options</p>",
      editordata: "",
    };

    this.handCheckChange = this.handCheckChange.bind(this);
    this.handCheckChangeT = this.handCheckChangeT.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.state.defaultHtml,
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
        transparency: "0",
      },
      btn_detail: [
        {
          btn_text: "Sample option",
          btn_id: 0,
        },
      ],
    };
    this.footerRef = React.createRef();
    this.editorRef = React.createRef();
  }

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      console.log("data", this.myRef);
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
        btn_detail: this.myRef.btn_detail,
      });
    }
  }
  refreshOptionTypes(noUpdate) {
    this.myRef.btn_detail = this.state.btnDetail;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }

  refreshComponent(noUpdate) {
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    let component = {
      ...this.myRef.component,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      question: html,
      transparency: this.state.transparency,
    };
    this.myRef.component = component;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }

  addChatMessagPreview() {
    if (this.props.widget && this.props.widget.addUserMessage) {
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
          btn_detail: this.myRef.btn_detail,
        },
      };
      console.log("message", message);
      this.props.widget.addUserMessage(message);
    }
  }

  componentDidMount() {
    let _this = this;
    console.log("this.props.questionId", this.props);
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
              transparency: res.transparency,
              btnDetail: res.btn_detail || this.state.btnDetail,
              savedButtons: res.btn_detail,
            };

            this.setState(updateState, () => {
              this.refreshComponent(true);
              this.refreshOptionTypes(true);
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
    // const botId = localStorage.getItem("activeBotId");
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
    if (this.state.btnDetail.length === 0) {
      errors.push("Atleast one select option is required!");
    }

    const savedBtnId = [];
    var formData = new FormData();
    formData.append("type", this.props.type);
    formData.append("bot_id", botId);
    formData.append("chat_message", html);
    formData.append("back_button", this.state.backButton);
    formData.append("skip_button", this.state.skipButton);
    formData.append("transparency", this.state.transparency ? "1" : "0");
    formData.append("order_no", this.props.orderNo);

    this.state.btnDetail.map((item) => {
      if (item.btn_text.trim() !== "") {
        formData.append("btn_name[]", item.btn_text);
        formData.append("status[]", 0);
        if (this.props.questionId !== "") {
          savedBtnId.push(item.btn_id);
          formData.append("btn_id[]", item.btn_id);
        }
      }
    });

    if (this.props.questionId !== "") {
      const deletedButton = this.state.savedButtons.filter((item) => {
        if (!savedBtnId.includes(item.btn_id)) return true;
      });
      deletedButton.map((item) => {
        formData.append("btn_name[]", item.btn_text);
        formData.append("status[]", 1); //deleted value status 1
        formData.append("btn_id[]", item.btn_id);
      });
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      return;
    }

    if (this.props.questionId === "") {
      createComponent(
        formData,
        (res) => {
          console.log("res", res);
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
      formData.append("question_id", this.props.questionId);
      updateComponent(
        formData,
        (res) => {
          if (res.status === "True") {
            this.props.handleCloseChatComponent();
            this.context.showAlert({
              type: "success",
              message: "Component updated successfully",
            });
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

  handCheckChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.checked ? 1 : 0 }, () => {
      if (label === "liveChat" || label === "videoChat") {
        this.refreshOptionTypes();
      } else {
        this.refreshComponent();
      }
    });
  };
  handCheckChangeT = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked ? 1 : 0 }, () => {
      // this.refreshComponent();
    });
  };
  handleInputChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.value }, () => {
      if (label === "liveChatName" || label === "videoChatName") {
        this.refreshOptionTypes();
      } else {
        this.refreshComponent();
      }
    });
  };

  handleArrayObject = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.dataset.label;
    this.setState(
      {
        btnDetail: [
          ...this.state.btnDetail.slice(0, index),
          {
            ...this.state.btnDetail[index],
            [label]: event.target.value,
          },
          ...this.state.btnDetail.slice(index + 1),
        ],
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  deleteArrayObject = (index) => {
    const btnDetail = [...this.state.btnDetail];
    btnDetail.splice(index, 1);
    console.log("btnDetail", btnDetail);
    this.setState({
      btnDetail: btnDetail,
    });
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

  handleBtnStyle = (event) => {
    this.setState({
      btnstyle: event.target.value,
    });
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

  render() {
    let _this = this;

    const applyDrag = (arr, dragResult) => {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    };
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
                      <Form.Group controlId="transparencyCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Component Transparency "
                          onChange={this.handCheckChangeT}
                          name="transparency"
                          checked={this.state.transparency === 1}
                        />
                      </Form.Group>
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
                          onChange={this.handCheckChange}
                          data-label="backButton"
                          checked={this.state.backButton === 1}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSkipCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Skip button"
                          onChange={this.handCheckChange}
                          data-label="skipButton"
                          checked={this.state.skipButton === 1}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="option_component">
                    <label htmlFor="Chat Message">Options</label>
                    <div className="option_style_box">
                      <Container
                        dragHandleSelector=".drag_handle"
                        animationDuration={500}
                        onDrop={(e) => {
                          this.setState(
                            {
                              btnDetail: applyDrag(this.state.btnDetail, e),
                            },
                            () => {
                              this.refreshOptionTypes();
                            }
                          );
                        }}
                      >
                        {this.state.btnDetail.map((value, key) => {
                          return (
                            <Draggable key={key}>
                              <div className="option_repeat">
                                <div className="menu_box drag_handle">
                                  <img src={menu} alt="" className="noSelect" />
                                </div>

                                <div className="option_input_box nonDragAreaSelector">
                                  <div>
                                    <label className="option_label">
                                      Option {key + 1}
                                    </label>
                                    <IconButton
                                      component="span"
                                      onClick={() => {
                                        this.deleteArrayObject(key);
                                      }}
                                    >
                                      <img src={trash} />
                                    </IconButton>
                                  </div>
                                  <FloatingLabel
                                    className="floating-input-field-block-cust"
                                    controlId="floatingPassword"
                                    label="Option Name"
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Option Name"
                                      data-index={key}
                                      data-label="btn_text"
                                      onChange={this.handleArrayObject}
                                      value={value.btn_text}
                                    />
                                  </FloatingLabel>
                                </div>
                              </div>
                            </Draggable>
                          );
                        })}
                      </Container>
                      <Button
                        variant="outlined"
                        className="mt-3"
                        onClick={() => {
                          let tempObj = this.state.btnDetail;
                          tempObj[this.state.btnDetail.length] = {
                            btn_text: "",
                            btn_id: 0,
                            link: "",
                            new_tab: 0,
                            status: 0,
                          };
                          console.log(tempObj);
                          this.setState({
                            btnDetail: tempObj,
                          });
                        }}
                      >
                        <HiOutlinePlusSm />
                        Add next button
                      </Button>
                    </div>
                  </div>
                </div>
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
