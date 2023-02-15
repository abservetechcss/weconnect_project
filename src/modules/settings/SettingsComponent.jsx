import React, { Component, Fragment } from "react";
import { Button } from "@mui/material";
import { Row, Nav, Tab, Col } from "react-bootstrap";

import rightArrow from "../../assets/images/Path 46470.svg";
import bell from "../../assets/images/bell.svg";
import briefcase from "../../assets/images/userdash/briefcase.svg";
import NotificationSoundComponent from "./components/NotificationSoundComponent";
import LiveChatSettingComponent from "./components/LiveChatSettingComponent";
import TypingAnimationComponent from "./components/TypingAnimationComponent";
import UserManagementComponent from "./components/UserManagementComponent";
import SetupHumanComponent from "./components/SetupHumanComponent";
import user from "../../assets/images/userdash/users (1).svg";
import tool from "../../assets/images/userdash/tool (1).svg";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";



export class SettingsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTab: 0,
      activeSettingTab: 0,
      alert: null,
      loading: false
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="upgrade_plan_block">
          <p>
            Upgrade Plan
          </p>
          <Button
            type="button"
            onClick={() => {
              this.props.history.push(`/user/subscription`);
            }}
            variant="contained">Upgrade plan</Button>
        </div>
        <section className=" builder-component-section builder-share-section">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey={_this.state.activeSettingTab}
            value={_this.state.activeSettingTab}
          >
            <Row>
              <Col md={12} sm={12} xs={12} lg={3} className="pr-0">
                <Nav variant="pills" className="flex-column builder-tab-block">
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      onClick={() => {
                        _this.setState({
                          activeSettingTab: 0
                        });
                      }}
                      eventKey={0}
                    >
                      <span>
                        <img src={bell} className="arrow-icon" alt="" />
                        Notifications and sound
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      onClick={() => {
                        _this.setState({
                          activeSettingTab: 1
                        });
                      }}
                      eventKey={1}
                    >
                      <span>
                        <img src={briefcase} className="arrow-icon" alt="" />
                        Live chat settings
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      onClick={() => {
                        _this.setState({
                          activeSettingTab: 2
                        });
                      }}
                      eventKey={2}
                    >
                      <span>
                        <img src={briefcase} className="arrow-icon" alt="" />
                        Typing animation
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  {(localStorage.getItem("admin_type") === "agent")
                    ? null
                    :
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          _this.setState({
                            activeSettingTab: 3
                          });
                        }}
                        eventKey={3}
                      >
                        <span>
                          <img src={user} className="arrow-icon" alt="" />
                          User management
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                  }
                  <Nav.Item>
                    <Nav.Link
                      role="button"
                      onClick={() => {
                        _this.setState({
                          activeSettingTab: 4
                        });
                      }}
                      eventKey={4}
                    >
                      <span>
                        <img src={tool} className="arrow-icon" alt="" />
                        Setup human takeover
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={12} sm={12} xs={12} lg={9} className="pl-0">
                <Tab.Content className="right-tab-block">
                  {_this.state.activeSettingTab === 0 ? (
                    <Tab.Pane eventKey={0}>
                      <NotificationSoundComponent
                        _this={_this}
                        selectActiveTab={(value) => {
                          _this.setState({
                            activeSettingTab: value
                          });
                        }}
                        handleLoadingShow={(value) => {
                          _this.setState({
                            loading: value
                          });
                        }}
                        {..._this.props}
                      />
                    </Tab.Pane>
                  ) : _this.state.activeSettingTab === 1 ? (
                    <Tab.Pane eventKey={1}>
                      <LiveChatSettingComponent
                        _this={_this}
                        selectActiveTab={(value) => {
                          _this.setState({
                            activeSettingTab: value
                          });
                        }}
                        handleLoadingShow={(value) => {
                          _this.setState({
                            loading: value
                          });
                        }}
                        {..._this.props}
                      />
                    </Tab.Pane>
                  ) : _this.state.activeSettingTab === 2 ? (
                    <Tab.Pane eventKey={2}>
                      <TypingAnimationComponent
                        _this={_this}
                        selectActiveTab={(value) => {
                          _this.setState({
                            activeSettingTab: value
                          });
                        }}
                        handleLoadingShow={(value) => {
                          _this.setState({
                            loading: value
                          });
                        }}
                        {..._this.props}
                      />
                    </Tab.Pane>
                  ) : _this.state.activeSettingTab === 3 ? (
                    <Tab.Pane eventKey={3}>
                      <UserManagementComponent
                        _this={_this}
                        selectActiveTab={(value) => {
                          _this.setState({
                            activeSettingTab: value
                          });
                        }}
                        handleLoadingShow={(value) => {
                          _this.setState({
                            loading: value
                          });
                        }}
                        {..._this.props}
                      />
                    </Tab.Pane>
                  ) : _this.state.activeSettingTab === 4 ? (
                    <Tab.Pane eventKey={4}>
                      <SetupHumanComponent
                        _this={_this}
                        selectActiveTab={(value) => {
                          _this.setState({
                            activeSettingTab: value
                          });
                        }}
                        handleLoadingShow={(value) => {
                          _this.setState({
                            loading: value
                          });
                        }}
                        {..._this.props}
                      />
                    </Tab.Pane>
                  ) : null}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </section>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1
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

export default SettingsComponent;
