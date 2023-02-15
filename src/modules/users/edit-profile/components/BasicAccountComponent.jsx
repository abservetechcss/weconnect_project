import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Button, Grid } from "@mui/material";
import acc from "../../../../assets/images/userdash/acc1.png";
import edit from "../../../../assets/images/userdash/edit-2.svg";
import deleteIcon from "../../../../assets/images/trash (1).svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getUserBasicInfoList,
  updateUserBasicInfo,
} from "../server/EditProfileServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert, errorAlert } from "../../../../js/alerts";
import { IconButton } from "@mui/material";
import { setUserProfile } from "../../../../redux/actions/ReduxActionPage.jsx";
import { connect } from "react-redux";

class BasicAccountComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      setImages: null,
      passwordToggle: true,
      user: {
        profile_picture: null,
        name: "",
        nick_name: "",
        email: "",
        password: "",
        API_secret_key: "",
      },
      showPassword: false,
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
        localStorage.setItem("picture", temp.profile_picture);
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmitProfile = () => {
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
          successAlert("User Profile Updated Successfully!", _this.props._this);

          _this.props.handleLoadingShow(false);
          localStorage.removeItem("name");
          localStorage.setItem("name", tempUser.name);
          _this.props.selectActiveTab(0);
          setTimeout(() => {
            _this.fetchDataFromServer();
          }, 10);
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
            <p className="desc">
              {/* Duis aute irure dolor in reprehenderit in voluptate velit */}
            </p>
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
                    {this.state.setImages || _this.state.user.profile_picture?<img
                      className="acc_img"
                      alt=""
                      src={
                        _this.state.setImages !== null
                          ? _this.state.setImages
                          : _this.state.user.profile_picture
                      }
                    /> :
                    <span className="sidebar-section"><span className="sidebar-text"><span className="user-block">
                      <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
                      }}
                    >
                    <span className="user-icon user-icon-margin" >
                          {localStorage.getItem("name") &&
                            localStorage.getItem("name").charAt(0).toUpperCase()}
                        </span>
                        </ListItemIcon></span></span></span>
                    }
                    <div
                      type="button"
                      onClick={() => this.refs.uploadIcon.click()}
                      className="edit_img"
                    >
                      <img src={edit} alt="" />
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
                    {/* <div className="icon-block">
                       {this.state.passwordToggle ? (
                         <IconButton
                           onClick={() => {
                             this.setState({
                               passwordToggle: false
                             });
                           }}
                         >
                           <VisibilityOffIcon />
                         </IconButton>
                       ) : (
                         <IconButton
                           onClick={() => {
                             this.setState({
                               passwordToggle: true
                             });
                           }}
                         >
                           <VisibilityIcon />
                         </IconButton>
                       )}
                     </div> */}
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
                    controlId="floatingPassword"
                    label="API secret key"
                  >
                    <Form.Control
                      type="text"
                      placeholder="API secret key"
                      name="API_secret_key"
                      value={
                        _this.state.user && _this.state.user.API_secret_key
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "api secret key",
                      _this.state.user && _this.state.user.API_secret_key,
                      "required"
                    )}
                  </div>
                </Grid>
              </Grid>
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
                _this.onSubmitProfile();
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
export default connect(null, mapDispatchToProps)(BasicAccountComponent);
