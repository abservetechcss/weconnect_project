import React, { Component, Fragment } from "react";
import image from "../../../../../../../assets/images/image.svg";
import deleteIcon from "../../../../../../../assets/images/userdash/trash-2 red.svg";
import menu from "../../../../../../../assets/images/userdash/Group 18691.svg";
import { IconButton, Menu, Button, Divider, Grid } from "@mui/material";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";
import FontIconPicker from "@muthu32/react-fonticonpicker";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css";

import { ColorPicker } from "react-color-gradient-picker";
import "react-color-gradient-picker/dist/index.css";
import { styled } from "@mui/material/styles";
import { FloatingLabel, Form } from "react-bootstrap";
import link from "../../../../../../../assets/images/link.svg";
import plus from "../../../../../../../assets/images/plus (1).svg";
import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import { Container, Draggable } from "react-smooth-dnd";
import { AlertContext } from "../../../../../../common/Alert";
import { ReactIcons } from "../../../../../../common/IconList";
import { DynamicIcon } from "../../../../../../common/DynamicIcon";
import { validURL, makeValidURL } from "../../../../../../../js/lib";
import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

const gradient = {
  points: [
    {
      left: 0,
      red: 132,
      green: 237,
      blue: 149,
      alpha: 1,
    },
    {
      left: 100,
      red: 98,
      green: 192,
      blue: 100,
      alpha: 1,
    },
  ],
  type: "linear",
  degree: 0,
  style:
    "linear-gradient(0deg,rgba(132, 237, 149, 1) 0%,rgba(98, 192, 100, 1) 100%)",
};

const color = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 1,
  hue: 0,
  saturation: 0,
  value: 0,
  style: "rgba(0, 0, 0, 1)",
};

const cardColor = {
  red: 255,
  green: 255,
  blue: 255,
  alpha: 1,
  hue: 0,
  saturation: 0,
  value: 100,
  style: "rgba(255, 255, 255, 1)",
};

