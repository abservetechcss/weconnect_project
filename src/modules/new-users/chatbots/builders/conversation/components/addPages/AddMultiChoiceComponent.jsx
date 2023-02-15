import React, { Component, Fragment } from "react";
import deleteIcon from "../../../../../../../assets/images/userdash/trash-2 red.svg";
import menu from "../../../../../../../assets/images/userdash/Group 18691.svg";
import image from "../../../../../../../assets/images/image.svg";
import { styled } from "@mui/material/styles";
import { IconButton, Button, Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import plus from "../../../../../../../assets/images/plus (1).svg";
import link from "../../../../../../../assets/images/link.svg";

import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import { Container, Draggable } from "react-smooth-dnd";
import FontIconPicker from "@muthu32/react-fonticonpicker";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";

import { AlertContext } from "../../../../../../common/Alert";
import { validURL, makeValidURL } from "../../../../../../../js/lib";
import { ReactIcons } from "../../../../../../common/IconList";
import { DynamicIcon } from "../../../../../../common/DynamicIcon";
import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

// const ReactIconsAi = require('react-icons/ai');
// const ReactIconsFa = require('react-icons/fa');
// const ReactIconsIo = require('react-icons/io5');
// const ReactIconsMd = require('react-icons/md');
// const ReactIconsTi = require('react-icons/ti');
// const ReactIconsGo = require('react-icons/go');
// const ReactIconsFi = require('react-icons/fi');
// const ReactIconsGi = require('react-icons/gi');
// const ReactIconsWi = require('react-icons/wi');
// const ReactIconsDi = require('react-icons/di');
// const ReactIconsBs = require('react-icons/bs');
// const ReactIconsRi = require('react-icons/ri');
// const ReactIconsFc = require('react-icons/fc');
// const ReactIconsGr = require('react-icons/gr');
// const ReactIconsHi = require('react-icons/hi');
// const ReactIconsSi = require('react-icons/si');
// const ReactIconsIm = require('react-icons/im');
// const ReactIconsBi = require('react-icons/bi');
// const ReactIconsCg = require('react-icons/cg');
// const ReactIconsVsc = require('react-icons/vsc');
// // const ReactIconsTb = require('react-icons/tb'); only in new versions

// const exportedIcons = {
//   "Ant Design Icons": Object.keys(ReactIconsAi),
//   "Bootstrap Icons": Object.keys(ReactIconsBs),
//   "BoxIcons": Object.keys(ReactIconsBi),
//   "Devicons": Object.keys(ReactIconsDi),
//   "Feather": Object.keys(ReactIconsFi),
//   "Flat Color Icons": Object.keys(ReactIconsFc),
//   "Font Awesome": Object.keys(ReactIconsFa),
//   "Game Icons": Object.keys(ReactIconsGi),
//   "Github Octicons icons": Object.keys(ReactIconsGo),
//   "Grommet-Icons": Object.keys(ReactIconsGr),
//   "Heroicons": Object.keys(ReactIconsHi),
//   "IcoMoon Free": Object.keys(ReactIconsIm),
//   "Ionicons 4": Object.keys(ReactIconsIo),
//   "Material Design icons": Object.keys(ReactIconsMd),
//   "Remix Icon": Object.keys(ReactIconsRi),
//   "Simple Icons": Object.keys(ReactIconsSi),
//   // "Tabler Icons": Object.keys(ReactIconsTb), only in new versions
//   "Typicons": Object.keys(ReactIconsTi),
//   "VS Code Icons": Object.keys(ReactIconsVsc),
//   "Weather Icons": Object.keys(ReactIconsWi),
//   "css.gg": Object.keys(ReactIconsCg)
//   // "Ionicons 5": has conflicts with ionicons 4
//   };
// // copy resulted object & paste in iconlist
// console.log("loaded Icons", exportedIcons);

export default class AddMultiChoiceComponent extends Component {
  static contextType = AlertContext;

  constructor(props) {
    super(props);
    this.defaultHtml = "Select a option";

    this.state = {
      btn_type: "chips",
      backButton: 0,
      skipButton: 0,
      transparency: 0,
      setIcon: null,
      save: false,
      savedButtons: [],
      btnDetail: [
        {
          btn_text: "Sample option",
          btn_id: 0,
          link: "",
          new_tab: 1,
          status: 0,
          image: "",
          icon: "",
        },
      ],
      defaultHtml: "<p>Select a option</p>",
      editordata: "",
    };

    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayObject = this.handleArrayObject.bind(this);
    this.handleArrayObjectCheck = this.handleArrayObjectCheck.bind(this);
    this.handleArrayObjectImage = this.handleArrayObjectImage.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        chip_type: "chips",
        type: this.props.type,
        question: this.state.defaultHtml,
        back_button: 0,
        skip_button: 0,
        minimum_digit: 0,
        maximum_digit: 10,
        message_error: "Please enter a valid number",
        welcome_card_image: "",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        btn_type: this.state.btn_type,
        order_no: "0",
        client_id: "309-160-128e2b8f30",
        hide: 0,
        transparency: "0",
      },
      btn_detail: [
        {
          btn_text: "Sample option",
          btn_id: 0,
          link: "",
          new_tab: 0,
          status: 0,
          image: "",
          icon: "",
        },
      ],
    };
    this.handCheckChange = this.handCheckChange.bind(this);

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
        transparency: this.state.transparency,
      });
    }
  }

  renderSVG(svg) {
    return <DynamicIcon icon={svg} size="2em" color="black" />;
  }

  refreshOptionTypes(noUpdate) {
    const btnDetail = this.state.btnDetail.map((item) => {
      if (this.state.btn_type == "image") item.btn_val = item.image;
      else item.btn_val = item.icon;
      return item;
    });
    this.myRef.btn_detail = btnDetail;
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
          btn_detail: this.myRef.btn_detail,
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
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      transparency: this.state.transparency,
      chip_type: this.state.btn_type,
      question: html,
    };
    this.myRef.component = component;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }
  handleCheckChange = (event) => {
    const name = event.target.name;
    this.setState({ [name]: event.target.checked ? 1 : 0 }, () => {
      //  this.refreshComponent();
    });
  };

  handCheckChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked ? 1 : 0 }, () => {
      //  this.refreshComponent();
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
      getSavedComponent(
        myparams,
        (res) => {
          console.log("response", res);
          if (res.status === "True") {
            this.setState({
              defaultHtml: res.message,
            });
            let btnDetail = res.btn_detail || this.state.btnDetail;
            btnDetail = btnDetail.map((item) => {
              if (res.btn_type === "image") {
                item.image = item.btn_val;
              }
              if (res.btn_type === "icon") {
                item.icon = item.btn_val;
              }
              return item;
            });
            const updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              transparency: res.transparency,
              btn_type: res.btn_type || "chips",
              btnDetail: btnDetail,
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
    const botId = this.props.botId;
    const errors = [];
    if (this.state.btnDetail.length === 0) {
      errors.push("Atleast one button is required!");
    }
    var formData = new FormData();
    formData.append("type", this.props.type);
    formData.append("bot_id", botId);
    formData.append("chat_message", html);
    formData.append("back_button", this.state.backButton);
    formData.append("transparency", this.state.transparency);
    formData.append("skip_button", this.state.skipButton);
    formData.append("order_no", this.props.orderNo);
    formData.append("btn_type", this.state.btn_type);
    const savedBtnId = [];
    this.state.btnDetail.map((item, btnIndex) => {
      if (item.btn_text.trim() !== "") {
        if (this.state.btn_type === "image") {
          if (item.image == "") {
            errors.push("Image is Required");
          }
          formData.append("image[]", item.image);
        }
        if (this.state.btn_type === "icon") {
          if (item.icon == "") {
            errors.push("Icon is Required");
          }
          formData.append("icon[]", item.icon);
        }
        if (validURL(item.link)) {
          item.link = makeValidURL(item.link);
        } else if (item.link !== "") {
          errors.push("valid link required");
        }

        formData.append("btn_name[]", item.btn_text);
        if (this.props.questionId !== "") {
          //supply btn_order_no only on edit component
          formData.append("btn_order_no[]", btnIndex);
        }
        formData.append("new_tab[]", item.new_tab);
        formData.append("link[]", item.link || "");
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
        if (this.state.btn_type === "image") {
          formData.append("image[]", item.image || "");
        }
        if (this.state.btn_type === "icon") {
          formData.append("icon[]", item.icon || "");
        }
        formData.append("btn_name[]", item.btn_text);
        formData.append("link[]", item.link);
        formData.append("new_tab[]", item.new_tab);
        formData.append("status[]", 1); //deleted value status 1
        formData.append("btn_id[]", item.btn_id);
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

  handleArrayIcon = (value, key) => {
    const index = parseInt(key);
    const label = "icon";
    this.setState(
      {
        btnDetail: [
          ...this.state.btnDetail.slice(0, index),
          {
            ...this.state.btnDetail[index],
            [label]: value,
          },
          ...this.state.btnDetail.slice(index + 1),
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
        btnDetail: [
          ...this.state.btnDetail.slice(0, index),
          {
            ...this.state.btnDetail[index],
            [label]: event.target.checked ? 1 : 0,
          },
          ...this.state.btnDetail.slice(index + 1),
        ],
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  handleArrayObjectImage = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    const FR = new FileReader();

    FR.addEventListener("load", (evt) => {
      this.setState(
        {
          btnDetail: [
            ...this.state.btnDetail.slice(0, index),
            {
              ...this.state.btnDetail[index],
              [label]: evt.target.result,
            },
            ...this.state.btnDetail.slice(index + 1),
          ],
        },
        () => {
          this.refreshOptionTypes();
        }
      );
    });
    FR.readAsDataURL(event.target.files[0]);
  };

  deleteArrayObject = (index) => {
    const btnDetail = [...this.state.btnDetail];
    btnDetail.splice(index, 1);
    console.log("btnDetail", btnDetail);
    this.setState(
      {
        btnDetail: btnDetail,
      },
      () => {
        this.refreshOptionTypes();
      }
    );
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
    const Input = styled("input")({
      display: "none",
    });
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
                      <Form.Group controlId="transparencyCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Component Transparency "
                          onChange={this.handCheckChange}
                          name="transparency"
                          checked={this.state.transparency === 1}
                        />
                      </Form.Group>{" "}
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
                  <div className="btn-group-style-section">
                    <label htmlFor="Chat Message">Button Style</label>
                    <div className="welcome-btn-block">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Button Style"
                        className="floating-select-field-block-cust"
                      >
                        <Form.Select
                          aria-label="Floating label select example"
                          name="btn_type"
                          value={this.state.btn_type}
                          onChange={this.handleInputChange}
                        >
                          <option value="chips">Chips</option>
                          <option value="image">Button With Image</option>
                          <option value="icon">Button with Icon</option>
                        </Form.Select>
                      </FloatingLabel>
                      <Container
                        dragHandleSelector=".drag_handle"
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
                        {this.state.btnDetail.map((item, key) => {
                          return (
                            <Draggable key={key}>
                              <div className="draggable-item">
                                <div className="btn-group-block">
                                  <div className="drag_handle">
                                    <img
                                      src={menu}
                                      className="hover-menu-icon noSelect"
                                      alt=""
                                    />
                                  </div>
                                  <div className="nonDragAreaSelector">
                                    <div className="text-tab">
                                      <label htmlFor="">Button {key + 1}</label>
                                      <div className="tab">
                                        <Form.Group
                                          className=""
                                          controlId="formBasicCheckbox"
                                        >
                                          <Form.Check
                                            type="checkbox"
                                            label="New Tab"
                                            data-index={key}
                                            name="new_tab"
                                            onChange={
                                              this.handleArrayObjectCheck
                                            }
                                            checked={item.new_tab === 1}
                                          />
                                        </Form.Group>
                                        <span className="vl"></span>
                                        <div className="delete-icon-block">
                                          <IconButton
                                            onClick={() => {
                                              this.deleteArrayObject(key);
                                            }}
                                          >
                                            <img src={deleteIcon} alt="" />
                                          </IconButton>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="btn-group">
                                      <Grid container spacing="5">
                                        <Grid item sm={6}>
                                          <Form.Group
                                            className="input-field-block-cust"
                                            controlId="formBasicEmail"
                                          >
                                            <Form.Control
                                              type="text"
                                              placeholder="Button Name"
                                              data-index={key}
                                              name="btn_text"
                                              onChange={this.handleArrayObject}
                                              value={item.btn_text}
                                            />
                                          </Form.Group>
                                        </Grid>

                                        <Grid item sm={6}>
                                          <Form.Group
                                            className="search-block-cust"
                                            controlId="formBasicEmail"
                                          >
                                            <div className="search-field-box search-field-box2">
                                              <img src={link} alt="" />
                                              <Form.Control
                                                type="text"
                                                placeholder="https://www.example.com"
                                                data-index={key}
                                                name="link"
                                                onChange={
                                                  this.handleArrayObject
                                                }
                                                value={item.link}
                                              />
                                            </div>
                                          </Form.Group>
                                        </Grid>

                                        {this.state.btn_type === "icon" && (
                                          <Grid item sm={6}>
                                            <Form.Group
                                              className="search-block-cust"
                                              controlId="formBasicEmail"
                                            >
                                              <div className="icon_picker_field">
                                                <FontIconPicker
                                                  closeOnSelect={true}
                                                  value={item.icon}
                                                  // theme="teal"
                                                  isMulti={false}
                                                  icons={ReactIcons}
                                                  renderFunc={this.renderSVG}
                                                  onChange={(val) =>
                                                    this.handleArrayIcon(
                                                      val,
                                                      key
                                                    )
                                                  }
                                                />
                                              </div>
                                            </Form.Group>
                                          </Grid>
                                        )}

                                        {this.state.btn_type === "image" && (
                                          <Grid item sm={6}>
                                            <div className="upload-image-block">
                                              <label htmlFor="UPLOAD IMAGE">
                                                UPLOAD IMAGE
                                              </label>
                                              <div className="preview-upload">
                                                <div className="preview">
                                                  {item.image == "" ? (
                                                    <img src={image} alt="" />
                                                  ) : (
                                                    <img
                                                      src={item.image}
                                                      alt=""
                                                      className="show-preview"
                                                    />
                                                  )}
                                                </div>
                                                <div className="upload">
                                                  <label
                                                    htmlFor={
                                                      "contained-button-file" +
                                                      key
                                                    }
                                                  >
                                                    <Input
                                                      accept="image/*"
                                                      id={
                                                        "contained-button-file" +
                                                        key
                                                      }
                                                      // multiple
                                                      type="file"
                                                      data-index={key}
                                                      name="image"
                                                      onChange={
                                                        this
                                                          .handleArrayObjectImage
                                                      }
                                                    />
                                                    <Button
                                                      variant="contained"
                                                      component="span"
                                                    >
                                                      Choose file
                                                    </Button>
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="condition-block">
                                                <ul>
                                                  <li>Image format: JPG/PNG</li>
                                                  <li>Aspect Ratio: 16:9 </li>
                                                  <li>
                                                    Recommended size: 3840x2160
                                                    or 1920x1080 pixels
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Draggable>
                          );
                        })}
                      </Container>
                      <div className="next-btn-block">
                        <Button
                          variant="text"
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
                          <img src={plus} alt="" />
                          Add next button
                        </Button>
                      </div>
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
