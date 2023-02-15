import React, { Component, Fragment } from "react";
import DeviceViewComponent from "./DeviceViewComponent";
import desktop from "../../../../../assets/images/design/noun-laptop-1759565.svg";
import white_desktop from "../../../../../assets/images/white-laptop.svg";
import white_tab from "../../../../../assets/images/white-tab.svg";
import white_mobile from "../../../../../assets/images/white-mobile.svg";
import tab from "../../../../../assets/images/design/noun-tablet-1055704.svg";
import mobile from "../../../../../assets/images/design/smartphone (5).svg";
import line from "../../../../../assets/images/design/Line 1108.svg";
import refresh from "../../../../../assets/images/userdash/refresh-cw.svg";
import expand from "../../../../../assets/images/userdash/maximize-2.svg";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import minimize from "../../../../../assets/images/minimize-2.svg";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setChatPreview } from "../../../../../redux/actions/ReduxActionPage";

class ChatPreviewBox extends Component {
  constructor(props) {
    super(props);
    console.log("this.props.botIdURL", this.props.botIdURL);
    this.state = {
      responsive: "laptop",
      expand: false,
      iframeKey: Date.now() + Math.random(),
    };
    this.chatPreview = React.createRef();
  }

  componentDidMount() {
    this.initChatPreview();
  }

  initChatPreview() {
    if (this.chatPreview.current) {
      this.chatPreview.current.initChat();
    }
  }

  refreshChat = () => {
    if (window.WeConnect && window.WeConnect.refreshChat) {
      window.WeConnect.refreshChat();
    }
  };

  handleExpandPreview = () => {
    this.setState({
      expand: true,
    });
  };

  handleExpandClose = () => {
    this.setState({
      expand: false,
    });
  };

  previewRefreshChat = () => {
    // set new random key
    this.setState({
      iframeKey: Date.now() + Math.random(),
    });
  };

  render() {
    let _this = this;
    return (
      <div className="knowledge_box">
        <div className="knowledge_subheader">
          <p>Chat Preview {this.props.mode}</p>
          <div className="responsive-option-block">
            {this.state.responsive === "laptop" ? (
              <>
                <img
                  src={white_desktop}
                  role="button"
                  className="resp active"
                  alt=""
                  onClick={() => {
                    debugger;
                    _this.props.setchatPreviewType("desktop");
                    _this.setState(
                      {
                        responsive: "laptop",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={desktop}
                  className="resp"
                  role="button"
                  alt=""
                  onClick={() => {
                    debugger;
                    _this.props.setchatPreviewType("desktop");
                    this.setState(
                      {
                        responsive: "laptop",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            )}

            {this.state.responsive === "tab" ? (
              <>
                <img
                  src={white_tab}
                  className="resp active"
                  role="button"
                  alt=""
                  onClick={() => {
                    _this.props.setchatPreviewType("tablet");
                    this.setState(
                      {
                        responsive: "tab",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={tab}
                  className="resp"
                  role="button"
                  alt=""
                  onClick={() => {
                    _this.props.setchatPreviewType("tablet");
                    this.setState(
                      {
                        responsive: "tab",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            )}

            {this.state.responsive === "mobile" ? (
              <>
                <img
                  src={white_mobile}
                  className="resp active"
                  role="button"
                  alt=""
                  onClick={() => {
                    _this.props.setchatPreviewType("mobile");
                    this.setState(
                      {
                        responsive: "mobile",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={mobile}
                  className="resp"
                  role="button"
                  alt=""
                  onClick={() => {
                    _this.props.setchatPreviewType("mobile");
                    this.setState(
                      {
                        responsive: "mobile",
                      },
                      () => {
                        this.initChatPreview();
                      }
                    );
                  }}
                />
              </>
            )}
            <img alt="separator" src={line} />
            <IconButton
              onClick={() => {
                this.refreshChat();
              }}
            >
              <img alt="refresh" src={refresh} />
            </IconButton>
            <IconButton onClick={this.handleExpandPreview}>
              <img alt="expand" src={expand} />
            </IconButton>
          </div>
        </div>
        <div className="basket-block">
          <div className="blank-chat-section">
            <div className="blank_preview_skeleton">
              <Grid container sx={{ padding: "0px 50px" }}>
                <Box sx={{ width: "100%" }}>
                  <Skeleton
                    width="100%"
                    height="64px"
                    animation={false}
                  ></Skeleton>
                </Box>
                <Grid item xs={6}>
                  <Skeleton variant="rectangular" width="100%">
                    <div style={{ paddingTop: "57%" }} />
                  </Skeleton>

                  <Box sx={{ marginTop: 1 }}>
                    {new Array(7).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ marginTop: 3 }}>
                    <Skeleton
                      width="100%"
                      height="32px"
                      animation={false}
                    ></Skeleton>
                  </Box>
                  <Box sx={{ margin: 0 }}>
                    <Skeleton
                      width="60%"
                      height="32px"
                      animation={false}
                    ></Skeleton>
                  </Box>

                  <Box sx={{ marginTop: 0 }}>
                    {new Array(10).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ marginTop: 3 }}>
                    {new Array(10).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={6} sx={{ padding: "0px 20px" }}>
                  <Box xs={{ margin: 1 }}>
                    <Skeleton
                      width="100%"
                      height="32px"
                      animation={false}
                    ></Skeleton>
                  </Box>
                  <Box sx={{ margin: 0 }}>
                    <Skeleton
                      width="60%"
                      height="32px"
                      animation={false}
                    ></Skeleton>
                  </Box>

                  {new Array(5).fill(0).map(() => (
                    <Box xs={{ margin: 1 }}>
                      <Skeleton
                        width="100%"
                        height="16px"
                        animation={false}
                      ></Skeleton>
                    </Box>
                  ))}

                  <Box sx={{ marginTop: 3 }}>
                    {new Array(10).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ marginTop: 3 }}>
                    {new Array(10).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ marginTop: 3 }}>
                    {new Array(10).fill(0).map(() => (
                      <Box xs={{ margin: 1 }}>
                        <Skeleton
                          width="100%"
                          height="16px"
                          animation={false}
                        ></Skeleton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </div>
            <DeviceViewComponent
              ref={this.chatPreview}
              responsive={_this.state.responsive}
              mode={this.props.mode}
              botId={_this.props.botIdURL}
            />
          </div>
        </div>
        <Dialog
          open={this.state.expand}
          onClose={this.handleExpandClose}
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
                  <img src={refresh} alt="refresh" />
                </IconButton>
                <IconButton onClick={this.handleExpandClose}>
                  <img src={minimize} alt="minimize" />
                </IconButton>
              </div>
              {/* <span className="flow-chart-switch">
                <span>Flow Chart</span>
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
              </span> */}
            </div>
          </DialogTitle>
          <DialogContent sx={{ padding: "0px", marginBottom: "-60px" }}>
            <iframe
              title="WeConnect"
              src={
                process.env.REACT_APP_SCRIPT_BASE_URL +
                this.props.mode +
                "/?v=" +
                Date.now() +
                Math.random() +
                "&botId=" +
                window.btoa(this.props.botIdURL)
              }
              className="preview_iframe"
            />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const chatPreviewType = state.webchat.chatPreviewType || [];
  return {
    chatPreviewType,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setchatPreviewType: (data) => {
      dispatch(setChatPreview(data));
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChatPreviewBox);
