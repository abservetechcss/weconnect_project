import React, { Component, Fragment } from "react";
import backArrow from "../../../../../assets/images/chevron-left (1).svg";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import IconButton from "@mui/material/IconButton";
import LandingTabComponent from "./components/design_tab_component/LandingTabComponent";
import WidgetTabComponent from "./components/design_tab_component/WidgetTabComponent";
import EmbedTabComponent from "./components/design_tab_component/EmbedTabComponent";
import { Grid, Tab, Box } from "@mui/material";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { connect } from "react-redux";
import ChatPreviewBox from "./ChatPreviewBox";
import { decryptBot } from "../../../../../js/encrypt";
import DisableWidget from "../../../../common/DisableGlobalWidget";
const modes = {
  1: "landing",
  2: "widget",
  3: "embed",
}

export class BuilderDesignComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      activeDesignTab: ["landing", "widget", "embed"].includes(localStorage.getItem("builderDesignTab"))
            ? localStorage.getItem("builderDesignTab")
            : "landing",
      botIdURL: null,
      isHeaderTabActive: false,
      headerMessage: "",
      responsive: "laptop",
      activeLandingTab: 1,
      activeWidgetTab: 1,
      activeEmbedTab: 1,
      //landingTab
      landingLayout: 1,
      EmbedLayout: 1,
      widgetLayout: 1
    };
    this.chatPreviewRef = React.createRef();
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({ botIdURL: decryptedData && decryptedData.botId });
    }
  }
  refreshPreview() {
    if(this.chatPreviewRef.current && this.chatPreviewRef.current.initChatPreview) {
      this.chatPreviewRef.current.initChatPreview();
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
  fetchServerDesign() {
    if (window.WeConnect && window.WeConnect.webchatRef.current && window.WeConnect.webchatRef.current.getSettings) {
      window.WeConnect.webchatRef.current.getSettings();
    }
  }

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <DisableWidget />
        <div className="knowledge_section builder-design-section">
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12} lg={5}>
              <TabContext value={_this.state.activeDesignTab}>
                <div className="knowledge_box">
                  <div className="knowledge_section">
                    <section className="add-chat-block-section design_block_section">
                      <div className="knowledge_header">
                        {_this.state.isHeaderTabActive ? (
                          <>
                            <div className="d-flex align-items-center">
                              <IconButton
                                role="button"
                                onClick={() => {
                                  _this.fetchServerDesign();
                                  _this.setState({
                                    isHeaderTabActive: false,
                                    headerMessage: "",
                                    activeLandingTab: 1,
                                    activeWidgetTab: 1,
                                    activeEmbedTab: 1,
                                  });
                                }}
                              >
                                <img src={backArrow} alt="" />
                              </IconButton>
                              {_this.state.headerMessage}
                            </div>
                          </>
                        ) : (
                          <Box className="design_tabs">
                            <TabList
                              onChange={(tab) => {
                                  this.refreshPreview();
                                  
                                _this.setState({
                                  activeDesignTab: tab,
                                });
                              }}
                              aria-label="lab API tabs example"
                            >
                              <Tab
                                label="Landing Page"
                                value={"landing"}
                                  onClick={() => {
                                   localStorage.setItem("builderDesignTab", "landing");
                                  _this.setState({
                                    activeDesignTab: "landing",
                                  });
                                }}
                              />
                              <Tab
                                label="Widget"
                                value={"widget"}
                                  onClick={() => {
                                  localStorage.setItem("builderDesignTab", "widget");
                                  _this.setState({
                                    activeDesignTab: "widget",
                                  });
                                }}
                              />
                              <Tab
                                label="Embed"
                                value={"embed"}
                                  onClick={() => {
                                  localStorage.setItem("builderDesignTab", "embed");
                                  _this.setState({
                                    activeDesignTab: "embed"
                                  });
                                }}
                              />
                            </TabList>
                          </Box>
                        )}
                      </div>
                      <div className="main-section desing_panel_section">
                        <TabPanel value={"landing"}>
                          {_this.state.activeDesignTab === "landing" &&
                          _this.state.botIdURL !== null ? (
                            <LandingTabComponent
                              botIdURL={_this.state.botIdURL}
                              landingLayout={_this.state.landingLayout}
                              activeLandingTab={_this.state.activeLandingTab}
                              activeDesignTab={_this.state.activeDesignTab}
                              handleLoadingShow={(value) => {
                                _this.setState({
                                  loading: value,
                                });
                              }}
                              {..._this.props}
                              super_this={_this}
                            />
                          ) : null}
                        </TabPanel>
                        <TabPanel value={"widget"}>
                          {_this.state.activeDesignTab === "widget" &&
                          _this.state.botIdURL !== null ? (
                            <WidgetTabComponent
                              botIdURL={_this.state.botIdURL}
                              widgetLayout={_this.state.widgetLayout}
                              activeWidgetTab={_this.state.activeWidgetTab}
                              activeDesignTab={_this.state.activeDesignTab}
                              {..._this.props}
                              super_this={_this}
                              handleLoadingShow={(value) => {
                                _this.setState({
                                  loading: value,
                                });
                              }}
                            />
                          ) : null}
                        </TabPanel>
                        <TabPanel value={"embed"}>
                          {_this.state.activeDesignTab === "embed" &&
                          _this.state.botIdURL !== null ? (
                            <EmbedTabComponent
                              botIdURL={_this.state.botIdURL}
                              activeEmbedTab={_this.state.activeEmbedTab}
                              activeDesignTab={_this.state.activeDesignTab}
                              {..._this.props}
                              super_this={_this}
                              handleLoadingShow={(value) => {
                                _this.setState({
                                  loading: value,
                                });
                              }}
                            />
                          ) : null}
                        </TabPanel>
                      </div>
                    </section>
                  </div>
                </div>
              </TabContext>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={7}>
            <ChatPreviewBox ref={this.chatPreviewRef} mode={_this.state.activeDesignTab} botIdURL={_this.state.botIdURL} />
            </Grid>
          </Grid>
        </div>
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

export default connect(mapStateToProps, null)(BuilderDesignComponent);
