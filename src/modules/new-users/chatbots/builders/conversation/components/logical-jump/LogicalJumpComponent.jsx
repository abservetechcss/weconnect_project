import { Button, Grid, MenuItem, Menu } from "@mui/material";
import React, { Component } from "react";
import menu from "../../../../../assets/images/userdash/Group 18691.svg";
import play from "../../../../../assets/images/userdash/play.svg";
import git from "../../../../../assets/images/userdash/git-pull-request.svg";
import eye from "../../../../../assets/images/userdash/eye.svg";
import edit from "../../../../../assets/images/userdash/edit-2.svg";
import copy from "../../../../../assets/images/userdash/copy.svg";
import trash from "../../../../../assets/images/userdash/trash-2.svg";
import arrow from "../../../../../assets/images/userdash/chevron-left (1).svg";
import basket from "../../../../../assets/images/shopping-basket.png";
import search from "../../../../../assets/images/userdash/search.svg";
import messageUser from "../../../../../assets/images/download.png";
import comp from "../../../../../assets/images/userdash/layout (5).svg";
import AddSimpleChatComponent from "../addPages/AddSimpleChatComponent";
import ShareComponent from "../main_component/ShareComponent";
import DesignComponent from "../main_component/DesignComponent";
import SettingsComponent from "../main_component/SettingsComponent";

export class LogicalJumpComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      component: false,
      chatBlock: true,
      flowChartBlock: true,
      addChatBlock: false,
      addSimpleChat: false,
      activeChat: 0,
      mainComponent: 1,
    };
  }

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

  render() {
    const open = Boolean(this.state.component);
    const theme = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 950,
          lg: 1024,
          xl: 1536,
        },
      },
    });
    return (
      <div className="knowledge_section">
        <div className="submain_header subknow_header">
          <p>
            <Button
              variant="text"
              className={this.state.mainComponent == 1 ? "active" : ""}
              onClick={() => {
                this.setState({
                  mainComponent: 1,
                });
              }}
            >
              1. Conversation
            </Button>
          </p>
          <div></div>
          <p>
            <Button
              variant="text"
              className={this.state.mainComponent == 2 ? "active" : ""}
              onClick={() => {
                this.setState({
                  mainComponent: 2,
                });
              }}
            >
              2. Design
            </Button>
          </p>
          <div></div>
          <p>
            <Button
              variant="text"
              className={this.state.mainComponent == 3 ? "active" : ""}
              onClick={() => {
                this.setState({
                  mainComponent: 3,
                });
              }}
            >
              3. Settings
            </Button>
          </p>
          <div></div>
          <p>
            <Button
              variant="text"
              className={this.state.mainComponent == 4 ? "active" : ""}
              onClick={() => {
                this.setState({
                  mainComponent: 4,
                });
              }}
            >
              4. Share
            </Button>
          </p>
        </div>
        {this.state.mainComponent == 1 ? (
          <>
            <ThemeProvider theme={theme}>
              <Grid container spacing={2}>
                <Grid item md={12} lg={5} sm={12} xs={12}>
                  <div className="knowledge_box">
                    {!this.state.addChatBlock ? (
                      <AddSimpleChatComponent
                        {...this.props}
                        handleCloseChatComponent={this.handleCloseChatComponent}
                      />
                    ) : (
                      <>
                        <div className="knowledge_header">
                          <p>Chat Questions</p>
                          <div
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={this.handleClickComponent}
                            className="add_comp_dropdown"
                          >
                            Add new component
                            <img src={arrow} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Grid>
                <Grid item md={12} lg={7} sm={12} xs={12}>
                  <div className="knowledge_box">
                    <div className="knowledge_subheader">Chat Preview</div>
                    {this.state.flowChartBlock ? (
                      <div className="basket-block">
                        <div className="blank-chat-section">
                          <p className="warning">No chat</p>
                          <p className="small-warning">
                            Chat will be shown once the component is added!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </ThemeProvider>
          </>
        ) : this.state.mainComponent == 2 ? (
          <>
            <DesignComponent />
          </>
        ) : this.state.mainComponent == 3 ? (
          <>
            <SettingsComponent />
          </>
        ) : this.state.mainComponent == 4 ? (
          <>
            <ShareComponent />
          </>
        ) : null}

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
                    <input placeholder="Search template.." type="search" />
                    <img src={search} />
                  </div>
                  <div className="component_main_box">
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(1);
                      }}
                    >
                      <img src={comp} />
                      <p>Simple message</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(2);
                      }}
                    >
                      <img src={comp} />
                      <p>Welcome card</p>
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(3);
                      }}
                    >
                      <img src={comp} />
                      <p>Open question</p>
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(4);
                      }}
                    >
                      <img src={comp} />
                      <p>Number</p>
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(5);
                      }}
                    >
                      <img src={comp} />
                      <p>Raibu (Setup live assistant)</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(6);
                      }}
                    >
                      <img src={comp} />
                      <p>Calendar date</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(7);
                      }}
                    >
                      <img src={comp} />
                      <p>E-mail request</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(8);
                      }}
                    >
                      <img src={comp} />
                      <p>Multi Choice</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(9);
                      }}
                    >
                      <img src={comp} />
                      <p>Multi Select</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(10);
                      }}
                    >
                      <img src={comp} />
                      <p>Carousal</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(11);
                      }}
                    >
                      <img src={comp} />
                      <p>Appointment</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(12);
                      }}
                    >
                      <img src={comp} />
                      <p>Phone number</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(13);
                      }}
                    >
                      <img src={comp} />
                      <p>Links</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(14);
                      }}
                    >
                      <img src={comp} />
                      <p>File Upload</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(15);
                      }}
                    >
                      <img src={comp} />
                      <p>Opinion scale</p>
                    </Button>
                    <Button
                      onClick={() => {
                        this.handleCloseComponent();
                        this.openComponent(16);
                      }}
                    >
                      <img src={comp} />
                      <p>Rating</p>
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="comp_modal_right">
                  <div>
                    <p className="comp_modal_right_heading">
                      Raibu (Setup live assistant)
                    </p>
                    <p className="comp_modal_right_text">
                      Let your audience seamlessly move from a bot to a live
                      video/chat conversation with one of your agents. Follow
                      the steps eg. Would you like to have a live chat or video
                      call with our executive? Visitor to get options as a
                      button. (Yes, No, Schedule later)
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
                </div>
              </Grid>
            </Grid>
          </div>
        </Menu>
      </div>
    );
  }
}

export default LogicalJumpComponent;
