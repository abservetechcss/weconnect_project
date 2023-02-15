import React, { Component, Fragment } from 'react'
import {
  Menu,
  MenuItem,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import {
  getTemplateList,
  templateActiveStatus,
  deleteTemplate
} from "../../server/TemplateServer.js";
import { Link } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
import { BiCheck } from "react-icons/bi";
import {
  MdDeleteOutline,
  MdOutlineModeEditOutline,
  MdSettingsApplications
} from "react-icons/md";
import helpIcon from "../../../../../assets/images/sidebar/help-circle.svg";
import { successAlert } from "../../../../../js/alerts";
import AddEditTemplatePageComponent from "./AddEditTemplatePageComponent.jsx";
import { encryptBot, decryptBot } from "../../../../../js/encrypt";

import CommonPaginationComponent from "../../../../common/CommonPaginationComponent";

export class TemplateManagerListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      data: [],
      filterData: [],
      page: 1,
      limit: 10,
      totalCount: 0,
      showEditModal: false,
      showDeleteModal: false,
      showAddEditTemplateModal: false,
      selectFilter: false,
      template: {},
      action: null
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    // if (localStorage.getItem("id") != 1) {
    //   _this.props.history.push("/user/templates");
    // }
  }
  fetchDataFromServer = () => {
    let _this = this;
   let params = `limit=${_this.state.limit}&page=${_this.state.page}`;
    _this.setState({ loading: true });
    getTemplateList(
      params,
      (res) => {
          _this.setState({
            loading: false,
            selectFilter: false,
            filterData: []
          });
        let tempObj = [];
        if (Array.isArray(res.templatemanagerlist)) {
          res.templatemanagerlist &&
            res.templatemanagerlist.length > 0 &&
            res.templatemanagerlist.map((prop, key) => {
              tempObj.push({
                category: prop.category,
                featured: prop.featured === 0 ? "No" : "Yes",
                id: prop.id,
                key: key,
                industry: prop.industry,
                status: prop.status === 0 ? false : true,
                premium: prop.premium === 0 ? "No" : "Yes",
                prop: prop,
                template_name: prop.template_name
              });
            });
        } else {
          Object.keys(res.templatemanagerlist) &&
            Object.keys(res.templatemanagerlist).length > 0 &&
            Object.keys(res.templatemanagerlist).map((prop, key) => {
              tempObj.push({
                category: res.templatemanagerlist[prop].category,
                featured: prop.featured === 0 ? "No" : "Yes",
                id: res.templatemanagerlist[prop].id,
                key: key,
                industry: res.templatemanagerlist[prop].industry,
                status:
                  res.templatemanagerlist[prop].status === 0 ? false : true,
                premium:
                  res.templatemanagerlist[prop].premium === 0 ? "No" : "Yes",
                prop: res.templatemanagerlist[prop],
                template_name: res.templatemanagerlist[prop].template_name
              });
            });
        }
      
        
        _this.setState({
          loading: false,
          data: tempObj,
          filterData: tempObj,
          totalCount: res.count === undefined ? 0 : res.count,
         
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  deleteRecord = (id) => {
    let _this = this;
    let tempObj = {};
    tempObj.id = id;
    deleteTemplate(
      tempObj,
      () => {
        _this.setState({
          showDeleteModal: false,
          id: null
        });
        successAlert("Template deleted successfully!", _this);
        _this.fetchDataFromServer();
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  activeDeactivateStatus = (value) => {
    let _this = this;
    let temp = {};
    temp.id = value.id;
    temp.status = value.status === 0 ? 1 : 0;
    templateActiveStatus(
      temp,
      (res) => {
        _this.fetchDataFromServer();
      },
      (res) => {}
    );
  };
  render() {
    let _this = this;
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
      textLabels: {
        body: {
          noMatch: _this.state.loading ? "Loading..." : "No Data Found!"
        }
      }
    };
    let form = (
      <Fragment>
        <div className="header-edit-options">
          <MUIDataTable
            title={""}
            data={_this.state.data}
            columns={[
              {
                name: "template_name",
                label: "Template Name",
                options: {
                  filter: true,
                  sort: true
                }
              },
              // {
              //   name: "featured",
              //   label: "Featured",
              //   options: {
              //     filter: true,
              //     sort: true
              //   }
              // },
              {
                name: "premium",
                label: "Premium",
                options: {
                  filter: true,
                  sort: true
                }
              },
              {
                name: "industry",
                label: "Industry",
                options: {
                  filter: true,
                  sort: true
                }
              },
              {
                name: "category",
                label: "Category",
                options: {
                  filter: true,
                  sort: true,
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return <>{value}</>;
                  }
                }
              },
              {
                name: "prop",
                label: "Status",
                options: {
                  filter: true,
                  sort: true,
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                      <>
                        <div className="">
                          <span>
                            <div className="chatbot_switch">
                              <span className="switch-btn-cust">
                                <input
                                  value={value.status}
                                  checked={value.status}
                                  onClick={() => {
                                    setTimeout(() => {
                                      _this.activeDeactivateStatus(value);
                                    }, 10);
                                  }}
                                  type="checkbox"
                                  id={`switch${value.id}`}
                                />
                                <label htmlFor={`switch${value.id}`}>Toggle</label>
                              </span>
                              <p>Active</p>
                            </div>
                          </span>
                        </div>
                      </>
                    );
                  }
                }
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
                          aria-controls={openAction ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={openAction ? "true" : undefined}
                          onClick={(event) => {
                            _this.setState({
                              action: event.currentTarget,
                              id: value.id,
                              template: value
                            });
                          }}
                        >
                          <CgMenuRightAlt />
                        </div>
                      </>
                    );
                  }
                }
              }
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
        <Menu
          id="basic-menu"
          className="chatbot_action_table_popup"
          anchorEl={this.state.action}
          open={openAction}
          onClose={() => {
            _this.setState({
              action: null
            });
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button"
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                showAddEditTemplateModal: true,
                action: null
              });
            }}
          >
            <MdOutlineModeEditOutline />
            Edit
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                showDeleteModal: true,
                action: null
              });
            }}
          >
            <MdDeleteOutline />
            Delete
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              const encData = encryptBot(_this.state.template.id, _this.state.template.template_name);
              setTimeout(() => {
                _this.props.history.push(
                  `/user/chatbots/builder?botId=${encData}`
                );
              }, 1000);
              _this.setState({
                // showDeleteModal: true,
                action: null
              });
            }}
          >
            <MdSettingsApplications />
            Script
          </MenuItem>
        </Menu>
        <Dialog
          open={_this.state.showDeleteModal}
          onClose={() => {
            _this.setState({
              showDeleteModal: false
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
                          showDeleteModal: false
                        });
                      }}
                    >
                      No
                    </Button>
                    <Button
                      className="leave-btn"
                      variant="contained"
                      onClick={() => {
                        _this.deleteRecord(_this.state.id);
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
        <Dialog
          open={_this.state.showAddEditTemplateModal}
          onClose={() => {
            _this.setState({
              showAddEditTemplateModal: false
            });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block new-template-modal-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Update Template</p>
          </DialogTitle>
          <AddEditTemplatePageComponent
            editTemplate={true}
            handleCloseModal={() => {
              _this.setState({
                showAddEditTemplateModal: false
              });
            }}
            fetchDataFromServer={() => {
              _this.fetchDataFromServer();
            }}
            template={_this.state.template}
            id={_this.state.id}
            {..._this.props}
          />
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

export default TemplateManagerListPage
