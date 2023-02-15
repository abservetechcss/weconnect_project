import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import acc from "../../../../assets/images/userdash/acc1.png";
import edit from "../../../../assets/images/userdash/edit-2.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getUserBasicInfoList,
  updateUserBasicInfo,
} from "../server/EditProfileServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert, errorAlert } from "../../../../js/alerts";
import { languageFlagList } from "../../../../variables/appVariables.jsx";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import { IconButton } from "@mui/material";
import { setUserProfile } from "../../../../redux/actions/ReduxActionPage.jsx";
import { connect } from "react-redux";
import spacetime from "spacetime";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class AgentBasicAccount extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      datetime: spacetime.now(),
      setImages: null,
      passwordToggle: true,
      user: {
        profile_picture: null,
        name: "",
        nick_name: "",
        email: "",
        password: "",
        timezone: "",
        language: "",
        google_calendar_checkbox: 0,
        apple_calendar_checkbox: 0,
        microsoft_calendar_checkbox: 0,
      },
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getUserBasicInfoList(
      "",
      (res) => {
        let temp = res.basicaccount;
        _this.props.setProfileData(temp);
        _this.setState({
          user: temp,
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
    let tempUser = JSON.parse(JSON.stringify(_this.state.user));
    if (_this.state.setImages !== null) {
      tempUser.profile_picture = _this.state.setImages;
    }
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      updateUserBasicInfo(
        _this.props._this,
        tempUser,
        (res) => {
          localStorage.removeItem("name");
          localStorage.setItem("name", tempUser.name);
          _this.props.handleLoadingShow(false);
          successAlert("User Profile Updated Successfully!", _this.props._this);
          setTimeout(() => {
            _this.fetchDataFromServer();
          }, 3000);
          _this.props.selectActiveTab(0);
        },
        (res) => {
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  handleProfileChange = (files) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0 && files[0].type.includes("image")) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }
      if ((FileLimit <= 500 && sizeType === "KB") || sizeType === "Bytes") {
        if (
          files[0].name.includes(".png") ||
          files[0].name.includes(".jpeg") ||
          files[0].name.includes(".jpg") ||
          files[0].name.includes(".svg")
        ) {
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              _this.setState({
                icon_files: files[0],
                setImages: reader.result,
                showIcon: true,
              });
            },
            false
          );
          reader.readAsDataURL(files[0]);
        } else {
          _this.setState({ icon_files: "", showIcon: false, setImages: null });
          errorAlert(
            `Please select a valid Image file type.`,
            _this.props._this
          );
        }
      } else {
        _this.setState({ icon_files: "", showIcon: false, setIcon: null });
        errorAlert(
          `Please select a category icon size less than or equal to 500KB.`,
          _this.props._this
        );
      }
    }
  };
  handleInputChange = (e) => {
    var newObj = this.state.user;
    newObj[e.target.name] = e.target && e.target.value;
    this.setState({ user: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Basic account</p>
            {/* <p className="desc">
              
            </p> */}
          </div>
          <div className="main-block ">
            <div className="basic-acc-block">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    type="file"
                    ref="uploadIcon"
                    style={{ display: "none" }}
                    onChange={(e) => _this.handleProfileChange(e.target.files)}
                    accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                  />
                  <div className="user_account_edit">
                    <img
                      className="acc_img"
                      src={
                        _this.state.setImages !== null
                          ? _this.state.setImages
                          : _this.state.user.profile_picture
                      }
                    />
                    <div
                      type="button"
                      onClick={() => this.refs.uploadIcon.click()}
                      className="edit_img"
                    >
                      <img src={edit} />
                    </div>

                    <div>
                      <p className="user_name">
                        {_this.state.user && _this.state.user.name}
                      </p>
                      {/* <p className="user_add">New York, USA</p> */}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel controlId="floatingInput" label="Name">
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={_this.state.user && _this.state.user.name}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "name",
                      _this.state.user && _this.state.user.name,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel controlId="floatingInput" label="Nickname">
                    <Form.Control
                      type="text"
                      placeholder="Nickname"
                      name="nick_name"
                      value={_this.state.user && _this.state.user.nick_name}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "nick name",
                      _this.state.user && _this.state.user.nick_name,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel controlId="floatingInput" label="Email">
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={_this.state.user && _this.state.user.email}
                      disabled
                    />
                  </FloatingLabel>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    className="floating-input-delete-field-block-cust"
                    controlId="floatingPassword"
                    label="Password"
                  >
                    <Form.Control
                      placeholder="Password"
                      type={this.state.passwordToggle ? "password" : "text"}
                      name="password"
                      value={_this.state.user && _this.state.user.password}
                      disabled
                    />

                    <div className="icon-block">
                      {this.state.passwordToggle ? (
                        <IconButton
                          onClick={() => {
                            this.setState({
                              passwordToggle: false,
                            });
                          }}
                        >
                          <VisibilityOffIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            this.setState({
                              passwordToggle: true,
                            });
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </div>
                  </FloatingLabel>

                  {/* <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                      placeholder="Password"
                      type={this.state.passwordToggle ? "password" : "text"}
                      name="password"
                      value={_this.state.user && _this.state.user.password}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel> */}
                </Grid>
                {/* <Grid item xs={1}>
                  <span
                    role="button"
                    onClick={() => {
                      this.setState({
                        passwordToggle: !this.state.passwordToggle
                      });
                    }}
                  >
                    {this.state.passwordToggle ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </span>
                </Grid> */}
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    // label="Language preference"
                    className="custom-selector-block"
                  >
                    <FormControl fullWidth className="">
                      <Select
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        name="language"
                        value={_this.state.user && _this.state.user.language}
                        onChange={this.handleInputChange}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="">
                          <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                            {/* Select language */}
                            Language preference
                          </p>
                        </MenuItem>
                        {languageFlagList &&
                          languageFlagList.length > 0 &&
                          languageFlagList.map((prop, i) => {
                            return (
                              <MenuItem key={i} value={prop.value}>
                                {` ${prop.label}`}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "language",
                      _this.state.user && _this.state.user.language,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Company timezone"
                    className="time-zone-block"
                  >
                    <TimezoneSelect
                      name="timezone"
                      value={_this.state.user && _this.state.user.timezone}
                      onChange={(time) => {
                        var newObj = _this.state.user;
                        newObj.timezone = time.value;
                        _this.setState({
                          user: newObj,
                        });
                      }}
                      timezones={{
                        ...allTimezones,
                        "America/Lima": "Pittsburgh",
                        "Europe/Berlin": "Frankfurt",
                      }}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "timezone",
                      _this.state.user && _this.state.user.timezone,
                      "required"
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
            {/* <div className="basic-acc-block">
              <p className="sync_title">Sync with Calendar</p>
              <p className="sync_text">
                
              </p>
              <FormGroup>
                <FormControlLabel
                  className="edit-checkbox"
                  control={
                    <Checkbox
                      value={
                        _this.state.user.google_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.user.google_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.user;
                        newObj.google_calendar_checkbox =
                          newObj.google_calendar_checkbox == 0 ? 1 : 0;
                        _this.setState({
                          user: newObj
                        });
                      }}
                    />
                  }
                  label="Google Calendar"
                />
                <FormControlLabel
                  className="edit-checkbox"
                  control={
                    <Checkbox
                      value={
                        _this.state.user.apple_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.user.apple_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.user;
                        newObj.apple_calendar_checkbox =
                          newObj.apple_calendar_checkbox == 0 ? 1 : 0;
                        _this.setState({
                          user: newObj
                        });
                      }}
                    />
                  }
                  label="Apple Calendar"
                />{" "}
                <FormControlLabel
                  className="edit-checkbox"
                  control={
                    <Checkbox
                      value={
                        _this.state.user.microsoft_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.user.microsoft_calendar_checkbox == 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.user;
                        newObj.microsoft_calendar_checkbox =
                          newObj.microsoft_calendar_checkbox == 0 ? 1 : 0;
                        _this.setState({
                          user: newObj
                        });
                      }}
                    />
                  }
                  label="Microsoft Calendar"
                />{" "}
              </FormGroup>
            </div> */}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setProfileData: (data) => {
      dispatch(setUserProfile(data));
    },
  };
};
export default connect(null, mapDispatchToProps)(AgentBasicAccount);
