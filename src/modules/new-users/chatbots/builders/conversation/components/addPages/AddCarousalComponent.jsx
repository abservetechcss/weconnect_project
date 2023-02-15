import React, { Component, Fragment } from "react";
import menu from "../../../../../../../assets/images/userdash/Group 18691.svg";
import trash from "../../../../../../../assets/images/userdash/trash-2.svg";
import link from "../../../../../../../assets/images/link.svg";
import { HiOutlinePlusSm } from "react-icons/hi";
import { Button, Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";
import image from "../../../../../../../assets/images/image.svg";
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

export default class AddCarousalComponent extends Component {
  static contextType = AlertContext;

  constructor(props) {
    super(props);
    this.state = {
      backButton: 0,
      skipButton: 0,
      transparency: 0,
      savedButtons: [],
      carouselDetail: [
        {
          btn_type: "carousal",
          btn_id: 0,
          btn_text: "Sample",
          currency: "USD",
          price: parseFloat(0.0),
          link: "",
          image: "",
          description: "",
          status: 0,
          new_tab: 0,
        },
      ],
      btnDetail: [
        {
          btn_type: "button",
          btn_id: 0,
          btn_text: "Sample button",
          link: "",
          new_tab: 0,
          image: "",
          description: "",
          currency: "",
          price: "0",
          status: 0,
        },
      ],
      defaultHtml: "<p>Please select one of the options below</p>",
      editordata: "",
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
        welcome_card_bg_type: "color",
        order_no: "0",
        client_id: "309-160-128e2b8f30",
        hide: 0,
        transparency: "0",
      },
      btnDetail: [
        {
          link_type: "carousal",
          btn_type: "carousal",
          btn_id: 0,
          btn_text: "Sample",
          currency: "USD",
          price: parseFloat(0.0),
          link: "carousal.com",
          image: "",
          description: "",
          status: 0,
          new_tab: 0,
          btn_image: "",
        },
        {
          link_type: "button",
          btn_type: "button",
          btn_id: 476,
          btn_text: "Sample button",
          link: "",
          new_tab: 0,
          image: "",
          description: "",
          currency: "",
          price: "0",
          status: 0,
          btn_image: "",
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
        transparency: this.state.transparency,
      });
    }
  }
  refreshOptionTypes(noUpdate) {
    this.myRef.btnDetail = [
      ...this.state.carouselDetail.map((item) => {
        item.link_type = item.btn_type || item.link_type;
        item.btn_image = item.image;
        return item;
      }),
      ...this.state.btnDetail.map((item) => {
        item.link_type = item.btn_type || item.link_type;
        return item;
      }),
    ];
    console.log("btnDetail", this.myRef.btnDetail);
    if (noUpdate === undefined) this.refreshPreview();
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
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      transparency: this.state.transparency,
      question: html,
    };
    this.myRef.component = component;
    if (noUpdate === undefined) this.refreshPreview();
  }
  handleCheckChange = (event) => {
    const name = event.target.name;
    this.setState({ [name]: event.target.checked ? 1 : 0 }, () => {
      this.refreshComponent();
    });
  };
  handCheckChangeT = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked ? 1 : 0 }, () => {
      // this.refreshComponent();
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
            const btnDetail = res.btn_detail.filter((item) => {
              if (item.link_type === "button") return true;
            });
            const carouselDetail = res.btn_detail.filter((item) => {
              if (item.link_type === "carousal") return true;
            });
            const updateState = {
              btnDetail: btnDetail,
              carouselDetail: carouselDetail,
              btn_type: res.btn_type || "chips",
              backButton: res.back_button,
              skipButton: res.skip_button,
              transparency: res.transparency,
              savedButtons: res.btn_detail,
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
        if (this.props.insertMiddle) {
          this.insertInMiddle(res);
        } else {
          this.context.showAlert({
            type: "success",
            message: "Component added successfully",
          });
          this.props.handleCloseChatComponent();
        }
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
    if (this.state.carouselDetail.length === 0) {
      errors.push("Atleast one carousel option is required!");
    }
    var formData = new FormData();
    formData.append("type", this.props.type);
    formData.append("bot_id", botId);
    formData.append("chat_message", html);
    formData.append("back_button", this.state.backButton);
    formData.append("transparency",this.state.transparency);
    formData.append("skip_button", this.state.skipButton);
    formData.append("order_no", this.props.orderNo);
    // formData.append('btn_type', this.state.btn_type);
    const savedBtnId = [];
    this.state.carouselDetail.map((item) => {
      if (item.btn_text && item.btn_text.trim() !== "") {
        if (item.image === "") {
          errors.push("Image is Required");
        }
        if (item.price < 0) {
          errors.push("amount should not be less than '0'");
        }
        if (item.description == "") {
          errors.push("Description is Required");
        }

        formData.append("link_type[]", "carousal");
        formData.append("btn_name[]", item.btn_text);
        formData.append("link[]", item.link || "");
        formData.append("new_tab[]", item.new_tab || "0");
        formData.append("description[]", item.description);
        formData.append("currency[]", item.currency);
        formData.append("price[]", item.price);
        formData.append("image[]", item.image);
        formData.append("status[]", 0);
        if (this.props.questionId !== "") {
          savedBtnId.push(item.btn_id);
          formData.append("btn_id[]", item.btn_id);
        }
      } else {
        errors.push("Button Name is Required in Carousal");
      }
    });

    this.state.btnDetail.map((item) => {
      if (item.btn_text && item.btn_text.trim() !== "") {
        formData.append("link_type[]", "button");
        formData.append("btn_name[]", item.btn_text);
        formData.append("link[]", item.link || "");
        formData.append("new_tab[]", item.new_tab || "0");
        formData.append("description[]", "");
        formData.append("currency[]", "");
        formData.append("price[]", "");
        formData.append("status[]", 0);
        if (this.props.questionId !== "") {
          savedBtnId.push(item.btn_id);
          formData.append("btn_id[]", item.btn_id);
        }

        if (validURL(item.link)) {
          item.link = makeValidURL(item.link);
        } else if (item.link !== "") {
          errors.push("valid link required");
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
        formData.append("link_type[]", "button");
        formData.append("btn_name[]", item.btn_text);
        formData.append("link[]", item.link);
        formData.append("new_tab[]", item.new_tab);
        formData.append("description[]", "");
        formData.append("currency[]", "");
        formData.append("price[]", "");
        formData.append("status[]", 1); //deleted value status 1
        savedBtnId.push(item.btn_id);
        formData.append("btn_id[]", item.btn_id);
        if (item.image) {
          formData.append("image[]", item.image);
        }
        if (item.icon) {
          formData.append("icon[]", item.icon);
        }
      });
    }

    const textContent = html.replace(
      /<(?!img\s*\/?)(?!video\s*\/?)[^>]+>/g,
      ""
    );
    console.log("textContent", textContent);
    if (textContent && textContent.trim() === "") {
      errors.push("Chat Message is Required");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join(`\n`) });
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

  handleArrayObject = (event, val) => {
    const index = parseInt(event.currentTarget.dataset.index);
    const label = event.currentTarget.name || "price";
    const stateName = event.currentTarget.dataset.state || "btnDetail";
    const stateData = this.state[stateName];
    const value = typeof val === "undefined" ? event.currentTarget.value : val;
    this.setState(
      {
        [stateName]: [
          ...stateData.slice(0, index),
          {
            ...stateData[index],
            [label]: value,
          },
          ...stateData.slice(index + 1),
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
    const stateName = event.target.dataset.state || "btnDetail";
    const stateData = this.state[stateName];
    console.log("checked", event.target.checked);
    this.setState(
      {
        [stateName]: [
          ...stateData.slice(0, index),
          {
            ...stateData[index],
            [label]: event.target.checked ? 1 : 0,
          },
          ...stateData.slice(index + 1),
        ],
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  deleteArrayObject = (event) => {
    const index = parseInt(event.target.dataset.index);
    const stateName = event.target.dataset.state || "btnDetail";
    const stateData = this.state[stateName];
    const btnDetail = [...stateData];
    btnDetail.splice(index, 1);
    console.log("btnDetail", btnDetail);
    this.setState({
      [stateName]: btnDetail,
    });
  };

  handleArrayObjectImage = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    const FR = new FileReader();
    const stateName = event.target.dataset.state || "btnDetail";
    const stateData = this.state[stateName];
    FR.addEventListener("load", (evt) => {
      this.setState(
        {
          [stateName]: [
            ...stateData.slice(0, index),
            {
              ...stateData[index],
              [label]: evt.target.result,
            },
            ...stateData.slice(index + 1),
          ],
        },
        () => {
          this.refreshOptionTypes();
        }
      );
    });
    FR.readAsDataURL(event.target.files[0]);
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
    const Input = styled("input")({
      display: "none",
    });
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
                  <div className="option_component btn-group-style-section">
                    <label htmlFor="Chat Message">Carousal</label>
                    <div className="option_style_box btn-group-block">
                      <Container
                        dragHandleSelector=".drag_handle"
                        onDrop={(e) => {
                          this.setState(
                            {
                              carouselDetail: applyDrag(
                                this.state.carouselDetail,
                                e
                              ),
                            },
                            () => {
                              this.refreshOptionTypes();
                            }
                          );
                        }}
                      >
                        {this.state.carouselDetail.map((item, key) => {
                          return (
                            <Draggable key={key}>
                              <div className="option_repeat">
                                <div className="menu_box drag_handle">
                                  <img src={menu} className="noSelect" alt="" />
                                </div>
                                <div className="option_input_box">
                                  <div>
                                    <label className="option_label">
                                      Title {key + 1}
                                    </label>
                                    <div className="tab_label">
                                      <Form.Group controlId="formNewTabChekcbox">
                                        <Form.Check
                                          type="checkbox"
                                          label="New Tab"
                                          name="new_tab"
                                          data-index={key}
                                          data-state="carouselDetail"
                                          checked={item.new_tab === 1}
                                          onChange={this.handleArrayObjectCheck}
                                        />
                                      </Form.Group>
                                      <img
                                        src={trash}
                                        data-index={key}
                                        data-state="carouselDetail"
                                        onClick={this.deleteArrayObject}
                                      />
                                    </div>
                                  </div>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <FloatingLabel
                                        className="floating-input-field-block-cust"
                                        controlId="formCarouselText"
                                        label="Sample button"
                                      >
                                        <Form.Control
                                          type="text"
                                          placeholder="Sample button"
                                          name="btn_text"
                                          data-index={key}
                                          data-state="carouselDetail"
                                          value={item.btn_text}
                                          onChange={this.handleArrayObject}
                                        />
                                      </FloatingLabel>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <FloatingLabel
                                        controlId="floatingSelectCurrency"
                                        label="Currency"
                                        className="floating-select-field-block-cust"
                                      >
                                        <Form.Select
                                          name="currency"
                                          data-index={key}
                                          data-state="carouselDetail"
                                          value={item.currency}
                                          onChange={this.handleArrayObject}
                                          aria-label="Floating label select example"
                                        >
                                          <option value="USD">USD</option>
                                          <option value="EUR">EUR</option>
                                        </Form.Select>
                                      </FloatingLabel>
                                    </Grid>{" "}
                                    <Grid item xs={3}>
                                      <FloatingLabel
                                        className="floating-input-number-field-block-cust"
                                        controlId="floatingPassword"
                                        label="Amount"
                                      >
                                        <Form.Control
                                          placeholder="Amount"
                                          type="number"
                                          name="price"
                                          data-index={key}
                                          data-state="carouselDetail"
                                          value={item.price}
                                          onChange={(e) => {
                                            this.handleArrayObject(
                                              e,
                                              parseFloat(e.target.value)
                                            );
                                          }}
                                        />
                                        <div className="icon-block">
                                          <KeyboardArrowUpIcon
                                            name="price"
                                            data-index={key}
                                            data-state="carouselDetail"
                                            onClick={(e) => {
                                              this.handleArrayObject(
                                                e,
                                                parseFloat(item.price + 1)
                                              );
                                            }}
                                          />
                                          <KeyboardArrowDownIcon
                                            name="price"
                                            data-index={key}
                                            data-state="carouselDetail"
                                            onClick={(e) => {
                                              this.handleArrayObject(
                                                e,
                                                parseFloat(item.price - 1)
                                              );
                                            }}
                                          />
                                        </div>
                                      </FloatingLabel>
                                    </Grid>
                                    <Grid
                                      style={{ position: "relative" }}
                                      item
                                      xs={6}
                                    >
                                      <FloatingLabel
                                        className="floating-input-link-field-block-cust"
                                        controlId="formCarouselIcon"
                                        label="Link"
                                      >
                                        <div className="icon-block">
                                          <img src={link} alt="" />
                                        </div>
                                        <Form.Control
                                          type="text"
                                          placeholder="https://www.example.com"
                                          name="link"
                                          data-index={key}
                                          data-state="carouselDetail"
                                          value={item.link}
                                          onChange={this.handleArrayObject}
                                        />
                                      </FloatingLabel>
                                    </Grid>
                                    <Grid item xs={6}>
                                      {/* <Button className="upload_btn" variant="outlined">
                                <HiOutlineUpload />
                                Upload image
                              </Button> */}

                                      {/* <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        className="file-upload-btn-block"
                                      >
                                        <label htmlFor="contained-button-file">
                                          <Input
                                            accept="image/*"
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                          />
                                          <Button
                                            className="upload_btn"
                                            variant="outlined"
                                            component="span"
                                          >
                                            <HiOutlineUpload />
                                            Upload image
                                          </Button>
                                        </label>
                                      </Stack> */}
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
                                                  "contained-button-file" + key
                                                }
                                                // multiple
                                                type="file"
                                                data-state="carouselDetail"
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
                                            <li>Aspect Ratio: 16:9 </li>
                                            <li>
                                              Recommended size: 3840x2160 or
                                              1920x1080 pixels
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <textarea
                                        placeholder="Description"
                                        className="desc_textfield"
                                        name="description"
                                        data-index={key}
                                        data-state="carouselDetail"
                                        value={item.description}
                                        onChange={this.handleArrayObject}
                                      />
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
                          let tempObj = this.state.carouselDetail;
                          tempObj[this.state.carouselDetail.length] = {
                            btn_type: "carousal",
                            btn_id: 0,
                            btn_text: "",
                            currency: "USD",
                            price: parseFloat(0.0),
                            link: "",
                            image: "",
                            description: "",
                            status: 0,
                            new_tab: 0,
                          };
                          console.log(tempObj);
                          this.setState(
                            {
                              carouselDetail: tempObj,
                            },
                            () => {
                              this.refreshOptionTypes();
                            }
                          );
                        }}
                      >
                        <HiOutlinePlusSm />
                        Add next title
                      </Button>
                    </div>
                  </div>
                  <div className="option_component">
                    <label htmlFor="Chat Message">Chips</label>
                    <div className="option_style_box">
                      <Container
                        dragHandleSelector=".drag_handle"
                        onDrop={(e) => {
                          this.setState({
                            btnDetail: applyDrag(this.state.btnDetail, e),
                          });
                        }}
                      >
                        {this.state.btnDetail.map((item, key) => {
                          return (
                            <Draggable key={key}>
                              <div className="option_repeat">
                                <div className="menu_box drag_handle">
                                  <img src={menu} className="noSelect" alt="" />
                                </div>
                                <div className="option_input_box">
                                  <div>
                                    <label className="option_label">
                                      Button {key + 1}
                                    </label>
                                    <div className="tab_label">
                                      <Form.Group controlId="formCheckBtn">
                                        <Form.Check
                                          type="checkbox"
                                          label="New Tab"
                                          name="new_tab"
                                          data-index={key}
                                          data-state="btnDetail"
                                          checked={item.new_tab === 1}
                                          onChange={this.handleArrayObjectCheck}
                                        />
                                      </Form.Group>
                                      <img
                                        src={trash}
                                        data-index={key}
                                        data-state="btnDetail"
                                        onClick={this.deleteArrayObject}
                                      />
                                    </div>
                                  </div>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <FloatingLabel
                                        className="floating-input-field-block-cust"
                                        controlId="floatingPassword"
                                        label="Sample button"
                                      >
                                        <Form.Control
                                          type="text"
                                          placeholder="Sample button"
                                          name="btn_text"
                                          data-index={key}
                                          data-state="btnDetail"
                                          value={item.btn_text}
                                          onChange={this.handleArrayObject}
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
                                        controlId="formBtnLink"
                                        label="Link"
                                      >
                                        <div className="icon-block">
                                          <img src={link} alt="" />
                                        </div>
                                        <Form.Control
                                          type="text"
                                          placeholder="https://www.example.com"
                                          name="link"
                                          data-index={key}
                                          data-state="btnDetail"
                                          value={item.link}
                                          onChange={this.handleArrayObject}
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
                          let tempObj = this.state.btnDetail;
                          tempObj[this.state.btnDetail.length] = {
                            btn_type: "button",
                            btn_id: 0,
                            btn_text: "",
                            link: "",
                            new_tab: 0,
                            image: "",
                            description: "",
                            currency: "",
                            price: "0",
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
