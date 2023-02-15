import React, { Component, Fragment } from "react";
import {
  Autocomplete,
  Grid,
  Tab,
  Tabs,
  TextField,
  IconButton,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import share from "../../../../assets/images/Group 19585.svg";
import menu from "../../../../assets/images/Group 19584.svg";
import search from "../../../../assets/images/search (1).svg";
import { Form, Badge } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { connect } from "react-redux";
import { successAlert } from "../../../../js/alerts.js";
import { setNewVisitor } from "../../../../redux/actions/ReduxActionPage.jsx";
import { VisitorListComponent } from "./visitorListComponent";

function calculateScrollPercentage(target) {
  try {
    let bool = target === document;

    let scrollHeight = target.scrollHeight;

    if (!scrollHeight) throw "child element height not found";

    let clientHeight = bool ? window.innerHeight : target.clientHeight;
    let scrollTop = bool ? window.scrollY : target.scrollTop;

    let gottaScroll = scrollHeight - clientHeight;
    let percentage = Math.ceil((scrollTop / gottaScroll) * 100);

    return percentage;
  } catch (err) {
    console.error(err);
  }
}

export class LiverChatFilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisitorModal: false,
      visitorAnchorEl: null,
      menuChat: {},
    };
    this.onSelectChat = this.onSelectChat.bind(this);
    this.onSelectMore = this.onSelectMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.scrollRef = React.createRef(null);
  }

  updateMarkLeads = () => {
    let Obj = this.state.menuChat;
    let tempObj = {};
    tempObj.vistorid = Obj.vistor_id;
    tempObj.leads = Obj.leads === 1 ? 0 : 1;
    this.props.updateMarkLeads(tempObj);
  };

  onSelectChat(chat) {
    const currentAgentId = parseInt(localStorage.getItem("id"));
    this.props._this.setState(
      {
        selectedVisitor: true,
        activeVisitor: chat,
        nextPage: true,
        page: 0,
        messages: [],
      },
      () => {
        this.props._this.fetchSingleVisitorInfo();
        this.props.sendMessage({
          type: "chathistory",
          bot_id: chat.vistor_id.split("-")[0],
          client_id: chat.vistor_id,
          agent_id: currentAgentId,
        });
      }
    );
  }

  componentDidMount() {
    this.scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  onSelectMore(event, chat) {
    this.setState({
      showVisitorModal: true,
      visitorAnchorEl: event.currentTarget,
      menuChat: chat,
    });
  }

  onScroll(e) {
    let _this = this;
    let scrollPercentage = calculateScrollPercentage(e.target);
    // console.log("scrollPercentage", scrollPercentage);
    if (scrollPercentage > 80 && _this.props._this.state.nextPage) {
      _this.props.fetchDataFromServer("push");
    }
  }

  render() {
    let _this = this;
    const openVisitor = Boolean(_this.state.showVisitorModal);
    return (
      <Fragment>
        <Grid item md={12} lg={4} sm={12} xs={12}>
          <div className="live_conv_left">
            <div className="live_conv_top">
              <div className="live_conv_header">
                {!_this.props._this.state.showSearchFilterModal ? (
                  <>
                    <div className="w-50 align-items-center">
                      <div>
                        <p className="select_text">Selected Chat Interface</p>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          name="selectBotId"
                          isOptionEqualToValue={(option, value) =>
                            option.label === value
                          }
                          options={_this.props._this.state.botItemList}
                          value={_this.props._this.state.botName}
                          onChange={(e, option) => {
                            _this.props._this.setState(
                              {
                                botId: option.value,
                                botName: option.label,
                                nextPage: true,
                                page: 0,
                                messages: [],
                              },
                              () => {
                                _this.props.fetchDataFromServer(true);
                              }
                            );
                          }}
                          className="chat_bot_select"
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                    </div>

                    <div className="filter_icons">
                      <Tooltip title="Sort">
                        <a
                          role="button"
                          onClick={() => {
                            _this.props._this.setState(
                              {
                                orderFilter:
                                  _this.props.orderFilter === "asc"
                                    ? "desc"
                                    : "asc",
                                messages: [],
                                nextPage: true,
                                page: 0,
                              },
                              () => {
                                _this.props.fetchDataFromServer(true);
                              }
                            );
                          }}
                        >
                          <IconButton color="primary" component="span">
                            <img alt="" src={share} />
                          </IconButton>
                        </a>
                      </Tooltip>
                      <Tooltip title="Filter">
                        <IconButton
                          color="primary"
                          component="span"
                          id="basic-button"
                          aria-controls={
                            _this.props._this.state.filterModel
                              ? "basic-menu"
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            _this.props._this.state.filterModel
                              ? "true"
                              : undefined
                          }
                          onClick={(event) => {
                            _this.props._this.setState({
                              showFilterModal: true,
                              showFilterAnchorEl: event.currentTarget,
                            });
                          }}
                        >
                          <img alt="" src={menu} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Search">
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() => {
                            _this.props._this.setState({
                              showSearchFilterModal:
                                !_this.state.showSearchFilterModal,
                            });
                          }}
                        >
                          <img alt="" src={search} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </>
                ) : null}
                {_this.props._this.state.showSearchFilterModal ? (
                  <div className="filter-options">
                    <Form>
                      <Form.Group
                        // className=""
                        controlId="formBasicSearch"
                        className="input-block"
                      >
                        <Form.Control
                          type="text"
                          value={_this.props.searchKeyword}
                          placeholder="Search Here..."
                          onChange={(e) => {
                            _this.props._this.setState(
                              {
                                searchKeyword: e.target.value,
                              },
                              () => {
                                if (
                                  e.target.value &&
                                  e.target.value.length > 1
                                ) {
                                  _this.props.fetchDataFromServer({
                                    search: "search",
                                    searchkeyword: e.target.value,
                                  });
                                } else {
                                  _this.props.fetchDataFromServer(
                                    "searchclose"
                                  );
                                }
                              }
                            );
                          }}
                        />
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() => {
                            _this.props.fetchDataFromServer("searchclose");
                            _this.props._this.setState({
                              showSearchFilterModal: false,
                              searchKeyword: "",
                            });
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Form.Group>
                    </Form>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="live_conv_main">
              <Tabs
                value={_this.props._this.state.selectTab}
                onChange={(event, newValue) => {
                  _this.props._this.setState(
                    {
                      selectTab: newValue,
                      messages: [],
                      nextPage: true,
                      page: 0,
                      selectedVisitor: false,
                    },
                    () => {
                      _this.props.fetchDataFromServer(true);
                    }
                  );
                }}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                className="tab-block"
              >
                <Tab value="all" label="All" />
                <Tab value="chats" label="Chats" />
                <Tab value="videos" label="Videos" />
                <Tab value="assigned" label="Assigned to me" />
                <Tab value="leads" label="Leads" />
              </Tabs>
              <div
                className="visitor_notification"
                onScroll={this.onScroll}
                ref={this.scrollRef}
              >
                <Fragment>
                  {this.props.visitorList?.length > 0 ? (
                    Array.isArray(this.props.visitorList) ? (
                      this.props.visitorList?.map((prop, i) => {
                        const lastMessage =
                          i === 0 ? null : this.props.visitorList[i - 1];
                        const nextMessage =
                          i === this.props.visitorList.length - 1
                            ? null
                            : this.props.visitorList[i + 1];
                        // let unReadCount = this.props.unReadCount[prop.vistor_id]
                        //   ? this.props.unReadCount[prop.vistor_id]
                        //   : 0;

                        return (
                          <div key={i}>
                            <VisitorListComponent
                              chat={prop}
                              activeVisitorId={
                                _this.props.activeVisitor &&
                                _this.props.activeVisitor.vistor_id
                              }
                              onSelectChat={_this.onSelectChat}
                              onSelectMore={_this.onSelectMore}
                              onChatVisitorAction={
                                _this.props.chatWebscocketAction
                              }
                              unReadCount={this.props.unReadCount}
                              openVisitor={openVisitor}
                              lastMessage={lastMessage}
                              nextMessage={nextMessage}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        {this.props.visitorList}
                      </div>
                    )
                  ) : _this.props.loading ? (
                    <div className="text-center alert alert-danger">
                      Loading...
                    </div>
                  ) : (
                    <div className="text-center alert alert-danger">
                      No Data Found!
                    </div>
                  )}
                </Fragment>
              </div>
            </div>
          </div>
        </Grid>
        <Menu
          id="basic-menu"
          className="visitor-chat-model-block"
          anchorEl={this.state.visitorAnchorEl}
          // open={_this.state.showVisitorModal}
          open={_this.state.showVisitorModal}
          onClose={(e) => {
            _this.setState({
              showVisitorModal: false,
            });
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {this.state.menuChat.status !== "assign_to_me" &&
            this.state.menuChat.status !== "reject" &&
            this.state.menuChat.leads !== 1 &&
            this.state.menuChat.status !== "endchatrefresh" &&
            this.state.menuChat.status !== "to_accept" && (
              <MenuItem
                key="lead"
                onClick={(e) => {
                  _this.updateMarkLeads();
                  _this.setState({
                    showVisitorModal: false,
                  });
                }}
              >
                Mark as lead
              </MenuItem>
            )}

          {this.state.menuChat.status !== "assign_to_me" &&
            this.state.menuChat.status !== "reject" &&
            this.state.menuChat.leads === 1 &&
            this.state.menuChat.status !== "endchatrefresh" &&
            this.state.menuChat.status !== "to_accept" && (
              <MenuItem
                key="lead"
                onClick={(e) => {
                  _this.updateMarkLeads();
                  _this.setState({
                    showVisitorModal: false,
                  });
                }}
              >
                Remove from lead
              </MenuItem>
            )}

          {this.state.menuChat.accept === "assign_to_me" && (
            <MenuItem
              key="assign_to_me"
              onClick={(e) => {
                _this.setState({
                  showVisitorModal: false,
                });
                this.props.chatWebscocketAction(
                  "assign_to_me",
                  this.state.menuChat
                );
              }}
            >
              Assign to me
            </MenuItem>
          )}

          {this.state.menuChat.status !== "closed" &&
            this.state.menuChat.status !== "reject" &&
            this.state.menuChat.status !== "to_accept" &&
            this.state.menuChat.status !== "endchat" &&
            this.state.menuChat.status !== "assign_to_me" &&
            this.state.menuChat.status !== "endchatrefresh" && (
              <MenuItem
                key="end_chat"
                onClick={(e) => {
                  _this.setState({
                    showVisitorModal: false,
                  });
                  const currentAgentId = parseInt(localStorage.getItem("id"));
                  console.log("MenuChat", this.state.menuChat);
                  var data = {
                    type: "endchat",
                    bot_id: this.state.menuChat.vistor_id.split("-")[0],
                    client_id: this.state.menuChat.vistor_id,
                    agent_id: currentAgentId,
                  };
                  // console.log("dataSend", data);
                  _this.props.sendMessage(data);
                  // let reduxVisitorList = this.props.newVisitor;

                  // reduxVisitorList = reduxVisitorList.filter((item) => {
                  //   return item.vistor_id !== _this.state.menuChat.vistor_id;
                  // });
                  // this.props.setNewVisitor(reduxVisitorList);
                  // _this.props._this.setState({
                  //   selectedVisitor: false
                  // });
                  // update data will be get from database on websocket recive end
                }}
              >
                End chat
              </MenuItem>
            )}
        </Menu>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const newVisitor = state.webchat.newVisitor || [];
  const unReadCount = state.webchat.unReadCount || {};
  return {
    newVisitor,
    unReadCount,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setNewVisitor: (data) => {
      dispatch(setNewVisitor(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiverChatFilterComponent);

// export default LiverChatFilterComponent;
