import React, { Component, Fragment } from "react";
import MUIDataTable from "mui-datatables";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { connect } from "react-redux";
import { Form, FloatingLabel } from "react-bootstrap";
import { CgMenuRightAlt } from "react-icons/cg";
import { BiCheck } from "react-icons/bi";
import {
  setInnerSideBar,
  setSelectBotDetails,
} from "../../../redux/actions/ReduxActionPage.jsx";
import {
  Dialog,
  DialogContent,
  Menu,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import CommonPaginationComponent from "../../common/CommonPaginationComponent.jsx";
import {
  getAllChatBotList,
  getAllChatBotWithOutPaginationList,
  duplicateBot,
  exportbotUrl,
  ActiveDeactiveBot,
} from "./server/UserChatBotServer.js";
import { Link } from "react-router-dom";
import filter from "../../../assets/images/userdash/Group 17736.svg";
import arrow from "../../../assets/images/userdash/chevron-left (1).svg";
import cross from "../../../assets/images/userdash/x-circle.svg";
import menu from "../../../assets/images/userdash/Group 19474.svg";
import line from "../../../assets/images/userdash/Line 1174.svg";
import { BiExport } from "react-icons/bi";
import { MdDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";
// import { CgAdd } from "react-icons/cg";
// import { FiEdit } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { encryptBot } from "../../../js/encrypt";
import { deleteChatBotId, updateBotName } from "./server/UserChatBotServer.js";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import helpIcon from "../../../assets/images/sidebar/help-circle.svg";
import SimpleReactValidator from "simple-react-validator";
import moment from "moment";
const PreviewIcon =
  require("../../../assets/images/external-link (1).svg").ReactComponent;

function saveFile(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }
}

export class UserChatBotComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      alert: null,
      loading: false,
      page: 1,
      limit: 10,
      totalCount: 0,
      selectFilter: false,
      applyFilterModal: null,
      data: [],
      filterData: [],
      lead_columnsList: [],
      columnsList: [],
      searchValue: "",
      botItemList: [],
      action: null,
      botItem: {},
      botId: null,
      botName: "",
      showDeleteModal: false,
      showEditModal: false,
      setsort: {
        sort: 0,
        sort_type: "DESC",
        search_type: "chat_interface",
      },
    };
    this.handleDuplicateBot = this.handleDuplicateBot.bind(this);
    this.handlePreviewBot = this.handlePreviewBot.bind(this);
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }
  fetchDataFromServer = () => {
    let _this = this;
    // let params = `limit=${_this.state.limit}&page=${_this.state.page}`;
    let params = `sort=${_this.state.setsort.sort}&limit=${_this.state.limit}&page=${_this.state.page}&sort_type=${this.state.setsort.sort_type}&search_type=${this.state.setsort.search_type}`;
    _this.setState({ loading: true });
    getAllChatBotList(
      params,
      (res) => {
        _this.setState({ loading: false, selectFilter: false, filterData: [] });
        let tempObj = [];
        if (
          Object.keys(res.chatbotlist) &&
          Object.keys(res.chatbotlist).length > 0 &&
          res.status !== "False"
        ) {
          Object.keys(res.chatbotlist).map((prop, index) => {
            tempObj.push({
              status: res.chatbotlist[prop].status,
              language: "---",
              embed: "---",
              key: index,
              chatbot_title: res.chatbotlist[prop].chatbot_title,
              last_edited: res.chatbotlist[prop].last_edited,
              created_date: res.chatbotlist[prop].created_date,
              chatbot_id: res.chatbotlist[prop].chatbot_id,
              prop: res.chatbotlist[prop],
              // botId: res.chatbotlist[prop].created_date,
            });
            return prop;
          });
        }
        localStorage.setItem("userBots", parseInt(res.count));
        _this.setState({
          loading: false,
          data: tempObj,
          totalCount: res.count === undefined ? 0 : res.count,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  fetchWithOutPaginationList = () => {
    let _this = this;
    getAllChatBotWithOutPaginationList(
      "",
      (res) => {
        _this.setState({ loading: false, selectFilter: true });
        let tempObj = [];
        if (
          Object.keys(res.chatbotlist) &&
          Object.keys(res.chatbotlist).length > 0
        ) {
          Object.keys(res.chatbotlist).map((prop, index) => {
            tempObj.push({
              status: res.chatbotlist[prop].status,
              language: "---",
              embed: "---",
              key: index,
              chatbot_title: res.chatbotlist[prop].chatbot_title,
              last_edited: res.chatbotlist[prop].last_edited,
              created_date: res.chatbotlist[prop].created_date,
            });
            return prop;
          });
        }
        _this.setState({
          loading: false,
          data: tempObj,
          filterData: tempObj,
          totalCount: tempObj.length,
          page: 1,
          limit: 10,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  handleDuplicateBot() {
    if (this.state.botItem && this.state.botItem.chatbot_id) {
      const sendData = {
        bot_id: this.state.botItem.chatbot_id,
      };
      this.setState({ loading: true, action: false });
      duplicateBot(
        sendData,
        () => {
          successAlert("Chat bot Duplicated successfully!", this);
          this.fetchDataFromServer();
        },
        () => {
          this.setState({ loading: false });
        }
      );
    }
  }

  getEncryptedKey() {
    let _this = this;
    if (_this.state.botItem && _this.state.botItem.chatbot_id) {
      // const value = this.state.botItem;
      // const encData = encryptBot(value.chatbot_id, value.chatbot_title);
      const botUrl =
        process.env.REACT_APP_SCRIPT_BASE_URL +
        `landing/?botId=${window.btoa(_this.state.botItem.chatbot_id)}`;
      return botUrl;
    }
  }

  handlePreviewBot() {
    this.setState({
      action: false,
    });
  }

  onSubmit = () => {
    let _this = this;
    let temp = {};
    temp.botid = _this.state.botId;
    temp.botname = _this.state.botName;
    if (_this.validator.allValid()) {
      _this.setState({ loading: true });
      updateBotName(
        temp,
        () => {
          _this.setState({
            showDeleteModal: false,
            showEditModal: false,
            loading: false,
          });
          successAlert("name updated successfully!", _this);
          _this.fetchDataFromServer();
        },
        () => {
          _this.setState({ loading: false });
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  deleteChatBotData = (id) => {
    let _this = this;
    let tempObj = {};
    tempObj.botid = id;
    deleteChatBotId(
      tempObj,
      () => {
        _this.setState({
          showDeleteModal: false,
          showEditModal: false,
        });
        successAlert("Chat bot deleted successfully!", _this);
        _this.fetchDataFromServer();
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  handleFilterChange = (e) => {
    this.setState({
      applyFilterModal: e.currentTarget,
    });
  };

  handleCloseAction = (event) => {
    this.setState({
      action: null,
    });
  };
  render() {
    let _this = this;
    const open = Boolean(this.state.applyFilterModal);
    const openAction = Boolean(this.state.action);
    const options = {
      filter: false,
      filterType: "checkbox",
      download: false,
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      pagination: false,
      search: false,
      fixedSelectColumn: true,
      fixedHeader: true,
      selectableRows: true,
      rowsPerPage: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      onFilterDialogOpen: (data) => {
        _this.fetchWithOutPaginationList();
      },
      onTableChange: (data, filterList) => {
        let totalRow = filterList.displayData && filterList.displayData.length;
        if (data === "filterChange") {
          _this.setState({
            totalCount: totalRow,
          });
        }
      },
      onFilterChange: (type, data) => {
        let filterData = data.filter((x) => {
          return x.length > 0;
        });
        if (type === null || filterData.length === 0) {
          _this.fetchDataFromServer();
        }
      },
      onColumnSortChange: (value, row) => {
        console.log("hiiiiiiiiiiii", value, row);
        this.setState(
          {
            setsort: {
              sort: row == "desc" ? 1 : 1,
              sort_type: row.toUpperCase(),
              search_type: value == "prop" ? "chat_interface" : value,
            },
          },
          () => {
            let params = `sort=${_this.state.setsort.sort}&limit=${_this.state.limit}&page=${_this.state.page}&sort_type=${this.state.setsort.sort_type}&search_type=${this.state.setsort.search_type}`;
            _this.setState({ loading: true });
            console.log(params);
            getAllChatBotList(
              params,
              (res) => {
                console.log(res);
                let tempObj = [];
                if (
                  Object.keys(res.chatbotlist) &&
                  Object.keys(res.chatbotlist).length > 0 &&
                  res.status !== "False"
                ) {
                  Object.keys(res.chatbotlist).map((prop, index) => {
                    tempObj.push({
                      status: res.chatbotlist[prop].status,
                      language: "---",
                      embed: "---",
                      key: index,
                      chatbot_title: res.chatbotlist[prop].chatbot_title,
                      last_edited: res.chatbotlist[prop].last_edited,
                      created_date: res.chatbotlist[prop].created_date,
                      chatbot_id: res.chatbotlist[prop].chatbot_id,
                      prop: res.chatbotlist[prop],
                      // botId: res.chatbotlist[prop].created_date,
                    });
                    return prop;
                  });
                }
                localStorage.setItem("userBots", parseInt(res.count));
                _this.setState({
                  loading: false,
                  data: tempObj,
                  totalCount: res.count === undefined ? 0 : res.count,
                });
              },
              (err) => {
                console.log(err);
              }
            );
          }
        );
      },
      textLabels: {
        body: {
          noMatch: _this.state.loading ? "Loading..." : "No Chat Bots Found!",
        },
      },
      customToolbarSelect: (selectedRows) => (
        <div>
          <Button
            type="button"
            onClick={() => {
              let displayData = selectedRows.data;
              let temp = [];
              displayData &&
                displayData.length > 0 &&
                displayData.map((prop) => {
                  if (
                    _this.state.data.filter((x) => {
                      return x.key === prop.index;
                    }).length > 0
                  ) {
                    let item = _this.state.data.filter((x) => {
                      return x.key === prop.index;
                    })[0];
                    temp.push(item);
                  }
                  return prop;
                });
              temp &&
                temp.length > 0 &&
                temp.map((prop1, index) => {
                  let _this = this;
                  let tempObj = {};
                  tempObj.botid = prop1.chatbot_id;
                  deleteChatBotId(
                    tempObj,
                    () => {
                      if (index === temp.length - 1) {
                        _this.setState({
                          showDeleteModal: false,
                          showEditModal: false,
                        });
                        successAlert("Chat bot deleted successfully!", _this);
                        _this.fetchDataFromServer();
                      }
                    },
                    () => {
                      _this.setState({ loading: false });
                    }
                  );
                  return prop1;
                });
            }}
          >
            {" "}
            <MdDeleteOutline />
            Delete
          </Button>
        </div>
      ),
    };
    let form = (
      <Fragment>
        <div className="chatbots_section">
          {/* <div className="chatbot_filter_section">
            <div className="applied_filter_box">
              <p className="applied_filter_title">Applied filters:</p>
              <p className="applied_filter_text">
                Language
                <img src={cross} alt=""/>
              </p>
              <p className="applied_filter_text">
                Type <img src={cross} alt=""/>
              </p>
              <img className="menu_img" src={menu} alt=""></img>
              <p className="clear_filter_text">Clear filters</p>
              <img className="line_img" src={line} alt=""></img>
            </div>
            <div
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={this.handleFilterChange}
              className="chatbot_filters"
            >
              <img src={filter} alt="" />
              <p>Filters</p>
              <img src={arrow} alt="" />
            </div>
          </div> */}
          <div className="header-edit-options">
            <MUIDataTable
              title={""}
              data={_this.state.data}
              columns={[
                {
                  name: "prop",
                  label: "Chat Interfaces",
                  options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, row) => {
                      return (
                        <>
                          {_this.state.showEditModal &&
                          _this.state.botId === value.chatbot_id ? (
                            <>
                              <div className="chatbot_edit_ip_main">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="name"
                                  className="carousal_input chatbot_edit_input"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Sample title"
                                    value={_this.state.botName}
                                    onChange={(e) => {
                                      _this.setState({
                                        botName: e.target.value,
                                      });
                                    }}
                                  />
                                </FloatingLabel>
                                <Button
                                  disabled={_this.state.botName === ""}
                                  variant="contained"
                                  onClick={() => {
                                    _this.onSubmit();
                                  }}
                                >
                                  <BiCheck />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Link
                              role="button"
                              to={
                                "/user/chatbots/overview?botId=" +
                                encryptBot(
                                  value.chatbot_id,
                                  value.chatbot_title
                                )
                              }
                            >
                              {value.chatbot_title}
                            </Link>
                          )}
                        </>
                      );
                    },
                  },
                },
                {
                  name: "last_edited",
                  label: "Last edited",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "created_date",
                  label: "Created Date",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "embed",
                  label: "Type",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "language",
                  label: "Language",
                  options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      return <>{value}</>;
                    },
                  },
                },
                {
                  name: "status",
                  label: "Status",
                  options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      const index = tableMeta.rowIndex;
                      return (
                        <>
                          <div className="">
                            <span>
                              <div className="chatbot_switch">
                                <span className="switch-btn-cust">
                                  <input
                                    type="checkbox"
                                    id={`switch${index}`}
                                    checked={value === 1}
                                    onChange={(e) => {
                                      const rowData =
                                        tableMeta.rowData[0] || {};
                                      const value = e.target.checked ? 1 : 0;
                                      const sendObj = {
                                        bot_id: rowData.chatbot_id,
                                        status: value,
                                      };
                                      ActiveDeactiveBot(sendObj, (res) => {
                                        successAlert(res.Message, this);
                                        _this.fetchDataFromServer();
                                      });
                                    }}
                                  />
                                  <label htmlFor={`switch${index}`}>
                                    Toggle
                                  </label>
                                </span>
                                <p>Active</p>
                              </div>
                            </span>
                            {/* <span className="edit delete">
                                  <img src={deleteIconBlack} alt="" />
                                  Delete
                                </span> */}
                          </div>
                        </>
                      );
                    },
                  },
                },
                {
                  name: "prop",
                  label: "Action",

                  options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      return (
                        <>
                          <div
                            style={{ textAlign: "center" }}
                            id="basic-button"
                            aria-controls={
                              openAction ? "basic-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openAction ? "true" : undefined}
                            onClick={(event) => {
                              _this.setState({
                                botItem: value,
                                botId: null,
                                botName: "",
                                action: event.currentTarget,
                              });
                            }}
                          >
                            <CgMenuRightAlt />
                          </div>
                        </>
                      );
                    },
                  },
                },
              ]}
              options={options}
              className="chatbot_table disable-hover"
            />
            <CommonPaginationComponent
              _this={_this}
              page={_this.state.page}
              limit={_this.state.limit}
              pages={Math.ceil(_this.state.totalCount / _this.state.limit)}
              totalCount={_this.state.totalCount}
              filterData={_this.state.filterData}
              selectFilter={_this.state.selectFilter}
              fetchDataFromServer={() => {
                _this.fetchDataFromServer();
              }}
              {..._this.props}
            />
          </div>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={this.state.applyFilterModal}
          open={open}
          onClose={() => {
            _this.setState({
              applyFilterModal: false,
            });
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="chatfilter_popup"
        >
          <div className="filter_menus">
            <p>Status</p>
            <div>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Active" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Inactive" />
              </Form.Group>
            </div>
          </div>
          <div className="filter_menus">
            <p>Type</p>
            <div>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Embed" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Widget" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Landing Page" />
              </Form.Group>
            </div>
          </div>
          <div className="filter_menus">
            <p>Language</p>
            <div>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Language 1 (English)" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Language 2 (Dutch)" />
              </Form.Group>
            </div>
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          className="chatbot_action_table_popup"
          anchorEl={this.state.action}
          open={openAction}
          onClose={this.handleCloseAction}
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
          <MenuItem
            onClick={() => {
              _this.setState({
                botId: _this.state.botItem && _this.state.botItem.chatbot_id,
                botName:
                  _this.state.botItem && _this.state.botItem.chatbot_title,
                showEditModal: true,
                action: null,
              });
            }}
          >
            <MdOutlineModeEditOutline />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              _this.setState({
                showDeleteModal: true,
                action: null,
              });
            }}
          >
            <MdDeleteOutline />
            Delete
          </MenuItem>
          <MenuItem onClick={this.handleDuplicateBot}>
            <FiCopy />
            Duplicate
          </MenuItem>
          <MenuItem onClick={this.handlePreviewBot}>
            <a href={this.getEncryptedKey()} target="_blank" rel="noreferrer">
              <PreviewIcon />
              Preview
            </a>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.setState({ loading: true, action: false });
              exportbotUrl(
                _this.state.botItem.chatbot_id,
                (response) => {
                  this.setState({ loading: false });
                  let blob = new Blob([response], { type: "application/json" });
                  var link = window.document.createElement("a");
                  link.href = window.URL.createObjectURL(blob);
                  link.download =
                    "export-bot-" +
                    _this.state.botItem.chatbot_title +
                    moment().format("YYYYMMMDD_h:mm:ss") +
                    ".json";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  successAlert("Chat bot Exported successfully!", this);
                },
                (err) => {
                  this.setState({ loading: false });
                  errorAlert("Chat bot Export Failed!", this);
                  console.log(err);
                }
              );
            }}
          >
            <BiExport />
            Export
          </MenuItem>
        </Menu>
        <Dialog
          open={_this.state.showDeleteModal}
          onClose={() => {
            _this.setState({
              showDeleteModal: false,
            });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-edit-model-popup-block header-language-model-popup-block setting-modal-block-popup"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">
                  Are you sure?
                  <small>You will not be able to recover this data!</small>
                </p>
                <div className="info-btn-block">
                  <img src={helpIcon} alt="" />
                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={() => {
                        _this.setState({
                          showDeleteModal: false,
                        });
                      }}
                    >
                      No
                    </Button>
                    <Button
                      className="leave-btn"
                      variant="contained"
                      onClick={() => {
                        _this.deleteChatBotData(
                          _this.state.botItem && _this.state.botItem.chatbot_id
                        );
                      }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
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
const mapDispatchToProps = (dispatch) => {
  return {
    setInnerSideBarActive: (data) => {
      dispatch(setInnerSideBar(data));
    },
    setSelectBotList: (data) => {
      dispatch(setSelectBotDetails(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(UserChatBotComponent);
