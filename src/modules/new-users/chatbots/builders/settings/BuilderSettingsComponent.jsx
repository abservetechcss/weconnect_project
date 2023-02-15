import React, { Component, Fragment } from "react";
import { Row, Nav, Tab, Col } from "react-bootstrap";
import rightArrow from "../../../../../assets/images/Path 46470.svg";
import setting from "../../../../../assets/images/userdash/settings (1).svg";
import edit from "../../../../../assets/images/userdash/edit.svg";
import user from "../../../../../assets/images/userdash/users (1).svg";
import tool from "../../../../../assets/images/userdash/tool (1).svg";
import bell from "../../../../../assets/images/userdash/bell.svg";
import sliders from "../../../../../assets/images/userdash/sliders.svg";
import focus from "../../../../../assets/images/crosshair.svg";
import database from "../../../../../assets/images/userdash/database.svg";
import trend from "../../../../../assets/images/userdash/trending-up-3.svg";
import cpu from "../../../../../assets/images/userdash/cpu.svg";
import book from "../../../../../assets/images/userdash/book-open.svg";

import GeneralSetupComponent from "./components/GeneralSetupComponent.jsx";
import UserManagementComponent from "./components/UserManagementComponent.jsx";
import SetupHumanComponent from "./components/SetupHumanComponent.jsx";
import NotificationComponent from "./components/NotificationComponent.jsx";
import WelcomeMsgComponent from "./components/WelcomeMsgComponent.jsx";
import WidgetComponent from "./components/WidgetComponent.jsx";
import DataManagementComponent from "./components/DataManagementComponent.jsx";
import TrackersComponent from "./components/TrackersComponent.jsx";
import SeoAndPerformanceComponent from "./components/SeoAndPerformanceComponent.jsx";
import IntegrationComponent from "./components/IntegrationComponent.jsx";
import KnowledgeComponent from "./components/KnowledgeComponent.jsx";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import { decryptBot } from "../../../../../js/encrypt";
import { FiCrosshair } from "react-icons/fi";
import { IntegrationAppProvider } from "@integration-app/react";
import { tokenGeneratorLink } from "./server/IntegrationServer";

export class BuilderSettingsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      activeSettingTab:
        parseInt(localStorage.getItem("builderMainMenu")) === 2
          ? parseInt(localStorage.getItem("builderSubMenu"))
          : 0,
      botIdURL: null,
      tokenId: "",
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({ botIdURL: decryptedData && decryptedData.botId });
      tokenGeneratorLink(
        "",
        (res) => {
          console.log(res);
          _this.setState({
            tokenId: res,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    let _this = this;
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);

      _this.setState({ botIdURL: decryptedData && decryptedData.botId });
    }
  }
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <Fragment>
          <section className=" builder-component-section builder-share-section">
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={_this.props.activeSettingTab}
              value={_this.props.activeSettingTab}
            >
              <Grid container>
                <Grid item md={12} sm={12} lg={4}>
                  <Nav
                    variant="pills"
                    className="flex-column builder-tab-block"
                  >
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 0);
                          _this.props.superThis.setState({
                            activeSettingTab: 0,
                          });
                        }}
                        eventKey={0}
                      >
                        <span>
                          <img src={edit} className="arrow-icon" alt="" />
                          General setup
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 3);
                          _this.props.superThis.setState({
                            activeSettingTab: 3,
                          });
                        }}
                        eventKey={3}
                      >
                        <span>
                          <img src={bell} className="arrow-icon" alt="" />
                          Notifications
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 4);
                          _this.props.superThis.setState({
                            activeSettingTab: 4,
                          });
                        }}
                        eventKey={4}
                      >
                        <span>
                          <img src={sliders} className="arrow-icon" alt="" />
                          Multi-Lingual Configuration (Coming Soon)
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 5);
                          _this.props.superThis.setState({
                            activeSettingTab: 5,
                          });
                        }}
                        eventKey={5}
                      >
                        <span>
                          {/* <img src={focus} className="arrow-icon" alt="" /> */}
                          <FiCrosshair style={{ marginRight: "11px" }} />
                          Widget settings
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 6);
                          _this.props.superThis.setState({
                            activeSettingTab: 6,
                          });
                        }}
                        eventKey={6}
                      >
                        <span>
                          <img src={database} className="arrow-icon" alt="" />
                          Data management (Coming Soon)
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 8);
                          _this.props.superThis.setState({
                            activeSettingTab: 8,
                          });
                        }}
                        eventKey={8}
                      >
                        <span>
                          <img src={sliders} className="arrow-icon" alt="" />
                          Seo and Performance monitoring
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 9);
                          _this.props.superThis.setState({
                            activeSettingTab: 9,
                          });
                        }}
                        eventKey={9}
                      >
                        <span>
                          <img src={cpu} className="arrow-icon" alt="" />
                          Integrations
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role="button"
                        onClick={() => {
                          localStorage.setItem("builderSubMenu", 10);
                          _this.props.superThis.setState({
                            activeSettingTab: 10,
                          });
                        }}
                        eventKey={10}
                      >
                        <span>
                          <img src={book} className="arrow-icon" alt="" />
                          Knowledge Base
                        </span>
                        <img src={rightArrow} className="arrow-icon" alt="" />
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Grid>
                <Grid item md={12} sm={12} lg={8}>
                  <Tab.Content className="right-tab-block builder-settings-block">
                    {_this.props.activeSettingTab === 0 &&
                    _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={0}>
                        <GeneralSetupComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 1 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={1}>
                        <UserManagementComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 2 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={2}>
                        <SetupHumanComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 3 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={3}>
                        <NotificationComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 4 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={4}>
                        <WelcomeMsgComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 5 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={5}>
                        <WidgetComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 6 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={6}>
                        <DataManagementComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 7 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={7}>
                        <TrackersComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 8 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={8}>
                        <SeoAndPerformanceComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 9 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={9}>
                        <IntegrationAppProvider token={_this.state?.tokenId}>
                          <IntegrationComponent
                            botIdURL={_this.state.botIdURL}
                            {..._this.props}
                            _this={_this}
                          />
                        </IntegrationAppProvider>
                      </Tab.Pane>
                    ) : _this.props.activeSettingTab === 10 &&
                      _this.state.botIdURL !== null ? (
                      <Tab.Pane eventKey={10}>
                        <KnowledgeComponent
                          botIdURL={_this.state.botIdURL}
                          {..._this.props}
                          _this={_this}
                        />
                      </Tab.Pane>
                    ) : null}
                  </Tab.Content>
                </Grid>
              </Grid>
            </Tab.Container>
          </section>
        </Fragment>
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
const mapStateToProps = (state) => ({
  selectBotList: state.getSelectBotIdDetails.selectBotList,
});

export default connect(mapStateToProps, null)(BuilderSettingsComponent);
