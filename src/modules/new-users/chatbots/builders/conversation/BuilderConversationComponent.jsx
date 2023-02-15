import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import {
  Button,
  Grid,
  Menu,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import refresh from "../../../../../assets/images/userdash/refresh-cw.svg";
import expand from "../../../../../assets/images/userdash/maximize-2.svg";
import arrow from "../../../../../assets/images/userdash/chevron-left (1).svg";
import basket from "../../../../../assets/images/shopping-basket.png";
import search from "../../../../../assets/images/userdash/search.svg";
import comp from "../../../../../assets/images/userdash/layout (5).svg";
import AddSimpleChatComponent from "../conversation/components/addPages/AddSimpleChatComponent.jsx";
import AddTextQuetionComponent from "../conversation/components/addPages/AddTextQuetionComponent";
import AddNumberComponent from "../conversation/components/addPages/AddNumberComponent";
import AddDateComponent from "../conversation/components/addPages/AddDateComponent";
import AddEmailComponent from "../conversation/components/addPages/AddEmailComponent";
import AddFileUploadComponent from "../conversation/components/addPages/AddFileUploadComponent";
import AddPhoneNumberComponent from "../conversation/components/addPages/AddPhoneNumberComponent";
import AddAppointmentComponent from "../conversation/components/addPages/AddAppointmentComponent";
import AddMultiChoiceComponent from "../conversation/components/addPages/AddMultiChoiceComponent";
import AddMultiSelectComponent from "../conversation/components/addPages/AddMultiSelectComponent";
import AddLinksComponent from "../conversation/components/addPages/AddLinksComponent";
import AddOpinionScaleComponent from "../conversation/components/addPages/AddOpinionScaleComponent";
import AddCarousalComponent from "../conversation/components/addPages/AddCarousalComponent";
import AddWelcomeCardComponent from "../conversation/components/addPages/AddWelcomeCardComponent";
import AddRaibuComponent from "../conversation/components/addPages/raibucomponent/AddRaibuComponent";
import AddRatingComponent from "../conversation/components/addPages/AddRatingComponent";
import AddNumberRangeComponent from "../conversation/components/addPages/AddNumberRangeComponent";

import ChatPreview from "./chatPreview";
import BuilderLogicalJumpComponent from "./BuilderLogicalJumpComponent.jsx";
import ChatBlock from "../conversation/components/chatBlock";
import { Container, Draggable } from "react-smooth-dnd";

import help from "../../../../../assets/images/help-circle.svg";
import minimize from "../../../../../assets/images/minimize-2.svg";
import img1 from "../../../../../assets/images/component/Group 20905.png";
import img2 from "../../../../../assets/images/builder/2.svg";
import img3 from "../../../../../assets/images/builder/3.png";
import img4 from "../../../../../assets/images/builder/4.png";
import img5 from "../../../../../assets/images/builder/5.png";
import img6 from "../../../../../assets/images/builder/6.png";
import img7 from "../../../../../assets/images/builder/7.png";
import img8 from "../../../../../assets/images/builder/8.png";
import img9 from "../../../../../assets/images/builder/9.png";
import img10 from "../../../../../assets/images/builder/10.png";
import img11 from "../../../../../assets/images/builder/11.png";
import img12 from "../../../../../assets/images/builder/12.png";
import img13 from "../../../../../assets/images/builder/13.png";
import img14 from "../../../../../assets/images/builder/14.png";
import img15 from "../../../../../assets/images/builder/15.png";
import img16 from "../../../../../assets/images/builder/16.png";
import img17 from "../../../../../assets/images/builder/17.png";

import FlowChartComponent from "./components/FlowChat/FlowChartComponent.jsx";
import {
  listComponent,
  deleteComponent,
  updateSequence,
  skipComponent,
  copyComponent,
} from "./BuilderConversaionServer";
import { connect } from "react-redux";
import { setBuilderComponent } from "../../../../../redux/actions/ReduxActionPage.jsx";
import { decryptBot } from "../../../../../js/encrypt";
import { AlertContext } from "../../../../common/Alert";

export class BuilderConversationComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      component: false,
      chatBlock: true,
      flowChartBlock: false,
      previewChatBlock: false,
      addChatBlock: false,
      addSimpleChat: false,
      activeChat: "",
      previewKey: 0,
      orderNo: 0,
      questionId: null,
      logicalJumpQueId: null,
      logicalJumpComType: "",
      logicalActiveMsg: "",
      delete: false,
      deleteData: {},
      flowChartModel: false,
      hoverShowSide: 1,
      botIdURL: this.props.botId,
      question_id: null,
      showLogicalJumpCom: false,
      list: [],
      insertMiddle: false,
      iframeEmbedUrl:
        process.env.REACT_APP_SCRIPT_BASE_URL +
        "embed/?botId=" +
        window.btoa(this.props.botId),
      componentList: [
        {
          type: "connect_agent",
          text: "Live Chat / Human Takeover",
        },
        {
          type: "message",
          text: "Simple message",
        },
        {
          type: "text_question",
          text: "Open question",
        },
        {
          type: "multi_choice",
          text: "Multi Choice",
        },
        {
          type: "number",
          text: "Number",
        },
        {
          type: "appointment",
          text: "Schedule Meeting",
        },
        {
          type: "welcome_card",
          text: "Welcome card",
        },

        {
          type: "date",
          text: "Calendar date",
        },
        {
          type: "email",
          text: "E-mail request",
        },

        {
          type: "multi_select",
          text: "Multi Select",
        },
        {
          type: "carousal",
          text: "Carousal",
        },

        {
          type: "phone_number",
          text: "Phone number",
        },
        {
          type: "links",
          text: "Share a Link",
        },
        {
          type: "file_upload",
          text: "File Upload",
        },
        {
          type: "opinion_scale",
          text: "Opinion scale",
        },
        {
          type: "rating",
          text: "Rating",
        },
        {
          type: "range",
          text: "Number Range",
        },
      ],
      componentSearch: "",
      fullScreenFlowChart: false
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleSkipComponent = this.handleSkipComponent.bind(this);
    this.handleCopyComponent = this.handleCopyComponent.bind(this);
    this.myRef = React.createRef();
    this.chatPreview = React.createRef();
  }
  handleClickComponent = (event) => {
    this.setState({
      component: event.currentTarget,
      insertMiddle: false,
      orderNo: this.state.list.length,
    });
  };

  handleInsertMiddle = (item) => {
    this.setState({
      component: true,
      insertMiddle: true,
      orderNo: item.order_no + 1,
    });
  };

  handleSearchComponent = (event) => {
    this.setState({
      componentSearch: event.target.value,
    });
  };
  handleCloseComponent = () => {
    this.setState({ component: null });
  };

  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     if (nextProps.widget !== prevState.widget) {
  //       console.log("widget", );
  //     if (nextProps.widget && nextProps.widget.webchatRef.current) {
  //         nextProps.widget.refreshChat();
  //       }
  //   }
  //   return null
  // }

  componentDidMount() {
    this.fetchDataFromServer();
    window.scrollTo(0, 0);
    if (this.chatPreview.current) {
      this.chatPreview.current.initChat();
    }
  }

  fetchDataFromServer(noRefresh) {
    const params = "bot_id=" + this.state.botIdURL;
    this.context.showLoading();
    listComponent(
      params,
      (res) => {
        this.context.showLoading(false);
        console.log("res", res);
        if (res.status === "True") {
          this.setState({
            list: res.list,
          });
        } else {
          this.setState({
            list: [],
          });
        }
        if (typeof noRefresh === "undefined") this.refreshChat();
      },
      (error) => {
        this.context.showLoading(false);
        if (typeof noRefresh === "undefined") this.refreshChat();
      }
    );
  }

  handleCloseChatComponent = () => {
    this.setState(
      {
        chatBlock: true,
        addChatBlock: false,
        addSimpleChat: false,
        activeChat: "",
        createdComponent: false,
      },
      () => {
        if (this.props.widget && this.props.widget.setPreviewMode)
          this.props.widget.setPreviewMode(false);
        this.fetchDataFromServer();
      }
    );
  };

  handleFlowChartModelOpen = () => {
    this.setState({
      flowChartModel: true,
      previewChatBlock: this.state.flowChartBlock
    });
  };
  handleFlowChartModelClose = () => {
    this.setState({
      flowChartModel: false,
    });
  };

  handleDelete = (deleteData) => {
    this.setState({
      delete: true,
      deleteData: deleteData,
    });
  };

  handleDeleteClose = () => {
    this.setState({
      delete: false,
    });
  };

  refreshChat = () => {
    if (this.state.flowChartBlock && this.state.activeChat === "") {
      this.fetchDataFromServer(true);
    } else {
      if (this.state.activeChat === "") {
        if (this.props.widget && this.props.widget.refreshChat) {
          this.props.widget.refreshChat();
        }
      } else if (this.props.widget && this.props.widget.webchatRef) {
        console.log("ref", this.myRef);
        this.props.widget.webchatRef.current.clearMessages();
        this.myRef.current.addChatMessagPreview();
      }
    }
  };

  previewRefreshChat = () => {
    if (this.state.previewChatBlock) {
      this.fetchDataFromServer(true);
    } else {
      this.setState({
        iframeEmbedUrl:
          process.env.REACT_APP_SCRIPT_BASE_URL +
          "embed/?v=" +
          Date.now() +
          Math.random() +
          "&botId=" +
          window.btoa(this.props.botId),
      });
    }
  };

  handleEditComponent = (editData, index) => {
    console.log("editData", editData);
    this.props.setBuilderComponent(editData).then(() => {
      if (this.props.widget && this.props.widget.webchatRef.current) {
        this.props.widget.webchatRef.current.clearMessages();
        this.props.widget.setPreviewMode(true);
      }
      this.setState({
        questionId: editData.questionId,
        chatBlock: false,
        addChatBlock: true,
        activeChat: editData.type,
        orderNo: editData.order_no,
      });
    });
  };

  handlePlay = (orderNo) => {
    console.log("ordreNo", orderNo);
    if (this.props.widget && this.props.widget.handlePlay) {
      this.props.widget.handlePlay(orderNo);
    }
  };

  handleDeleteComponent = () => {
    const deleteData = this.state.deleteData;
    // const params = {
    //   bot_id: deleteData.bot_id,
    //   question_id: deleteData.question_id,
    //   type: deleteData.type,
    // };
    const params = `bot_id=${deleteData.bot_id}&question_id=${deleteData.question_id}&type=${deleteData.type}`;
    this.context.showLoading();
    deleteComponent(
      params,
      (res) => {
        console.log("res", res);
        this.handleDeleteClose();
        if (res.status === "True") {
          const deletedList = this.state.list.filter((item) => {
            return item.question_id !== deleteData.question_id;
          });
          const myData = new FormData();
          myData.append("bot_id", this.props.botId);
          deletedList.forEach((item) => {
            myData.append("question_id[]", item.question_id);
          });
          if (deletedList.length > 0) {
            updateSequence(myData, (res) => {
              if (res.status === "True") {
                const updatedList = deletedList.map((item, i) => {
                  item.order_no = i;
                  return item;
                });
                this.setState({
                  list: updatedList,
                });
                this.refreshChat();
                this.context.showLoading(false);
              }
            });
          } else {
            this.refreshChat();
            this.setState({
              list: [],
            });
            this.context.showLoading(false);
          }
        } else {
          this.context.showLoading(false);
          this.fetchDataFromServer();
        }
      },
      (error) => {
        this.context.showLoading(false);
        this.handleDeleteClose();
      }
    );
  };

  handleSkipComponent = (item) => {
    const skip = item.skip === 1 ? 0 : 1;
    const sendData = {
      question_id: item.question_id,
      bot_id: this.state.botIdURL,
      enable: skip,
    };
    this.context.showLoading();
    skipComponent(
      sendData,
      (res) => {
        if (res.status === "True") {
          this.fetchDataFromServer();
        } else {
          this.context.showLoading(false);
        }
      },
      () => {
        this.context.showLoading(false);
      }
    );
  };

  handleCopyComponent = (item) => {
    const sendData = {
      question_id: item.question_id,
      bot_id: this.state.botIdURL,
    };
    this.context.showLoading();
    copyComponent(
      sendData,
      (res) => {
        if (res.status === "True") {
          this.fetchDataFromServer();
        } else {
          this.context.showLoading(false);
        }
      },
      () => {
        this.context.showLoading(false);
      }
    );
  };

  openComponent = (value) => {
    console.log("value", value);
    if (this.props.widget && this.props.widget.webchatRef.current) {
      this.props.widget.clearMessages();
      this.props.widget.setPreviewMode(true);
    }
    this.setState({
      chatBlock: false,
      addChatBlock: true,
      questionId: "",
      // addSimpleChat: false,
      activeChat: value,
    });
  };

  render() {
    let _this = this;
    const open = Boolean(this.state.component);
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

    let form = (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item md={12} lg={5} sm={12} xs={12}>
            {_this.state.showLogicalJumpCom ? (
              <div className="knowledge_box">
                {_this.state.botIdURL !== null &&
                  _this.state.logicalJumpQueId !== null ? (
                  <BuilderLogicalJumpComponent
                    _this={this}
                    botIdURL={_this.state.botIdURL}
                    logicalJumpComType={_this.state.logicalJumpComType}
                    logicalActiveMsg={_this.state.logicalActiveMsg}
                    logicalJumpQueId={_this.state.logicalJumpQueId}
                    handleCloseLogicalJumpModal={() => {
                      this.fetchDataFromServer();
                      _this.setState({
                        showLogicalJumpCom: false,
                      });
                    }}
                    handleLoadingShow={(value) => {
                      _this.setState({
                        loading: value,
                      });
                    }}
                    {..._this.props}
                    super_this={_this}
                  />
                ) : null}
              </div>
            ) : (
              <div className="knowledge_box">
                {this.state.addChatBlock ? (
                  this.state.activeChat === "message" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddSimpleChatComponent
                        botId={this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "welcome_card" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddWelcomeCardComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "text_question" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddTextQuetionComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "number" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddNumberComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "connect_agent" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddRaibuComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "date" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddDateComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "email" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddEmailComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "multi_choice" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddMultiChoiceComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "multi_select" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddMultiSelectComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "carousal" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddCarousalComponent
                        {...this.props}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        botId={this.state.botIdURL}
                        ref={this.myRef}
                      />
                    </>
                  ) : this.state.activeChat === "appointment" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddAppointmentComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "phone_number" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddPhoneNumberComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "links" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddLinksComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "file_upload" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddFileUploadComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "opinion_scale" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      {" "}
                      <AddOpinionScaleComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "rating" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddRatingComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : this.state.activeChat === "range" &&
                    _this.state.botIdURL !== null ? (
                    <>
                      <AddNumberRangeComponent
                        botId={_this.state.botIdURL}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                        type={this.state.activeChat}
                        orderNo={this.state.orderNo}
                        questionId={this.state.questionId}
                        refreshChat={this.refreshChat}
                        widget={this.props.widget}
                        ref={this.myRef}
                        insertMiddle={this.state.insertMiddle}
                      />
                    </>
                  ) : null
                ) : (
                  <>
                    <div className="knowledge_header">
                      <p>Chat Components</p>
                      <div
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={this.handleClickComponent}
                        className="add_comp_dropdown"
                      >
                        Add new component
                        <img src={arrow} alt="" />
                      </div>
                    </div>
                    <div className="builder_comp_section">
                      {!this.state.list || this.state.list.length === 0 ? (
                        <div className="basket-block">
                          <div className="blank-chat-section blank-chat-loader">
                            <img src={basket} alt="" />
                            <p className="warning">No new components added</p>
                            <p className="small-warning">
                              Chat will be shown once the component is added!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Ref: https://codesandbox.io/s/vertical-list-dgy2q?fontsize=14&hidenavigation=1&theme=dark&file=/index.js:1697-2800 */}
                          <Container
                            dragHandleSelector=".drag_handle"
                            animationDuration={500}
                            onDrop={(e) => {
                              const element = applyDrag(this.state.list, e);
                              console.log("element", element);
                              this.setState({
                                list: element,
                              });
                              const myData = new FormData();
                              myData.append("bot_id", this.props.botId);

                              element.forEach((item) => {
                                myData.append(
                                  "question_id[]",
                                  item.question_id
                                );
                              });
                              updateSequence(myData, (res) => {
                                if (res.status === "True") {
                                  const updatedList = element.map((item, i) => {
                                    item.order_no = i;
                                    return item;
                                  });
                                  this.setState({
                                    list: updatedList,
                                  });
                                  this.refreshChat();
                                }
                              });
                            }}
                          >
                            {this.state.list.map((item, index) => (
                              <Draggable key={index}>
                                <ChatBlock
                                  index={index}
                                  handleEditComponent={(editData) => {
                                    this.handleEditComponent(editData, index);
                                  }}
                                  handlePlay={this.handlePlay}
                                  handleInsertMiddle={this.handleInsertMiddle}
                                  handleSkipComponent={this.handleSkipComponent}
                                  handleCopyComponent={this.handleCopyComponent}
                                  handleDelete={this.handleDelete}
                                  hanleLoginCalJump={() => {
                                    _this.setState({
                                      logicalJumpQueId: item.question_id,
                                      logicalJumpComType: item.type,
                                      logicalActiveMsg: item.chat_message,
                                    });
                                    setTimeout(() => {
                                      _this.setState({
                                        showLogicalJumpCom: true,
                                      });
                                    }, 1000);
                                  }}
                                  item={item}
                                  {...this.props}
                                />
                              </Draggable>
                            ))}
                          </Container>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </Grid>
          <Grid item md={12} lg={7} sm={12} xs={12}>
            <div className="knowledge_box">
              <div className="knowledge_subheader">
                <p>Chat Preview</p>
                {/* <div>
                      <IconButton>
                        <img src={refresh} />
                      </IconButton>
                      <IconButton onClick={this.handleFlowChartModelOpen}>
                        <img src={expand} />
                      </IconButton>
                    </div> */}

                <div className="right-navi-block">
                  <div className="navigation-block">
                    <IconButton
                      onClick={() => {
                        this.refreshChat();
                      }}
                    >
                      <img src={refresh} alt="" />
                    </IconButton>
                    <IconButton onClick={this.handleFlowChartModelOpen}>
                      <img src={expand} alt="" />
                    </IconButton>
                  </div>
                  {!this.state.addChatBlock ? (
                    <>
                      <span className="flow-chart-switch">
                        <span>Flow Chart</span>
                        {/* <Form>
                            <Form.Check type="switch" id="custom-switch" />
                      </Form> */}
                        <span className="switch-btn">
                          <input
                            type="checkbox"
                            id="switch_flowchart"
                            name="check"
                            checked={this.state.flowChartBlock}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (!checked && this.chatPreview.current) {
                                this.chatPreview.current.initChat();
                              }
                              // if (!checked) {
                              //   this.refreshChat();
                              // }
                              this.setState({
                                flowChartBlock: checked,
                              });
                            }}
                          />
                          <label htmlFor="switch_flowchart">Toggle</label>
                        </span>
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="basket-block" style={{
                display:
                  this.state.flowChartBlock && this.state.activeChat === ""
                    ? "none"
                    : "block",
              }}>
                <div
                  className="blank-chat-section">
                  <ChatPreview
                    ref={this.chatPreview}
                    key={1}
                    mode="embed"
                    editMode="design"
                    widget={this.props.widget}
                    botId={_this.state.botIdURL}
                  />
                </div>{" "}
              </div>
              {this.state.flowChartBlock && this.state.activeChat === "" && (
                <div className="chat_preview_block5">
                  <div className="basket-block">
                    <div className="blank-chat-section flow-char-section">
                      <FlowChartComponent
                        list={this.state.list}
                        showFitView={true}
                        onFitView={() => {
                          _this.setState({
                            fullScreenFlowChart: true
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        <Menu
          id="basic-menu"
          anchorEl={this.state.component}
          open={open}
          onClose={this.handleCloseComponent}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          className="component_modal"
        >
          <div>
            <Grid container>
              <Grid item xs={6}>
                <div className="comp_modal_left">
                  <p className="comp_modal_left_heading">Select component</p>
                  <div className="search_box">
                    <input
                      value={this.state.componentSearch}
                      autoFocus
                      onChange={this.handleSearchComponent}
                      placeholder="Search Components.."
                      type="search"
                    />
                    <img src={search} alt="" />
                  </div>
                  <div className="component_main_box">
                    {this.state.componentList &&
                      this.state.componentList
                        .filter((item) => {
                          var regex = new RegExp(
                            this.state.componentSearch,
                            "gi"
                          );
                          if (item.text.match(regex)) return true;
                          return false;
                        })
                        .map((item, i) => {
                          return (
                            <Button
                              key={i}
                              onClick={() => {
                                this.handleCloseComponent();
                                setTimeout(
                                  () => this.openComponent(item.type),
                                  1000
                                );
                              }}
                              onMouseEnter={() => {
                                this.setState({
                                  hoverShowSide: item.type,
                                });
                              }}
                            >
                              <img src={comp} alt="" />
                              <p>{item.text}</p>
                            </Button>
                          );
                        })}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="comp_modal_right">
                  {this.state.hoverShowSide === "message" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Simple Message
                        </p>
                        <p className="comp_modal_right_text">
                          Greet visitors with simple message, GIFs and emojis
                          without asking for any response.
                          <br />
                          <br /> Eg. Hello there! Welcome to our website.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img1} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "welcome_card" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Welcome Card</p>
                        <p className="comp_modal_right_text">
                          Greet visitors with simple message, GIFs and emojis
                          without asking for any response.
                          <br />
                          <br /> Eg. Hello there! Welcome to our website.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img2} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "text_question" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Open Question
                        </p>
                        <p className="comp_modal_right_text">
                          Ask a simple text question and get the answer.
                          <br />
                          <br /> Eg. What is your birth place?
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img3} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "number" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Number</p>
                        <p className="comp_modal_right_text">
                          Ask for a numeric question. You can set minimum and
                          maximum digits accepted in response.
                          <br />
                          <br /> Eg. May I know your age?
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img4} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "connect_agent" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Raibu (Setup live assistant)
                        </p>
                        <p className="comp_modal_right_text">
                          Let your audience seamlessly move from a bot to a live
                          video/chat conversation with one of your agents.
                          Follow the steps in this component to setup Raibu
                          (Setup Live Assistant). Eg. Would you like to have a
                          live chat or video call with our executive? Visitor to
                          get options as a button. (Yes, No, Schedule later)
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img5} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "date" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Calendar Date
                        </p>
                        <p className="comp_modal_right_text">
                          Allow visitors to submit a date value. Calendar to be
                          shown to select the dates.
                          <br />
                          <br /> Eg. What is your birthdate?
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img6} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "email" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Email Request
                        </p>
                        <p className="comp_modal_right_text">
                          Ask for Valid email address.
                          <br />
                          <br /> *This is important field for capturing leads.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img7} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "multi_choice" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Multiple Choice
                        </p>
                        <p className="comp_modal_right_text">
                          Allow visitors to choose any one from multiple options
                          given.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img8} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "multi_select" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Multiple Select
                        </p>
                        <p className="comp_modal_right_text">
                          Allow visitors to choose more than one from multiple
                          options given.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img9} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "carousal" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Carousal</p>
                        <p className="comp_modal_right_text">
                          Show sliding carousal with images, title and
                          description.
                          <br />
                          <br /> Allow visitors to select any one from multiple
                          options given.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img10} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "appointment" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Schedule Meeting
                        </p>
                        <p className="comp_modal_right_text">
                          Ask your audience to book an appointment from given
                          slots.
                          <br />
                          <br /> Eg. When would you like to have a doctors
                          appointment
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img11} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "phone_number" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Phone Number</p>
                        <p className="comp_modal_right_text">
                          Allow visitors to submit a valid phone number.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img12} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "links" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Share a Link</p>
                        <p className="comp_modal_right_text">
                          Show button to visit external web links.
                          <br />
                          <br /> Eg. Click on the button to know more about us.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img13} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "file_upload" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">File Upload</p>
                        <p className="comp_modal_right_text">
                          Allow audience to upload a file from file explorer.
                          <br />
                          <br /> Eg. Click here to upload your resume
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img14} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "opinion_scale" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">
                          Opinion Scale
                        </p>
                        <p className="comp_modal_right_text">
                          Give audience a number scale to choose from.
                          <br /> Great for getting feedback on surveys.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img15} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "rating" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Rating</p>
                        <p className="comp_modal_right_text">
                          Ask audience to rate something on the scale of 5.
                          <br /> Stars or emojis will be shown to visitors for
                          rating as per the configuration.
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img16} alt="" />
                      </div>
                    </>
                  ) : this.state.hoverShowSide === "range" ? (
                    <>
                      <div>
                        <p className="comp_modal_right_heading">Number Range</p>
                        <p className="comp_modal_right_text">
                          Ask visitors to select range from a slider. <br />
                          <br />
                          Eg. What is your income range?
                        </p>
                      </div>
                      <div className="live_con_demo">
                        <img src={img17} alt="" />
                      </div>
                    </>
                  ) : null}
                </div>
                {/* <div className="comp_modal_right right_welcome">
                  <div>
                    <p className="comp_modal_right_heading">
                      Raibu (Setup live assistant)
                    </p>
                    <p className="comp_modal_right_text">
                      Let your audience seamlessly move from a bot to a live
                      video/chat conversation with one of your agents. Follow
                      the steps <br />
                      eg. Would you like to have a live chat or video call with
                      our executive? Visitor to get options as a button. (Yes,
                      No, Schedule later)
                    </p>
                  </div>
                  <div className="live_con_demo">
                    <div>
                      <img src={messageUser} />
                      <div></div>
                    </div>
                    <div className="live_chat_demo">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div> */}
              </Grid>
            </Grid>
          </div>
        </Menu>

        {this.state.fullScreenFlowChart && <Dialog
          open={true}
          fullScreen={true}
          sx={{
            "& .MuiPaper-root": {
              maxWidth: "initial !important",
            }
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Chat Preview</p>
            <div className="right-navi-block">
              <div className="navigation-block">
                <IconButton
                  onClick={() => {
                    this.previewRefreshChat();
                  }}
                >
                  <img src={refresh} alt="" />
                </IconButton>
                <IconButton onClick={() => {
                  _this.setState({
                    fullScreenFlowChart: false
                  })
                }}>
                  <img src={minimize} alt="" />
                </IconButton>
              </div>
            </div>
          </DialogTitle>
          <DialogContent sx={{ padding: "0px" }}>
            <FlowChartComponent
              list={this.state.list}
              showFitView={false}
            />
          </DialogContent>
        </Dialog>}

        <Dialog
          open={this.state.delete}
          onClose={this.handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete_popup"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Do you want to delete this component</p>
              <div className="info_box">
                <img src={help} alt="" />
                <div>
                  <Button
                    variant="contained"
                    className="no_btn"
                    onClick={() => {
                      this.handleDeleteClose();
                    }}
                  >
                    No
                  </Button>
                  <Button
                    variant="text"
                    className="yes_btn"
                    onClick={() => {
                      this.handleDeleteComponent();
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.flowChartModel}
          onClose={this.handleFlowChartModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Chat Preview</p>
            <div className="right-navi-block">
              <div className="navigation-block">
                <IconButton
                  onClick={() => {
                    this.previewRefreshChat();
                  }}
                >
                  <img src={refresh} alt="" />
                </IconButton>
                <IconButton onClick={this.handleFlowChartModelClose}>
                  <img src={minimize} alt="" />
                </IconButton>
              </div>
              <span className="flow-chart-switch">
                <span>Flow Chart</span>
                {/* <Form>
                  <Form.Check type="switch" id="custom-switch" />
                </Form> */}
                <span className="switch-btn">
                  <input
                    type="checkbox"
                    id="switch_model"
                    name="model_check"
                    checked={this.state.previewChatBlock}
                    onChange={(e) => {
                      this.setState({
                        previewChatBlock: e.target.checked,
                      });
                    }}
                  />
                  <label htmlFor="switch_model">Toggle</label>
                </span>
              </span>
            </div>
          </DialogTitle>
          <DialogContent sx={{ padding: "0px" }}>
            {this.state.previewChatBlock ? (
              <FlowChartComponent
                list={this.state.list}
                onFitView={() => {
                  _this.setState({
                    fullScreenFlowChart: true
                  })
                }}
              />
            ) : (
              <iframe
                title="WeConnect"
                src={this.state.iframeEmbedUrl}
                className="preview_iframe"
              />
            )}
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{ zIndex: "10000000000000000000000000000" }}
            open={true}
          >
            <div className="loader_main">
              <div className="item_loader">
                <Loader
                  type="box-rotate-x"
                  bgColor={"#32E0A1"}
                  title={"Please wait..."}
                  color={"#fff"}
                  size={100}
                />
              </div>
            </div>
          </Backdrop>
        )}
        {form}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  let botId = "";
  if (window.location.href.includes("?botId=")) {
    let data = window.location.href.split("?botId=")[1];
    var decryptedData = decryptBot(data);
    botId = decryptedData && decryptedData.botId;
  }

  const type = state.builder.type || "";
  const questionId = state.builder.questionId || "";
  return { botId, type, questionId };
}

function mapDispatchToProps(dispatch) {
  return {
    setBuilderComponent: (data) => {
      return dispatch(setBuilderComponent(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuilderConversationComponent);
