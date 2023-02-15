import React, { Component, Fragment } from "react";
import {
  Button,
  Grid,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Select,
  Tooltip,
  DialogContent,
  DialogContentText,
  Dialog,
  IconButton
} from "@mui/material";
import crossX from "../../../assets/images/x.svg";
import heart from "../../../assets/images/userdash/heart (1).svg";
import heart2 from "../../../assets/images/userdash/heart (2).svg";
import premium from "../../../assets/images/userdash/Path 46496.svg";
import search from "../../../assets/images/userdash/search.svg";
import line from "../../../assets/images/userdash/Line 1194.svg";
// import desktop from "../../../assets/images/design/noun-laptop-1759565.svg";
// import desktopwhite from "../../../assets/images/noun-laptop-1759565.svg";
// import tab from "../../../assets/images/design/noun-tablet-1055704.svg";
// import tabwhite from "../../../assets/images/noun-tablet-1055704.svg";
// import mobile from "../../../assets/images/design/smartphone (5).svg";
// import mobilewhite from "../../../assets/images/smartphone (5).svg";
import { FloatingLabel, Form, Tab } from "react-bootstrap";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import TemplateCategoryComponent from "./components/TemplateCategoryComponent.jsx";
import {
  getCategoryCountList,
  getTemplateFilterList,
  templateLikeStatus,
  CreateUseTemplate
} from "./server/TemplateServer.js";
import { getIndustryList } from "./server/IndustryServer.js";
import { getCategoriesList } from "./server/CategoryServer.js";
import { successAlert } from "../../../js/alerts.js";
import DeviceViewComponent from "./components/DeviceViewComponent";
import { encryptBot, decryptBot } from "../../../js/encrypt";

