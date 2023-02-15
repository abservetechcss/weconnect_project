import React, { Component, Fragment } from "react";
import menu from "../../../../../../../assets/images/userdash/Group 18691.svg";
import trash from "../../../../../../../assets/images/userdash/trash-2.svg";
import link from "../../../../../../../assets/images/link.svg";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IconButton, Button, Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import { Container, Draggable } from "react-smooth-dnd";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";
import { AlertContext } from "../../../../../../common/Alert";
import { validURL, makeValidURL } from "../../../../../../../js/lib";
import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

export default class AddLinksComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    this.state = {
      save: false,
      savedButtons: [],
      linkDetail: [
        {
          link_text: "Open",
          link_id: 0,
          link: "",
          new_tab: 1,
          link_type: "link",
          status: 0,
        },
      ],
      defaultHtml: "<p>Please contact us</p>",
      editordata: "",
    };

    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayObject = this.handleArrayObject.bind(this);
    this.handleArrayObjectCheck = this.handleArrayObjectCheck.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        question: this.state.defaultHtml,
        type: this.props.type,
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
      linkDetail: [
        {
          btn_text: "Open",
          link_id: 0,
          link: "https://weconnect.chat",
          new_tab: 1,
          status: 0,
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
        btn_detail: this.myRef.linkDetail,
      });
    }
  }
  refreshOptionTypes(noUpdate) {
    this.myRef.linkDetail = this.state.linkDetail.map((item) => {
      item.btn_text = item.link_text;
      return item;
    });
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }

  addChatMessagPreview() {
    if (this.props.widget && this.props.widget.addUserMessage) {
      console.log("this.props.type", this.props.type);
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
          btn_detail: this.myRef.linkDetail,
        },
      };
      console.log("message", message);
      this.props.widget.addUserMessage(message);
    }
  }
  refreshComponent(noUpdate) {
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    let component = {
      ...this.myRef.component,
      question: html,
    };
    this.myRef.component = component;
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
            this.setState({
              defaultHtml: res.message,
            });
            const updateState = {
              linkDetail: res.link_detail || this.state.linkDetail,
              savedButtons: res.link_detail,
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
    const botId = this.props.botId;
    const errors = [];
    const savedBtnId = [];

    if (this.state.linkDetail.length === 0) {
      errors.push("Atleast one link is required!");
    }

    var formData = new FormData();
    formData.append("type", this.props.type);
    formData.append("bot_id", botId);
    formData.append("chat_message", html);
    formData.append("order_no", this.props.orderNo);

    this.state.linkDetail.map((item) => {
      if (item.link_text.trim() === "") {
        errors.push("Link Title is Required");
      }

      if (validURL(item.link)) {
        item.link = makeValidURL(item.link);
      } else {
        errors.push("valid link required");
      }
      if (item.link_text.trim() !== "") {
        formData.append("link_title[]", item.link_text);
        formData.append("new_tab[]", item.new_tab);
        formData.append("link[]", item.link || "");
        formData.append("status[]", 0);
        formData.append("link_type[]", "link");
        if (this.props.questionId !== "") {
          formData.append("link_id[]", item.link_id);
          savedBtnId.push(item.link_id);
        }
      }
    });

    if (this.props.questionId !== "") {
      const deletedButton = this.state.savedButtons.filter((item) => {
        if (!savedBtnId.includes(item.link_id)) return true;
      });
      deletedButton.map((item) => {
        formData.append("link_title[]", item.link_text);
        formData.append("new_tab[]", item.new_tab);
        formData.append("link[]", item.link);
        formData.append("status[]", 1);
        formData.append("link_type[]", "link");
        formData.append("link_id[]", item.link_id);
      });
    }

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
    console.log("this.props", this.props);
    console.log("this.props.questionId", this.props.questionId);
    console.log("this.props.type", this.props.type);
    if (this.props.questionId === "") {
      createComponent(
        formData,
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
      formData.append("question_id", this.props.questionId);
      updateComponent(
        formData,
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

  handleArrayObject = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    this.setState(
      {
        linkDetail: [
          ...this.state.linkDetail.slice(0, index),
          {
            ...this.state.linkDetail[index],
            [label]: event.target.value,
          },
          ...this.state.linkDetail.slice(index + 1),
        ],
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  handleArrayObjectCheck = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    this.setState(
      {
        linkDetail: [
          ...this.state.linkDetail.slice(0, index),
          {
            ...this.state.linkDetail[index],
            [label]: event.target.checked ? 1 : 0,
          },
          ...this.state.linkDetail.slice(index + 1),
        ],
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  deleteArrayObject = (index) => {
    const linkDetail = [...this.state.linkDetail];
    linkDetail.splice(index, 1);
    console.log("linkDetail", linkDetail);
    this.setState({
      linkDetail: linkDetail,
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

                  <div className="option_component">
                    <label htmlFor="Chat Message">Share Link</label>
                    <div className="option_style_box">
                      <Container
                        dragHandleSelector=".drag_handle"
                        onDrop={(e) => {
                          this.setState(
                            {
                              linkDetail: applyDrag(this.state.linkDetail, e),
                            },
                            () => {
                              this.refreshOptionTypes();
                            }
                          );
                        }}
                      >
                        {this.state.linkDetail.map((item, key) => {
                          return (
                            <Draggable key={key}>
                              <div className="option_repeat">
                                <div className="menu_box drag_handle">
                                  <img src={menu} alt="" className="noSelect" />
                                </div>

                                <div className="option_input_box nonDragAreaSelector">
                                  <div>
                                    <label className="option_label">
                                      Link {key + 1}
                                    </label>
                                    <div className="tab_label">
                                      <Form.Group
                                        controlId={"formnewTabCheckbox" + key}
                                      >
                                        <Form.Check
                                          type="checkbox"
                                          label="New Tab"
                                          name="new_tab"
                                          data-index={key}
                                          onChange={this.handleArrayObjectCheck}
                                          checked={item.new_tab === 1}
                                        />
                                      </Form.Group>
                                      <IconButton
                                        component="span"
                                        onClick={() => {
                                          this.deleteArrayObject(key);
                                        }}
                                      >
                                        <img src={trash} alt="" />
                                      </IconButton>
                                    </div>
                                  </div>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <FloatingLabel
                                        className="floating-input-field-block-cust"
                                        controlId="floatingPassword"
                                        label="Title"
                                      >
                                        <Form.Control
                                          type="text"
                                          placeholder="Title"
                                          name="link_text"
                                          data-index={key}
                                          onChange={this.handleArrayObject}
                                          value={item.link_text}
                                        />
                                      </FloatingLabel>
                                    </Grid>
                                    <Grid
                                      style={{ position: "relative" }}
                                      item
                                      xs={6}
                                    >
                                      <FloatingLabel
                                        className="floating-input-link-field-block-cust"
                                        controlId="floatingPassword"
                                        label="Username / Link"
                                      >
                                        <div className="icon-block">
                                          <img src={link} alt="" />
                                        </div>
                                        <Form.Control
                                          type="text"
                                          placeholder="https://www.example.com"
                                          name="link"
                                          data-index={key}
                                          onChange={this.handleArrayObject}
                                          value={item.link}
                                        />
                                      </FloatingLabel>
                                    </Grid>
                                  </Grid>
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
                          let tempObj = this.state.linkDetail;
                          tempObj[this.state.linkDetail.length] = {
                            link_text: "",
                            link_id: 0,
                            link: "",
                            new_tab: 1,
                            status: 0,
                          };
                          console.log(tempObj);
                          this.setState({
                            linkDetail: tempObj,
                          });
                        }}
                      >
                        <HiOutlinePlusSm />
                        Add next link
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
