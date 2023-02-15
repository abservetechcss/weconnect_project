import React, { Component, Fragment } from "react";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  getTypingAnimationSettingList,
  updateAnimationSetting,
} from "../server/SettingServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert } from "../../../js/alerts";

const svgLoaders = [
  {
    name: "loader1",
    file: require("../../../assets/images/svg-loaders/loader1.svg")
      .ReactComponent,
  },
  {
    name: "loader2",
    file: require("../../../assets/images/svg-loaders/loader2.svg")
      .ReactComponent,
  },
  {
    name: "loader3",
    file: require("../../../assets/images/svg-loaders/loader3.svg")
      .ReactComponent,
  },
  {
    name: "loader4",
    file: require("../../../assets/images/svg-loaders/loader4.svg")
      .ReactComponent,
  },
  {
    name: "loader5",
    file: require("../../../assets/images/svg-loaders/loader5.svg")
      .ReactComponent,
  },
  {
    name: "loader6",
    file: require("../../../assets/images/svg-loaders/loader6.svg")
      .ReactComponent,
  },
  {
    name: "loader7",
    file: require("../../../assets/images/svg-loaders/loader7.svg")
      .ReactComponent,
  },
  {
    name: "loader8",
    file: require("../../../assets/images/svg-loaders/loader8.svg")
      .ReactComponent,
  },
  {
    name: "loader9",
    file: require("../../../assets/images/svg-loaders/loader9.svg")
      .ReactComponent,
  },
  {
    name: "loader10",
    file: require("../../../assets/images/svg-loaders/loader10.svg")
      .ReactComponent,
  },
  {
    name: "loader11",
    file: require("../../../assets/images/svg-loaders/loader11.svg")
      .ReactComponent,
  },
  {
    name: "loader12",
    file: require("../../../assets/images/svg-loaders/loader12.svg")
      .ReactComponent,
  },
  {
    name: "loader13",
    file: require("../../../assets/images/svg-loaders/loader13.svg")
      .ReactComponent,
  },
  {
    name: "loader14",
    file: require("../../../assets/images/svg-loaders/loader14.svg")
      .ReactComponent,
  },
  {
    name: "loader15",
    file: require("../../../assets/images/svg-loaders/loader15.svg")
      .ReactComponent,
  },
  {
    name: "loader16",
    file: require("../../../assets/images/svg-loaders/loader16.svg")
      .ReactComponent,
  },
  {
    name: "loader17",
    file: require("../../../assets/images/svg-loaders/loader17.svg")
      .ReactComponent,
  },
  {
    name: "loader18",
    file: require("../../../assets/images/svg-loaders/loader18.svg")
      .ReactComponent,
  },
  {
    name: "loader19",
    file: require("../../../assets/images/svg-loaders/loader19.svg")
      .ReactComponent,
  },
  {
    name: "loader20",
    file: require("../../../assets/images/svg-loaders/loader20.svg")
      .ReactComponent,
  },
  {
    name: "loader21",
    file: require("../../../assets/images/svg-loaders/loader21.svg")
      .ReactComponent,
  },
];

export default class LiveChatSettingComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      animationSetting: {
        choose_anime_checkbox: 0,
        anime_value: "",
        delay_time_checkbox: 0,
        delay_time_value: "",
      },
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getTypingAnimationSettingList(
      "",
      (res) => {
        let temp = res.typing_animation;
        _this.setState({
          animationSetting: temp,
        });
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.animationSetting));
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      setTimeout(() => {
        _this.props.handleLoadingShow(false);
      }, 3000);
      updateAnimationSetting(
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert(
            "Animation Setting Updated Successfully!",
            _this.props._this
          );
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(2);
        },
        (res) => {
          _this.setState({ loading: false });
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.animationSetting;
    newObj[e.target.name] = e.target.value;
    _this.setState({ animationSetting: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Typing animation</p>
            <p className="desc"></p>
          </div>
          <div className="main-block">
            {" "}
            <div className="type-animation-block">
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={
                    _this.state.animationSetting.choose_anime_checkbox == 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.animationSetting.choose_anime_checkbox == 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.animationSetting;
                    newObj.choose_anime_checkbox =
                      newObj.choose_anime_checkbox == 0 ? 1 : 0;
                    _this.setState({
                      animationSetting: newObj,
                    });
                  }}
                ></input>
                <div>
                  <p className="availability_title">Choose anime</p>
                  <p className="availability_text"></p>
                  <div className="loaders-block">
                    <div>
                      {svgLoaders.map((item, key) => {
                        const DynamicIcon = item.file;
                        return (
                          <div
                            type="button"
                            style={
                              _this.state.animationSetting.anime_value ===
                              item.name
                                ? {
                                    border: "1px solid #2d5dc9",
                                    padding: "5px",
                                  }
                                : {}
                            }
                            onClick={() => {
                              let temp = _this.state.animationSetting;
                              temp.anime_value = item.name;
                              _this.setState({ animationSetting: temp });
                            }}
                            className="loader"
                          >
                            <DynamicIcon />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={
                    _this.state.animationSetting.delay_time_checkbox == 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.animationSetting.delay_time_checkbox == 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.animationSetting;
                    newObj.delay_time_checkbox =
                      newObj.delay_time_checkbox == 0 ? 1 : 0;
                    _this.setState({
                      animationSetting: newObj,
                    });
                  }}
                ></input>
                <div>
                  <p className="availability_title">Set delay time</p>
                  <p className="availability_text"></p>
                  <div className="seconde-time">
                    <label htmlFor="Delay time">Delay time</label>
                    <div class="ms">
                      <input
                        type="number"
                        name="sec"
                        id="seconds"
                        value={_this.state.animationSetting.delay_time_value}
                        onChange={(e) => {
                          let newObj = _this.state.animationSetting;
                          if (parseInt(e.target.value) >= 0) {
                            newObj.delay_time_value = parseInt(e.target.value);
                            _this.setState({
                              animationSetting: newObj,
                            });
                          } else {
                            newObj.delay_time_value = 0;
                            _this.setState({
                              animationSetting: newObj,
                            });
                          }
                        }}
                      />
                      <div className="arrow-block">
                        <KeyboardArrowDownIcon
                          className="icon up"
                          onClick={() => {
                            let newObj = _this.state.animationSetting;
                            newObj.delay_time_value =
                              newObj.delay_time_value === ""
                                ? 0
                                : newObj.delay_time_value;

                            if (parseInt(newObj.delay_time_value) >= 0) {
                              newObj.delay_time_value =
                                parseInt(newObj.delay_time_value) + 1;
                              _this.setState({
                                animationSetting: newObj,
                              });
                            }
                          }}
                        />
                        <KeyboardArrowDownIcon
                          className="icon"
                          disabled={
                            _this.state.animationSetting.delay_time_value === 0
                          }
                          onClick={() => {
                            let newObj = _this.state.animationSetting;
                            newObj.delay_time_value =
                              newObj.delay_time_value === ""
                                ? 0
                                : newObj.delay_time_value;
                            if (parseInt(newObj.delay_time_value) > 0) {
                              newObj.delay_time_value =
                                parseInt(newObj.delay_time_value) - 1;
                              _this.setState({
                                animationSetting: newObj,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Button
              type="button"
              onClick={() => {
                _this.fetchDataFromServer();
              }}
              variant="outlined"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              variant="outlined"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