export class TemplatesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      activePreview: {},
      loading: false,
      categoryLoading: true,
      activeTemplatesTab: 1,
      activeTabValue: "All",
      showPreviewModal: false,
      categoryName: "all",
      featured: "All",
      designView: "laptop",
      industryName: "",
      templateName: "",
      sortFilter: "A-Z",
      likes: 0,
      data: [],
      resultData: [],
      categoryList: [],
      industryList: [],
      id: null,
      botName:"",
    };
    this.chatPreview = React.createRef();
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    _this.fetchCategoryCountList();
    _this.fetchIndustryList();
  }
  fetchDataFromServer = () => {
    let _this = this;
    let params = ``;
    _this.setState({ loading: true });
    if (_this.state.resultData && _this.state.resultData.length > 0) {
      let tempObj = [];
      tempObj =
        _this.state.resultData &&
        _this.state.resultData.length > 0 &&
        _this.state.resultData
          .filter((x) => {
            return (
              (_this.state.activeTabValue === "All"
                ? true
                : x.template_compatibility === _this.state.activeTabValue) &&
              (_this.state.categoryName === "all"
                ? true
                : x.category === _this.state.categoryName) &&
              (_this.state.industryName === ""
                ? true
                : x.industry === _this.state.industryName) &&
              (_this.state.featured === "All"
                ? true
                : _this.state.featured === "Free"
                ? x.free === 1
                : x.premium === 1) && (
                _this.state.likes === 0
                  ? true
                  :
              x.user_already_liked === _this.state.likes)&&
              (_this.state.templateName === ""
                ? true
                : x.template_name
                    .toLowerCase()
                    .includes(_this.state.templateName.toLowerCase()))
            );
          })
          .map((prop) => {
            prop.description =
              prop.description === undefined ? "---" : prop.description;
            return prop;
          });
      let newObj = [];
      if (_this.state.sortFilter === "A-Z") {
        newObj = tempObj.sort((a, b) => {
          return a.template_name
            .toLowerCase()
            .localeCompare(b.template_name.toLowerCase());
        });
      } else if (_this.state.sortFilter === "Z-A") {
        newObj = tempObj.sort((a, b) => {
          return b.template_name
            .toLowerCase()
            .localeCompare(a.template_name.toLowerCase());
        });
      } else {
        newObj = tempObj;
      }
      _this.setState({
        loading: false,
        data: newObj
      });
    } else {
      getTemplateFilterList(
        params,
        (res) => {
          let tempObj = [];
          tempObj =
            res.templatelist &&
            res.templatelist.length > 0 &&
            res.templatelist
              .filter((x) => {
                return (
                  (_this.state.activeTabValue === "All"
                    ? true
                    : x.template_compatibility ===
                      _this.state.activeTabValue) &&
                  (_this.state.categoryName === "all"
                    ? true
                    : x.category === _this.state.categoryName) &&
                  (_this.state.industryName === ""
                    ? true
                    : x.industry === _this.state.industryName) &&
                  (_this.state.featured === "All"
                    ? true
                    : _this.state.featured === "Free"
                    ? x.free === 1
                    : x.premium === 1) &&
                  (_this.state.likes === 0
                    ? true
                    : x.user_already_liked === _this.state.likes) &&
                  (_this.state.templateName === ""
                    ? true
                    : x.template_name
                        .toLowerCase()
                        .includes(_this.state.templateName.toLowerCase()))
                );
              })
              .map((prop) => {
                prop.description =
                  prop.description === undefined ? "---" : prop.description;
                return prop;
              });
          let newObj = [];
          if (_this.state.sortFilter === "A-Z") {
            newObj = tempObj.sort((a, b) => {
              return a.template_name
                .toLowerCase()
                .localeCompare(b.template_name.toLowerCase());
            });
          } else if (_this.state.sortFilter === "Z-A") {
            newObj = tempObj.sort((a, b) => {
              return b.template_name
                .toLowerCase()
                .localeCompare(a.template_name.toLowerCase());
            });
          }  else {
            newObj = tempObj;
          }
          _this.setState({
            loading: false,
            data: newObj,
            resultData: newObj
          });
        },
        () => {
          _this.setState({ loading: false });
        }
      );
    }
  };
  fetchCategoryCountList = () => {
    let _this = this;
    let params = ``;
    getCategoriesList(
      "",
      (res) => {
        let newObj = [{ id: null, name: "all", value: null }];

        res.category &&
          res.category.length > 0 &&
          res.category.map((prop) => {
            newObj.push({
              id: prop.id,
              name: prop.category_name,
              value: prop.id
            });
          });
        if (newObj && newObj.length > 0) {
          getCategoryCountList(
            params,
            (res) => {
              let tempObj = newObj.map((prop) => {
                prop.count =
                  Object.keys(res.category_list_count) &&
                  Object.keys(res.category_list_count).length > 0 &&
                  Object.keys(res.category_list_count)
                    .filter((x) => {
                      return x === prop.name;
                    })
                    .map((prop1) => {
                      return res.category_list_count[prop1];
                    });
                return prop;
              });

              _this.setState({
                categoryLoading: false,
                categoryList: tempObj
              });
            },
            () => {
              _this.setState({ categoryLoading: false });
            }
          );
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  fetchIndustryList = () => {
    let _this = this;
    getIndustryList(
      "",
      (res) => {
        let tempObj =
          res.industry &&
          res.industry.length > 0 &&
          res.industry.map((prop) => {
            return {
              id: prop.id,
              label: prop.industry_name,
              value: prop.id
            };
          });
        _this.setState({
          loading: false,
          industryList: tempObj
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  useTemplateAPI = (id,name) => {
    let _this = this;
    let temp = {};
    temp.id = id;
    _this.setState({
      loading: true
    });
    CreateUseTemplate(
      temp,
      (res) => {
        console.log("useT",res)
        successAlert("Template used successfully!", _this);
        _this.setState({
          showPreviewModal: false,
          loading: false
        });
        const encData = encryptBot(res.bot_id, name);
        setTimeout(() => {
          _this.props.history.push(`/user/chatbots/builder?botId=${encData}`);
        }, 3000);

      },
      (res) => {}
    );
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="templates_section">
          <div className="submain_header template_header">
            <div className="templates_tabs">
              <div
                role="button"
                onClick={() => {
                  _this.setState({
                    activeTemplatesTab: 1,
                    activeTabValue: "All"
                  });
                  setTimeout(() => {
                    _this.fetchDataFromServer();
                  }, 1000);
                }}
                className={
                  _this.state.activeTemplatesTab === 1
                    ? "temp_deactive temp_active"
                    : "temp_deactive"
                }
              >
                <p>All</p>
              </div>
              <img alt="" src={line} />
              <div
                role="button"
                onClick={() => {
                  _this.setState({
                    activeTemplatesTab: 2,
                    activeTabValue: "Web"
                  });
                  setTimeout(() => {
                    _this.fetchDataFromServer();
                  }, 1000);
                }}
                className={
                  _this.state.activeTemplatesTab === 2
                    ? "temp_deactive temp_active"
                    : "temp_deactive"
                }
              >
                <p>Web</p>
              </div>
              <img src={line} alt="" />
              <p
                role="button"
                onClick={() => {
                  _this.setState({
                    activeTemplatesTab: 3,
                    activeTabValue: "WhatsApp"
                  });
                  setTimeout(() => {
                    _this.fetchDataFromServer();
                  }, 1000);
                }}
                className={
                  _this.state.activeTemplatesTab === 3
                    ? "temp_deactive temp_active"
                    : "temp_deactive"
                }
              >
                Whatsapp
              </p>
              <img src={line} alt=""/>
              <p
                role="button"
                onClick={() => {
                  _this.setState({
                    activeTemplatesTab: 4,
                    activeTabValue: "Facebook"
                  });
                  setTimeout(() => {
                    _this.fetchDataFromServer();
                  }, 1000);
                }}
                className={
                  _this.state.activeTemplatesTab === 4
                    ? "temp_deactive temp_active"
                    : "temp_deactive"
                }
              >
                Facebook
              </p>
            </div>
            <div className="search_box">
              <input
                placeholder="Search template.."
                type="search"
                value={_this.state.templateName}
                onChange={(e) => {
                  _this.setState({
                    templateName: e.target.value
                  });
                }}
              />
              <img
                role="button"
                onClick={() => {
                  _this.fetchDataFromServer();
                }}
                alt=""
                src={search}
              />
            </div>
          </div>
          <div className="templates_block">
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={_this.state.activeTemplatesTab}
            >
              <TemplateCategoryComponent
              loading={_this.state.categoryLoading}
                categoryList={_this.state.categoryList}
                _this={_this}
                categoryName={_this.state.categoryName}
                fetchDataFromServer={() => {
                  _this.fetchDataFromServer();
                }}
                {..._this.props}
              />
              <div className="select_template_section">
                {" "}
                <div className="select_template_header">
                  <div>
                    <p className="select_template_title">
                      Select your template
                    </p>
                    <p className="select_template_text">
                      Pick the template and create a smooth experience
                    </p>
                  </div>
                  <div className="temp_filter_section">
                    <p className="fav_text">
                      {_this.state.likes === 0 ? (
                        <img
                          alt=""
                          onClick={() => {
                            _this.setState({
                              likes: 1,
                              resultData: []
                            });
                            setTimeout(() => {
                              _this.fetchDataFromServer();
                            }, 1000);
                          }}
                          src={heart2}
                        />
                      ) : (
                        <img
                          alt=""
                          onClick={() => {
                            _this.setState({
                              likes: 0,
                              resultData: []
                            });
                            setTimeout(() => {
                              _this.fetchDataFromServer();
                            }, 1000);
                          }}
                          src={heart}
                        />
                      )}
                      Favourites
                    </p>

                    <FloatingLabel
                      controlId="floatingSelect"
                      label="Industries"
                      className="floating-select-field-block-cust w-auto"
                      name="industry"
                    >
                      <Form.Select
                        aria-label="Floating label select example"
                        value={_this.state.industryName}
                        onChange={(e) => {
                          _this.setState({
                            industryName: e.target.value
                          });
                          setTimeout(() => {
                            _this.fetchDataFromServer();
                          }, 1000);
                        }}
                      >
                        <option value={""}>Select</option>
                        {_this.state.industryList &&
                          _this.state.industryList.length > 0 &&
                          _this.state.industryList.map((prop) => {
                            return (
                              <option value={prop.label}>{prop.label}</option>
                            );
                          })}
                      </Form.Select>
                    </FloatingLabel>
                    <ToggleButtonGroup
                      className="filter_toggles"
                      color="primary"
                      value={this.state.featured}
                      exclusive
                      onChange={(e) => {
                        _this.setState({
                          featured: e.target.value
                        });
                        setTimeout(() => {
                          _this.fetchDataFromServer();
                        }, 1000);
                      }}
                    >
                      <ToggleButton value="All">All</ToggleButton>
                      <ToggleButton value="Free">Free</ToggleButton>
                      <ToggleButton value="Premium">Premium</ToggleButton>
                    </ToggleButtonGroup>
                    <FormControl className="sort_select" sx={{ minWidth: 80 }}>
                      <Select
                        value={_this.state.sortFilter}
                        onChange={(e) => {
                          _this.setState({
                            sortFilter: e.target.value
                          });
                          setTimeout(() => {
                            _this.fetchDataFromServer();
                          }, 1000);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        // placeholder="hello"
                      >
                        <MenuItem value={`A-Z`}>A-Z</MenuItem>
                        <MenuItem value={`Z-A`}>Z-A</MenuItem>                        
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="select_template_main">
                  <Grid container spacing={2}>
                    {_this.state.data && _this.state.data.length > 0 ? (
                      _this.state.data.map((prop) => {
                        return (
                          <Grid item md={4} sm={6} xs={12} lg={3}>
                            <div className="template_card">
                              <img src={prop.image} alt=""/>
                              <div className="like_box">
                                {prop.likes}
                                {prop.user_already_liked === 0 ? (
                                  <img
                                    role="button"
                                    onClick={() => {
                                      let temp = {};
                                      _this.setState({
                                        resultData: []
                                      });
                                      temp.id = prop.id;
                                      temp.status = 1;
                                      templateLikeStatus(
                                        temp,
                                        _this,
                                        (res) => {
                                          // _this.fetchDataFromServer();
                                        },
                                        (res) => {}
                                      );
                                    }}
                                    alt=""
                                    src={heart2}
                                  />
                                ) : (
                                  <img
                                    role="button"
                                    onClick={() => {
                                      let temp = {};
                                      _this.setState({
                                        resultData: []
                                      });
                                      temp.id = prop.id;
                                      temp.status = 0;
                                      templateLikeStatus(
                                        temp,
                                        _this,
                                        (res) => {
                                          // _this.fetchDataFromServer();
                                        },
                                        (res) => {}
                                      );
                                    }}
                                    alt=""
                                    src={heart}
                                  />
                                )}
                              </div>
                              {prop.premium === 1 ? (
                                <div className="premium_box">
                                  <img src={premium} alt=""/>
                                </div>
                              ) : null}
                              <div className="template_card_content">
                                <p className="temp_badge">{prop.category}</p>
                                <p className="temp_badge">{prop.industry}</p>
                                <p className="temp_title">
                                  {prop.template_name}
                                </p>
                                <Tooltip title="Grow your subscribers with a Chat Interface focussed on collecting e-mail subscriptions.">
                                  <p className="temp_text">
                                    {prop.description}
                                  </p>
                                </Tooltip>

                                <div className="temp_btn_block">
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      _this.setState({
                                        id: prop.id,
                                        botName:prop.template_name,
                                        showPreviewModal: true,
                                        activePreview: prop
                                      });
                                    }}
                                    className="preview_btn"
                                    variant="outlined"
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    className="use_btn"
                                    variant="contained"
                                    type="button"
                                    onClick={() => {
                                      _this.useTemplateAPI(
                                        prop.id,
                                        prop.template_name
                                      );
                                    }}
                                  >
                                    Use this
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        );
                      })
                    ) : _this.state.loading ? (
                      <div className="text-center alert alert-danger">
                        Loading...
                      </div>
                    ) : (
                      <div className="text-center alert alert-danger">
                        No Data Found!
                      </div>
                    )}
                  </Grid>
                </div>
              </div>
            </Tab.Container>
          </div>
          <Dialog
            open={_this.state.showPreviewModal}
            onClose={() => {
              _this.setState({
                showPreviewModal: false
              });
            }}
            keepMounted={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="template-preview-modal"
          >
            <span className="cross-icon-block">
              <IconButton
                onClick={() => {
                  _this.setState({
                    showPreviewModal: false
                  });
                }}
              >
                <img src={crossX} alt="" />
              </IconButton>
            </span>
            <DialogContent>
              <div className="template-preview-header">
                <div>
                  <p className="lead_title">{_this.state.activePreview.template_name}</p>
                  <p className="lead_text">
                    {_this.state.activePreview.description}
                    {/* Make it easier for customers to schedule appointments or
                    book meetings */}
                  </p>
                </div>
                <div className="btn_block">
                  <div>
                    {/* <div
                      onClick={() =>
                        this.setState({
                          designView: "laptop"
                        })
                      }
                      className={
                        this.state.designView === "laptop"
                          ? "img_deactive img_active"
                          : "img_deactive"
                      }
                    >
                      {this.state.designView === "laptop" ? (
                        <img src={desktopwhite} alt="" />
                      ) : (
                        <img src={desktop} alt="" />
                      )}
                    </div>
                    <div
                      onClick={() =>
                        this.setState({
                          designView: "tab"
                        })
                      }
                      className={
                        this.state.designView === "tab"
                          ? "img_deactive img_active"
                          : "img_deactive"
                      }
                    >
                      {this.state.designView === "tab" ? (
                        <img src={tabwhite} alt="" />
                      ) : (
                        <img src={tab} alt="" />
                      )}
                    </div>
                    <div
                      onClick={() =>
                        this.setState({
                          designView: "mobile"
                        })
                      }
                      className={
                        this.state.designView === "mobile"
                          ? "img_deactive img_active"
                          : "img_deactive"
                      }
                    >
                      {this.state.designView === "mobile" ? (
                        <img src={mobilewhite} alt="" />
                      ) : (
                        <img src={mobile} alt="" />
                      )}
                    </div> */}
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      _this.useTemplateAPI(_this.state.id, _this.state.botName);
                    }}
                    variant="contained"
                  >
                    Use template  
                  </Button>
                </div>
              </div>
              <DialogContentText id="alert-dialog-description">
                <DeviceViewComponent open={_this.state.showPreviewModal} responsive={_this.state.designView} mode={"embed"} botId={_this.state.id} />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
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

export default TemplatesComponent;
