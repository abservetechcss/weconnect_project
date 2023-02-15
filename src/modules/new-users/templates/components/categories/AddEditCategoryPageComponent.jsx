import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
  DialogActions
} from "@mui/material";
import { Dropdown, FloatingLabel, Form } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import edit from "../../../../../assets/images/edit-2.svg";
import { MdOutlineDelete } from "react-icons/md";
import {
  getCategoriesList,
  createCategories,
  updateCategories,
  deleteCategory
} from "../../server/CategoryServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert } from "../../../../../js/alerts";
import { BiCheck } from "react-icons/bi";
import helpIcon from "../../../../../assets/images/sidebar/help-circle.svg";

export class AddEditCategoryPageComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {}
    });
    this.state = {
      alert: null,
      loading: false,
      data: [],
      filterData: [],
      page: 1,
      limit: 10,
      totalCount: 0,
      showEditModal: false,
      showAddModal: false,
      showDeleteModal: false,
      id: null,
      category: {
        category_name: ""
      }
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }
  fetchDataFromServer = () => {
    let _this = this;
    let params = ``;
    getCategoriesList(
      params,
      (res) => {
        console.log(res)
        let tempObj =
          res.category &&
          res.category.length > 0 &&
          res.category.map((prop) => {
            return {
              id: prop.id,
              category_name: prop.category_name,
              value: false,
              prop: prop
            };
          });
        console.log(tempObj)
        _this.setState({
          loading: false,
          data: tempObj,
          filterData: tempObj,
          totalCount: tempObj.length,
          page: 1,
          limit: 10
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(this.state.category));
    if (_this.validator.allValid()) {
      if (_this.state.id === null) {
        createCategories(
          tempObj,
          () => {
            _this.setState({
              showAddModal: false,
              loading: false
            });
            successAlert("Category created successfully!", _this);
            _this.fetchDataFromServer();
          },
          () => {
            _this.setState({ loading: false });
          }
        );
      } else {
        tempObj.id = _this.state.id;
        updateCategories(
          tempObj,
          () => {
            _this.setState({
              showEditModal: false,
              showAddModal: false,
              showDeleteModal: false,
              loading: false
            });
            successAlert("Category updated successfully!", _this);
            _this.fetchDataFromServer();
          },
          () => {
            _this.setState({ loading: false });
          }
        );
      }
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  deleteRecord = (id) => {
    let _this = this;
    let tempObj = {};
    tempObj.id = id;
    deleteCategory(
      tempObj,
      () => {
        _this.setState({
          showEditModal: false,
          showAddModal: false,
          showDeleteModal: false,
          id: null,
          category: {
            category_name: ""
          }
        });
        successAlert("Category deleted successfully!", _this);
        _this.fetchDataFromServer();
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  render() {
    let _this = this;
    const options = {
      filter: false,
      filterType: "dropdown",
      download: false,
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      pagination: true,
      search: false,
      fixedSelectColumn: true,
      fixedHeader: true,
      selectableRows: false,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 25, 50],
      textLabels: {
        body: {
          noMatch: _this.state.loading ? "Loading..." : "No Data Found!"
        }
      }
    };
    let form = (
      <Fragment>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <MUIDataTable
              className="user-table shadow-none chatbot_table"
              title={""}
              data={_this.state.data}
              columns={[
                {
                  name: "prop",
                  label: "Category Name",
                  options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, row) => {
                      return (
                        <>
                          {console.log(value)}
                          {_this.state.showEditModal &&
                            _this.state.id === value.id ? (
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
                                    value={_this.state.category.category_name}
                                    onChange={(e) => {
                                      let temp = _this.state.category;
                                      temp.category_name = e.target.value;
                                      _this.setState({
                                        category: temp
                                      });
                                    }}
                                  />
                                  <div className="errorMsg">
                                    {_this.validator.message(
                                      "category name",
                                      _this.state.category.category_name,
                                      "required"
                                    )}
                                  </div>
                                </FloatingLabel>
                                <Button
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
                            value && value.category_name
                          )}
                        </>
                      );
                    }
                  }
                },

                {
                  name: "prop",
                  label: "Action",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      return (
                        <div className="edit-option">
                          <span
                            role="button"
                            onClick={() => {
                              _this.setState({
                                id: value.id,
                                category: {
                                  category_name: value.category_name
                                }
                              });
                              setTimeout(() => {
                                _this.setState({
                                  showEditModal: true
                                });
                              }, 1000);
                            }}
                          >
                            <img src={edit} alt="" />
                            Edit1
                          </span>
                          <span
                            onClick={() => {
                              _this.setState({
                                id: value.id,
                                showDeleteModal: true
                              });
                            }}
                          >
                            <MdOutlineDelete />
                            Delete
                          </span>
                        </div>
                      );
                    }
                  }
                }
              ]}
              options={options}
            />
            <div className="add_industry">
              {_this.state.showAddModal ? (
                <div>
                  <Form.Group
                    className="input-field-block-cust"
                    controlId="formBasicEmail"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter category name"
                      name="category_name"
                      value={_this.state.category.category_name}
                      onChange={(e) => {
                        let temp = _this.state.category;
                        temp.category_name = e.target.value;
                        _this.setState({
                          category: temp
                        });
                      }}
                    />
                    <div className="errorMsg">
                      {_this.validator.message(
                        "category name",
                        _this.state.category.category_name,
                        "required"
                      )}
                    </div>
                  </Form.Group>
                  <Button
                    type="button"
                    onClick={() => {
                      _this.setState({
                        showAddModal: false,
                        category: {
                          category_name: ""
                        }
                      });
                    }}
                    variant="contained"
                    className="cancel_btn"
                  >
                    Cancel
                  </Button>
                  <Button type="button"
                    onClick={() => {
                      _this.setState({
                        id: null
                      });
                      setTimeout(() => {
                        _this.onSubmit();
                      }, 1000);
                    }}
                    variant="contained"
                    className="add_btn"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <p className="add_industry_text" role="button"
                  onClick={() => {
                    _this.setState({
                      showAddModal: true,
                      category: {
                        category_name: ""
                      }
                    });
                  }}
                >
                  + Add new Category
                </p>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => {
              _this.props.setShowCategoryModal(false);
            }}
            variant="contained"
            className="cancel_btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              _this.props.setShowCategoryModal(false);
            }}
            variant="contained"
            className="save_btn"
          >
            Save Changes
          </Button>
        </DialogActions>
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
                        _this.deleteRecord(_this.state.id)
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
        {this.state.alert}
        {form}
      </Fragment>
    );
  }
}

export default AddEditCategoryPageComponent;