export default class AddWelcomeCardComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.defaultHtml =
      "Hi There! I am Kaiwa, your personal assistant for today.How can I assist you today?";

    this.state = {
      value: "fipicon-angle-left",
      cardColor: "rgb(118 171 251)",
      cardAnchorEl: null,
      solidColor: "rgb(255 200 200)",
      solidAnchorEl: null,
      gradientColor: "rgb(118 171 251)",
      gradientAnchorEl: null,
      component: false,
      chatBlock: true,
      flowChartBlock: true,
      addChatBlock: false,
      addSimpleChat: false,
      activeChat: 0,
      mainComponent: 1,
      uploadPreview: "",
      welcome_card_image: "",
      welcome_card_bg_type: "gradient",
      welcome_card_bg_color: cardColor,
      welcome_card_bg_start: gradient,
      welcome_card_text_color: color,
      btn_type: "chips",
      transparency: 0,
      savedButtons: [],
      btnDetail: [
        {
          btn_text: "Sample button",
          btn_detail: "",
          link: "",
          new_tab: 1,
          status: true,
          icon: "",
          image: "",
        },
      ],
      defaultHtml:
        "<p>Hi There! I am Kaiwa, your personal assistant for today.How can I assist you today?</p>",
      editordata: "",
      validation_message: [],
    };
    this.handCheckChangeT = this.handCheckChangeT.bind(this);

    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayObject = this.handleArrayObject.bind(this);
    this.handleArrayObjectCheck = this.handleArrayObjectCheck.bind(this);
    this.handleArrayObjectImage = this.handleArrayObjectImage.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.defaultHtml,
        message_error: "Please enter a valid number",
        welcome_card_bg_type: "gradient",
        welcome_card_bg_color: JSON.stringify(cardColor),
        welcome_card_bg_start: JSON.stringify(gradient),
        welcome_card_text_color: JSON.stringify(color),
        welcome_card_image: "",
        chip_type: "chips",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        order_no: "0",
        client_id: "309-160-128e2b8f30",
        hide: 0,
        transparency: "0",
      },
      btnDetail: [
        {
          btn_text: "Sample option",
          btn_detail: "",
          btn_id: 0,
          link: "",
          new_tab: 0,
          status: 0,
          image: "",
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
        btn_detail: this.myRef.btnDetail,
      });
    }
  }

  refreshOptionTypes(noUpdate) {
    const btnDetail = this.state.btnDetail.map((item) => {
      if (this.state.btn_type === "image") item.btn_val = item.image;
      else item.btn_val = item.icon;
      return item;
    });
    this.myRef.btnDetail = btnDetail;
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
          btn_detail: this.myRef.btnDetail,
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
      transparency: this.state.transparency,
      chip_type: this.state.btn_type || "chips",
      welcome_card_bg_color: JSON.stringify(this.state.welcome_card_bg_color),
      welcome_card_text_color: JSON.stringify(
        this.state.welcome_card_text_color
      ),
      welcome_card_bg_start: JSON.stringify(this.state.welcome_card_bg_start),
      welcome_card_bg_type: this.state.welcome_card_bg_type,
      welcome_card_image: this.state.welcome_card_image,
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

  handCheckChangeT = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked ? 1 : 0 }, () => {
      // this.refreshComponent();
    });
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

  renderSVG(svg) {
    return <DynamicIcon icon={svg} size="2em" color="black" />;
  }

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
            let DbcardColor = cardColor;
            let DbGradient = gradient;
            let dbTextColor = color;
            try {
              if (res.welcome_card_text_color !== "")
                dbTextColor = JSON.parse(res.welcome_card_text_color);
            } catch (error) {
              console.log("error", error);
            }
            if (res.welcome_card_bg_type === "gradient") {
              try {
                if (res.welcome_card_bg_start !== "")
                  DbGradient = JSON.parse(res.welcome_card_bg_start);
              } catch (error) {
                console.log("error", error);
              }
            } else {
              try {
                if (res.welcome_card_bg_color !== "")
                  DbcardColor = JSON.parse(res.welcome_card_bg_color);
              } catch (error) {
                console.log("error", error);
              }
            }
            const updateState = {
              btnDetail: btnDetail,
              savedButtons: btnDetail,
              transparency: res.transparency,
              btn_type: res.btn_type || "chips",
              welcome_card_bg_type: res.welcome_card_bg_type,
              welcome_card_bg_color: DbcardColor,
              welcome_card_text_color: dbTextColor,
              welcome_card_bg_start: DbGradient,
              welcome_card_image: res.welcome_card_image,
            };

            console.log("updateState", updateState);

            this.setState(updateState, () => {
              this.refreshOptionTypes(true);
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

    const botId = this.props.botId;
    const errors = [];

    if (this.state.btnDetail.length === 0) {
      errors.push("Atleast one button is required!");
    }

    var formData = new FormData();
    formData.append("type", this.props.type);
    formData.append("bot_id", botId);
    formData.append("chat_message", html);
    formData.append("transparency", this.state.transparency);
    // formData.append("back_button", this.state.backButton);
    // formData.append("skip_button", this.state.skip_button);
    formData.append("order_no", this.props.orderNo);
    formData.append("btn_type", this.state.btn_type);
    console.log(
      "this.state.welcome_card_bg_color",
      this.state.welcome_card_bg_color
    );
    formData.append("welcome_card_bg_type", this.state.welcome_card_bg_type);
    formData.append(
      "welcome_card_text_color",
      JSON.stringify(this.state.welcome_card_text_color)
      // this.state.welcome_card_text_color
    );
    if (this.state.welcome_card_bg_type === "color") {
      formData.append(
        "welcome_card_bg_color",
        JSON.stringify(this.state.welcome_card_bg_color)
        // this.state.welcome_card_bg_color
      );
    } else {
      formData.append(
        "welcome_card_bg_start",
        JSON.stringify(this.state.welcome_card_bg_start)
        // this.state.welcome_card_bg_start
      );
    }

    if (this.state.welcome_card_image !== "") {
      formData.append("welcome_card_image", this.state.welcome_card_image);
    }
    const savedBtnId = [];
    this.state.btnDetail.map((item) => {
      if (item.btn_text.trim() !== "") {
        if (this.state.btn_type === "image") {
          if (item.image === "") {
            errors.push("Image is Required");
          }
          formData.append("image[]", item.image);
        } else if (this.state.btn_type === "icon") {
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
        formData.append("link[]", item.link || "");
        formData.append("new_tab[]", item.new_tab || "0");
        formData.append("status[]", 0);
        if (this.props.questionId !== "") {
          formData.append("btn_id[]", item.btn_id);
          savedBtnId.push(item.btn_id);
        }
      } else {
        errors.push("Button Name is Required");
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

  handleArrayObjectCheck = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    console.log("checked", event.target.checked);
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

  handleCardClick = (event) => {
    this.setState({
      cardAnchorEl: event.currentTarget,
    });
  };
  handleIconChange = (value) => {
    this.setState({ value });
  };
  handleSolidClick = (event) => {
    this.setState({
      solidAnchorEl: event.currentTarget,
    });
  };
  onChangeGradient = (welcome_card_bg_start) => {
    console.log("welcome_card_bg_start", welcome_card_bg_start);
    this.setState(
      {
        welcome_card_bg_type: "gradient",
        welcome_card_bg_start: welcome_card_bg_start,
      },
      () => {
        this.refreshComponent();
      }
    );
  };
  onChangeColor = (welcome_card_bg_color) => {
    console.log("onChangeColor set", welcome_card_bg_color);
    this.setState(
      {
        welcome_card_bg_color: welcome_card_bg_color,
        welcome_card_bg_type: "color",
      },
      () => {
        this.refreshComponent();
      }
    );
  };
  onChangeTextColor = (welcome_card_text_color) => {
    console.log("onChangeTextColor set", welcome_card_text_color);
    this.setState(
      {
        welcome_card_text_color: welcome_card_text_color,
      },
      () => {
        this.refreshComponent();
      }
    );
  };

  handleGradientClick = (event) => {
    this.setState({
      gradientAnchorEl: event.currentTarget,
    });
  };

  handleCardClose = () => {
    this.setState({
      cardAnchorEl: null,
    });
  };

  handleSolidClose = () => {
    this.setState({
      solidAnchorEl: null,
    });
  };
  handleGradientClose = () => {
    this.setState({
      gradientAnchorEl: null,
    });
  };
  handleClickComponent = (event) => {
    this.setState({
      component: event.currentTarget,
    });
  };
  handleCloseComponent = () => {
    this.setState({ component: null });
  };

  handleCloseChatComponent = () => {
    this.setState({
      chatBlock: true,
      addChatBlock: false,
      addSimpleChat: false,
      activeChat: 0,
      createdComponent: false,
    });
  };

  openComponent = (value) => {
    this.setState({
      chatBlock: false,
      addChatBlock: true,
      // addSimpleChat: false,
      activeChat: value,
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
    const props = {
      icons: [
        "fipicon-angle-left",
        "fipicon-angle-right",
        "fipicon-angle-up",
        "fipicon-angle-down",
      ],
      theme: "bluegrey",
      renderUsing: "class",
      value: this.state.value,
      onChange: this.handleChange,
      isMulti: false,
    };
    const cardOpen = Boolean(this.state.cardAnchorEl);
    const solidOpen = Boolean(this.state.solidAnchorEl);
    const gradientOpen = Boolean(this.state.gradientAnchorEl);
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

    // console.log(this.state.cardColor);
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
                </div>
              </div>

              <div className="edit-card-section">
                <label htmlFor="Edit Card">Edit Card</label>
                <div className="edit-card-block">
                  <div className="color-block">
                    <label htmlFor="COLORS">COLORS</label>
                    <div>
                      <div className="simple">
                        <Button variant="text" onClick={this.handleSolidClick}>
                          <div
                            className="preview-color-block"
                            style={{
                              background:
                                this.state.welcome_card_text_color.style,
                              backgroundColor:
                                this.state.welcome_card_text_color.style,
                            }}
                          ></div>
                          Text Color
                        </Button>
                      </div>
                      <div className="gradient">
                        <Button variant="text" onClick={this.handleCardClick}>
                          <div
                            className="preview-color-block"
                            style={{
                              background:
                                this.state.welcome_card_bg_color.style,
                              backgroundColor:
                                this.state.welcome_card_bg_color.style,
                            }}
                          ></div>
                          Card Color
                        </Button>
                      </div>
                      <div className="gradient">
                        <Button
                          variant="text"
                          onClick={this.handleGradientClick}
                          className="gradient-btn"
                        >
                          <div
                            className="preview-color-block"
                            style={{
                              background:
                                this.state.welcome_card_bg_start.style,
                            }}
                          ></div>
                          Gradient Color
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE">UPLOAD IMAGE</label>
                    <div className="preview-upload">
                      <div className="preview">
                        {this.state.welcome_card_image == "" ? (
                          <img src={image} alt="" />
                        ) : (
                          <img
                            src={this.state.welcome_card_image}
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
                            onChange={(e) => {
                              // console.log(e.target.files[0])

                              const FR = new FileReader();

                              FR.addEventListener("load", (evt) => {
                                this.setState(
                                  {
                                    welcome_card_image: evt.target.result,
                                  },
                                  () => {
                                    this.refreshComponent();
                                  }
                                );
                              });
                              FR.readAsDataURL(e.target.files[0]);
                            }}
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
                  <Divider />
                  <div className="default-block">
                    <div className="text-block">
                      <p>Default</p>
                      <span>
                        On clicking, appearance will be set to default.
                      </span>
                    </div>
                    <div className="btn-block">
                      <Button
                        variant="text"
                        onClick={() => {
                          _this.setState(
                            {
                              welcome_card_image: "",
                              welcome_card_bg_color: cardColor,
                              welcome_card_bg_start: gradient,
                              welcome_card_bg_type: "gradient",
                              welcome_card_text_color: color,
                            },
                            () => {
                              this.refreshComponent();
                            }
                          );
                        }}
                      >
                        Default
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <p className="edit-bottom-text">
                  Duis aute irure dolor in reprehenderit in voluptate velit
                </p> */}
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
              <div className="btn-group-style-section ">
                {/* <label htmlFor="Edit Card">Duis aute</label> */}
                <div className="welcome-btn-block">
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Buttom Style"
                    className="floating-select-field-block-cust"
                  >
                    <Form.Select
                      aria-label="Floating label select example"
                      name="btn_type"
                      value={this.state.btn_type}
                      onChange={this.handleInputChange}
                    >
                      <option value="chips">Chips</option>
                      <option value="icon">Button with Icon</option>
                      <option value="image">Button with Image</option>
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
                                      controlId={"formNewTab" + key}
                                    >
                                      <Form.Check
                                        type="checkbox"
                                        label="New Tab"
                                        name="new_tab"
                                        onChange={this.handleArrayObjectCheck}
                                        checked={item.new_tab === 1}
                                        data-index={key}
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
                                        controlId="formButton"
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
                                            onChange={this.handleArrayObject}
                                            value={item.link}
                                          />
                                        </div>
                                      </Form.Group>
                                    </Grid>
                                    {this.state.btn_type === "image" && (
                                      <Grid item sm={12}>
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
                                                  "contained-button-file" + key
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
                                                    this.handleArrayObjectImage
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
                                              <li>Aspect Ratio: 16:9mb </li>
                                              <li>
                                                Recommended size: 3840x2160 or
                                                1920x1080 pixels
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </Grid>
                                    )}
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
                                                this.handleArrayIcon(val, key)
                                              }
                                            />
                                          </div>
                                        </Form.Group>
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
                        this.setState(
                          {
                            btnDetail: tempObj,
                          },
                          () => {
                            this.refreshOptionTypes();
                          }
                        );
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

          {/* card color menu start */}
          <Menu
            id="basic-menu"
            anchorEl={this.state.cardAnchorEl}
            open={cardOpen}
            onClose={this.handleCardClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className="color-model-block"
          >
            <div>
              <ColorPicker
                onStartChange={this.onChangeColor}
                onChange={this.onChangeColor}
                onEndChange={this.onChangeColor}
                color={this.state.welcome_card_bg_color}
              />
            </div>
          </Menu>
          {/* card color menu end */}

          {/* solid color menu start */}
          <Menu
            id="basic-menu"
            anchorEl={this.state.solidAnchorEl}
            open={solidOpen}
            onClose={this.handleSolidClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className="color-model-block"
          >
            <div>
              <ColorPicker
                onStartChange={this.onChangeTextColor}
                onChange={this.onChangeTextColor}
                onEndChange={this.onChangeTextColor}
                color={this.state.welcome_card_text_color}
              />
            </div>
          </Menu>
          {/* solid color menu end */}

          {/* gradient color menu start */}
          <Menu
            id="basic-menu"
            anchorEl={this.state.gradientAnchorEl}
            open={gradientOpen}
            onClose={this.handleGradientClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className="color-model-block"
          >
            <div>
              <ColorPicker
                onStartChange={this.onChangeGradient}
                onChange={this.onChangeGradient}
                onEndChange={this.onChangeGradient}
                gradient={this.state.welcome_card_bg_start}
                isGradient
              />
            </div>
          </Menu>
          {/* gradient color menu end */}

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
