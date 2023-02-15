import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import React, { Component } from "react";
import basket from "../../../assets/images/shopping-basket.png";
import plus from "../../../assets/images/userdash/plus.svg";
import cross from "../../../assets/images/cross.svg";
import checkColor from "../../../assets/images/checkColor.svg";
import folder from "../../../assets/images/folder-plus.svg";
import dots from "../../../assets/images/dots.svg";
import edit from "../../../assets/images/edit-2 (1).svg";
import help from "../../../assets/images/help-circle.svg";
import deleteIcon from "../../../assets/images/trash (1).svg";
import helpIcon from "../../../assets/images/help-circle.svg";
import crossX from "../../../assets/images/x.svg";
import copy from "../../../assets/images/userdash/copy.svg";
import editBlack from "../../../assets/images/userdash/edit-2.svg";
import deleteIconBlack from "../../../assets/images/userdash/trash-2.svg";
import MUIDataTable from "mui-datatables";
import { FiFileText } from "react-icons/fi";
import arrow from "../../../assets/images/userdash/chevron-left (1).svg";
import { AlertContext } from "../../common/Alert";
import {
  setKnowledgeCategory,
  setKnowledgeArticle,
  setKnowledgeCategoryForm,
  setKnowledgeCategoryList,
  setKnowledgeArticleList,
} from "../../../redux/actions/ReduxActionPage.jsx";
import {
  Accordion,
  Badge,
  Card,
  FloatingLabel,
  Form,
  useAccordionButton,
} from "react-bootstrap";
import {
  createAndUpdateCategory,
  deleteAndEditCategory,
  listArticle,
  fetchAndDeleteArticle,
  duplicateArticle,
  deleteArticle,
  getCatList,
  sendMail,
} from "./server/knowledgebaseServer";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

export class KnowledgeBaseComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      categoryCreated: false,
      loading: true,
      articleLoading: true,
      checkBoxEdit: false,
      formData: {
        type: "create",
        name: "",
        id: "",
      },
      delete: false,
      categoryList: [],
      articles: [],
      editModel: false,
      folderModel: false,
      articalShow: false,
    };

    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.fetchCategoryList = this.fetchCategoryList.bind(this);
  }

  componentDidMount() {
    let _this = this;
    // if (_this.props.category.length === 0) {
    _this.fetchCategoryList();
    // } else {
    //   _this.setState({
    //     loading: false,
    //   });
    // }
  }

  fetchKnowledgeArticle(categoryId) {
    const category = this.props.category.find((item) => item.id === categoryId);
    if (category) {
      const params = "?category_id=" + category.id;
      this.context.showLoading(true);
      listArticle(
        params,
        (res) => {
          this.context.showLoading(false);
          let tempObj = { ...this.props.categoryForm };
          tempObj["id"] = category.id;
          tempObj["name"] = category.name;
          this.props.setCategoryForm(tempObj);
          if (this.state.checkBoxEdit !== false) {
            this.setState({
              checkBoxEdit: category.id,
            });
          }
          if (res.status === "True") {
            this.props.setKnowledgeArticle(res.articlelist);
          } else {
            this.props.setKnowledgeArticle([]);
          }
        },
        (err) => {
          this.context.showLoading(false);
        }
      );
    }
  }

  handleDeleteCategory() {
    let _this = this;
    if (_this.props.categoryForm.id > 0) {
      _this.context.showLoading(true);
      const params = "?type=delete&id=" + _this.props.categoryForm.id;
      deleteAndEditCategory(
        params,
        (res) => {
          _this.fetchCategoryList();
          _this.context.showAlert({
            type: "success",
            message: res.message,
          });
        },
        (err) => {
          _this.context.showAlert({
            type: "success",
            message: err.message || "create category failed",
          });
        }
      );
    } else {
      _this.context.showAlert({
        type: "error",
        message: "Please select category to delete",
      });
    }
  }

  handleDeleteClose = () => {
    this.setState({
      delete: false,
    });
  };

  createAndUpdateCategory(mode) {
    this.context.showLoading(true);
    createAndUpdateCategory(
      this.props.categoryForm,
      (res) => {
        if (res.status === "True") {
          this.setState({
            categoryCreated: false,
          });
          this.fetchCategoryList();
          this.context.showAlert({
            type: "success",
            message: res.message,
          });
        }
      },
      (err) => {
        this.context.showAlert({
          type: "success",
          message: err.message || "create category failed",
        });
      }
    );

    this.clearInputField();
  }

  fetchCategoryList() {
    let _this = this;
    getCatList(
      "",
      (res) => {
        console.log("categorylist", res);
        if (res.status === "True") {
          this.props.setCategory(res.categorylist);
          if (res.categorylist.length > 0) {
            const categoryId = res.categorylist[0].id;

            this.fetchKnowledgeArticle(categoryId);
          }
          this.setState({
            loading: false,
            // categoryList: res.categorylist,
            editModel: false,
            delete: false,
          });
        } else {
          let tempObj = { ...this.props.categoryForm };
          tempObj["id"] = "";
          tempObj["name"] = "";
          this.props.setCategoryForm(tempObj);
          this.props.setCategory([]);
          this.setState({
            loading: false,
            delete: false,
            checkBoxEdit: false,
          });
        }
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  }

  deleteArticleHandle(data) {
    this.context.showLoading();
    const params = "?type=delete&id=" + data;
    deleteArticle(params, (res) => {
      this.fetchKnowledgeArticle(this.props.categoryForm.id);
    });
  }

  clearInputField = () => {
    let tempObj = { ...this.props.categoryForm };
    tempObj["name"] = "";
    this.props.setCategoryForm(tempObj);
  };
  handleInputChange = (e) => {
    let tempObj = { ...this.props.categoryForm };
    tempObj[e.target.name] = e.target.value;
    this.props.setCategoryForm(tempObj);
  };

  handleEditModelClose = () => {
    this.setState({
      editModel: false,
    });
  };

  handleEditModelOpen = () => {
    let tempObj = { ...this.props.categoryForm };
    tempObj["type"] = "update";
    this.props.setCategoryForm(tempObj);
    this.setState({
      editModel: true,
    });
  };

  handleFolderModelOpen = () => {
    this.setState({
      folderModel: true,
    });
  };

  handleFolderModelClose = () => {
    this.setState({
      folderModel: false,
    });
  };
  CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => console.log("totally custom!")
      // console.log(eventKey)
    );

    return (
      <button type="button" onClick={decoratedOnClick}>
        {children}
      </button>
    );
  };
  render() {
    const options = {
      filterType: "dropdown",
      print: false,
      download: false,
      responsive: "scrollMaxHeight",
      filter: false,
      viewColumns: false,
      search: false,
      pagination: false,
      onRowsDelete: (res) => {
        console.log("delete rows", res);
        if (Array.isArray(res.data)) {
          var deletedArticle = [];
          res.data.forEach((item) => {
            if (this.props.article[item.dataIndex]) {
              const articleId = this.props.article[item.dataIndex].id;
              deletedArticle.push(articleId);
            }
          });

          if (deletedArticle.length > 0) {
            const sendDaa = deletedArticle.join(",");
            this.deleteArticleHandle(sendDaa);
          }
        }
      },
    };
    const theme = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 950,
          lg: 1200,
          xl: 1536,
        },
      },
    });
    return (
      <div className="knowledge_section knowledge_base_section">
        <ThemeProvider theme={theme}>
          <Grid container spacing={2}>
            <Grid item lg={4} md={5} sm={12}>
              <div className="knowledge_box">
                <div className="knowledge_header">
                  {this.state.checkBoxEdit ? (
                    <>
                      <div className="edit-checkbox-option">
                        {/* <Form.Group
                          className="input-checkbox-field-block-cust"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            checked
                            onChange={() => {
                              // let tempObj = {...this.props.categoryForm};
                              //                 const id = "";
                              //                 tempObj["id"] = id;
                              //                 this.props.setCategoryForm(tempObj);

                              this.setState({
                                checkBoxEdit: false,
                              });
                            }}
                            label=""
                          />
                        </Form.Group> */}
                        <span
                          className="edit-icon"
                          onClick={this.handleEditModelOpen}
                        >
                          <img src={edit} alt="" />
                          Edit
                        </span>
                        <span
                          className="delete-icon"
                          onClick={() => {
                            this.setState({
                              delete: true,
                            });
                          }}
                        >
                          <img src={deleteIcon} alt="" />
                          Delete
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      Categories
                      <div
                        style={{
                          flexDirection: "row",
                          display: "flex",
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={() => {
                            let tempObj = { ...this.props.categoryForm };
                            tempObj["id"] = "";
                            tempObj["name"] = "";
                            tempObj["type"] = "create";
                            this.props.setCategoryForm(tempObj);
                            this.setState({
                              categoryCreated: true,
                            });
                          }}
                        >
                          <img src={plus} alt="" />
                          Create category
                        </Button>
                        {this.props.categoryForm.id > 0 && (
                          <Button
                            sx={{
                              marginLeft: "5px",
                            }}
                            variant="text"
                            onClick={() => {
                              this.props.history.push(
                                "/user/knowledge-base/new-article-creation"
                              );
                            }}
                          >
                            <img src={plus} alt="" />
                            Create Article
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {this.state.categoryCreated ? (
                  <>
                    <div className="creating-category-section">
                      <div className="input-block">
                        <input
                          type="text"
                          name="name"
                          onChange={this.handleInputChange}
                          value={this.props.categoryForm.name}
                        />
                        <Button
                          className="cross-btn"
                          variant="contained"
                          onClick={() => {
                            this.setState({
                              categoryCreated: false,
                            });
                          }}
                        >
                          <img src={cross} alt="" />
                        </Button>
                        <Button
                          className="check-btn"
                          variant="contained"
                          onClick={() => this.createAndUpdateCategory("create")}
                        >
                          <img src={checkColor} alt="" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : this.state.loading ? (
                  <div className="text-center alert alert-danger">
                    Loading...
                  </div>
                ) : this.props.category.length > 0 ? (
                  <>
                    <div className="show-category-section">
                      <div className="knoledge-base-category-block">
                        <Accordion>
                          {this.props.category.map((item, key) => {
                            return (
                              <Card key={item.id}>
                                <Card.Header
                                  className={
                                    this.props.categoryForm.id === item.id
                                      ? "selected"
                                      : ""
                                  }
                                  onClick={() => {
                                    this.fetchKnowledgeArticle(item.id);
                                  }}
                                >
                                  <div className="header-block">
                                    <div className="check-block">
                                      <div className="hover-dots-block">
                                        <img src={dots} alt="" />
                                      </div>
                                      {/* <input
                                      type="checkbox"
                                      name="checkBox"
                                      onChange={(e) => {
                                        this.setState({
                                          checkBoxEdit: e.target.checked,
                                        });
                                      }}
                                    /> */}
                                      <Form.Group
                                        className="input-checkbox-field-block-cust"
                                        controlId="formBasicCheckbox"
                                      >
                                        <Form.Check
                                          type="checkbox"
                                          label=""
                                          name="checkBox"
                                          checked={
                                            this.state.checkBoxEdit === item.id
                                          }
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                          onChange={(e) => {
                                            const id = e.target.checked
                                              ? item.id
                                              : "";
                                            // let tempObj = {...this.props.categoryForm};
                                            // tempObj["id"] = id;
                                            // tempObj["name"] = item.name;
                                            // this.props.setCategoryForm(tempObj);
                                            this.setState({
                                              checkBoxEdit: id,
                                            });
                                            this.fetchKnowledgeArticle(id);
                                          }}
                                        />
                                      </Form.Group>
                                      <span>{item.name}</span>
                                    </div>
                                    {/* <div className="icon-block">
                                      <Tooltip title="Create folder">
                                        <IconButton
                                          onClick={this.handleFolderModelOpen}
                                        >
                                          <img src={folder} alt="" />
                                        </IconButton>
                                      </Tooltip>
                                    </div> */}
                                  </div>
                                  {/* <this.CustomToggle eventKey="0">
                                    <img src={arrow} alt=""/>
                                  </this.CustomToggle> */}
                                </Card.Header>
                                {/* <Accordion.Collapse eventKey="0">
                                  <Card.Body>
                                    <div className="inner-folder-block">
                                      <div className="folder-block">
                                        <div className="hover-dots-block">
                                          <img src={dots} alt="" />
                                        </div>
                                        <Button
                                          className=""
                                          variant="contained"
                                          onClick={() => {
                                            this.setState({
                                              articalShow: true,
                                            });
                                          }}
                                        >
                                          <Form.Group
                                            className="input-checkbox-field-block-cust"
                                            controlId="formBasicCheckbox"
                                          >
                                            <Form.Check
                                              type="checkbox"
                                              label=""
                                              onChange={(e) => {
                                                this.setState({
                                                  checkBoxEdit:
                                                    e.target.checked,
                                                });
                                              }}
                                            />
                                          </Form.Group>
                                          Folder 1
                                        </Button>
                                      </div>
                                      <div className="folder-block">
                                        <div className="hover-dots-block">
                                          <img src={dots} alt="" />
                                        </div>
                                        <Button
                                          className=""
                                          variant="contained"
                                        >
                                          <Form.Group
                                            className="input-checkbox-field-block-cust"
                                            controlId="formBasicCheckbox"
                                          >
                                            <Form.Check
                                              type="checkbox"
                                              label=""
                                            />
                                          </Form.Group>
                                          Folder 1
                                        </Button>
                                      </div>
                                      <div className="folder-block">
                                        <div className="hover-dots-block">
                                          <img src={dots} alt="" />
                                        </div>
                                        <Button
                                          className=""
                                          variant="contained"
                                        >
                                          <Form.Group
                                            className="input-checkbox-field-block-cust"
                                            controlId="formBasicCheckbox"
                                          >
                                            <Form.Check
                                              type="checkbox"
                                              label=""
                                            />
                                          </Form.Group>
                                          Folder 1
                                        </Button>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Accordion.Collapse> */}
                              </Card>
                            );
                          })}
                        </Accordion>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="blank-chat-section">
                    <img src={basket} alt="" />
                    <p className="warning">No categories created</p>
                    <p className="small-warning">
                      To create, please click the button below
                    </p>
                    <Button
                      className="category_btn"
                      variant="contained"
                      onClick={() => {
                        this.setState({
                          categoryCreated: true,
                        });
                      }}
                    >
                      <img src={plus} alt="" />
                      Create category
                    </Button>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item lg={8} md={7} sm={12}>
              <div className="knowledge_box">
                {/* <div className="knowledge_header">
                  {this.state.articalShow ? (
                    <>
                      <span>Folder 01 (08)</span>
                      <Button
                        className="new-artical-btn"
                        variant="contained"
                        onClick={() => {
                          this.props.history.push(
                            "/user/knowledge-base/new-article-creation"
                          );
                        }}
                      >
                        <img src={plus} alt="" />
                        New article
                      </Button>
                    </>
                  ) : null}
                </div> */}
                {this.props.article.length > 0 ? (
                  <>
                    <div className="category-block-table-section">
                      <MUIDataTable
                        className="user-table shadow-none chatbot_table"
                        title={""}
                        data={this.props.article}
                        columns={[
                          {
                            name: "title",
                            label: "Article name",
                            options: {
                              filter: true,
                              sort: true,
                              customBodyRender: (
                                value,
                                tableMeta,
                                updateValue
                              ) => {
                                // console.log('pending', tableMeta.rowData[4]);
                                // console.log('approve', tableMeta.rowData[5]);
                                return (
                                  // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                                  <>
                                    {/* {console.log(
                                      "#" +
                                      (
                                        ((1 << 24) * Math.random()) |
                                        0
                                      ).toString(16)
                                    )} */}
                                    <span className="artical-name">
                                      <span
                                        className="icon-block"
                                        // style={{
                                        //   backgroundColor:
                                        //     "#" +
                                        //     (
                                        //       ((1 << 24) * Math.random()) |
                                        //       0
                                        //     ).toString(16),
                                        // }}
                                      >
                                        <FiFileText className="icon" />
                                      </span>
                                      {value}
                                    </span>
                                  </>
                                );
                              },
                            },
                          },
                          {
                            name: "helpful",
                            label: "Helpful",
                            options: {
                              filter: true,
                              sort: true,
                            },
                          },
                          {
                            name: "nothelpful",
                            label: "Not helpful",
                            options: {
                              filter: true,
                              sort: true,
                              customBodyRender: (
                                value,
                                tableMeta,
                                updateValue
                              ) => {
                                // console.log('pending', tableMeta.rowData[4]);
                                // console.log('approve', tableMeta.rowData[5]);
                                return (
                                  // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                                  <>
                                    <div
                                      className="middle-edit-block"
                                      onClick={() => {
                                        const article =
                                          this.props.article[
                                            tableMeta.rowIndex
                                          ];
                                        console.log(tableMeta.rowIndex);
                                        this.context.showLoading(true);
                                        if (this.props.categoryForm.id > 0) {
                                          duplicateArticle(
                                            {
                                              id: article.id,
                                            },
                                            (res) => {
                                              this.fetchKnowledgeArticle(
                                                this.props.categoryForm.id
                                              );
                                            },
                                            (err) => {
                                              this.context.showLoading(false);
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      <span className="value">{value}</span>
                                      <span className="edit duplicate">
                                        <img src={copy} alt="" />
                                        Duplicate
                                      </span>
                                    </div>
                                  </>
                                );
                              },
                            },
                          },
                          {
                            name: "language",
                            label: "Language",
                            options: {
                              filter: true,
                              sort: true,
                              customBodyRender: (
                                value,
                                tableMeta,
                                updateValue
                              ) => {
                                // console.log('pending', tableMeta.rowData[4]);
                                // console.log('approve', tableMeta.rowData[5]);
                                const article =
                                  this.props.article[tableMeta.rowIndex];
                                return (
                                  // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                                  <>
                                    <Link
                                      className="middle-edit-block"
                                      to={
                                        "/user/knowledge-base/new-article-creation/" +
                                        article.id
                                      }
                                    >
                                      <span className="value">{value}</span>
                                      <span className="edit">
                                        <img src={editBlack} alt="" />
                                        Edit
                                      </span>
                                    </Link>
                                  </>
                                );
                              },
                            },
                          },
                          {
                            name: "status",
                            label: "Status",
                            options: {
                              filter: true,
                              sort: true,
                              customBodyRender: (
                                value,
                                tableMeta,
                                updateValue
                              ) => {
                                // console.log('pending', tableMeta.rowData[4]);
                                // console.log('approve', tableMeta.rowData[5]);
                                return (
                                  // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                                  <>
                                    <div className="middle-edit-block">
                                      <span className="value">
                                        {value.toLowerCase() == "published" ||
                                        value.toLowerCase() == "publish" ? (
                                          <Badge bg="primary publish">
                                            PUBLISHED
                                          </Badge>
                                        ) : (
                                          <Badge bg="primary draft">
                                            DRAFT
                                          </Badge>
                                        )}
                                      </span>
                                      <span
                                        className="edit delete"
                                        onClick={() => {
                                          const article =
                                            this.props.article[
                                              tableMeta.rowIndex
                                            ];
                                          console.log(tableMeta.rowIndex);
                                          this.context.showLoading(true);
                                          if (this.props.categoryForm.id > 0) {
                                            const params =
                                              "?type=delete&id=" + article.id;
                                            fetchAndDeleteArticle(
                                              params,
                                              (res) => {
                                                this.fetchKnowledgeArticle(
                                                  this.props.categoryForm.id
                                                );
                                              },
                                              (err) => {
                                                this.context.showLoading(false);
                                              }
                                            );
                                          }
                                        }}
                                      >
                                        <img src={deleteIconBlack} alt="" />
                                        Delete
                                      </span>
                                    </div>
                                  </>
                                );
                              },
                            },
                          },
                        ]}
                        options={options}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="blank-chat-section">
                      <img src={basket} alt="" />
                      <p className="warning">No articles to show</p>
                      <p className="small-warning">
                        After adding a category only, article can be created
                      </p>
                      <Button
                        className="category_btn new_btn"
                        variant="contained"
                        onClick={() => {
                          if (this.props.category.length === 0) {
                            this.context.showAlert({
                              type: "error",
                              message: "Please create atleast one category!",
                            });
                          } else {
                            this.props.history.push(
                              "/user/knowledge-base/new-article-creation"
                            );
                          }
                        }}
                      >
                        <img src={plus} alt="" /> New article
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </ThemeProvider>
        <Dialog
          open={this.state.editModel}
          onClose={this.handleEditModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // className="knowdledge-base-edit-model-popup-block"
          className="knowdledge-base-folder-model-popup-block"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">Edit Category name</p>
                <div className="input-field-block">
                  <FloatingLabel
                    className="floating-input-field-block-cust"
                    controlId="floatingCategoryName"
                    label="Name"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Category Name"
                      name="name"
                      onChange={this.handleInputChange}
                      value={this.props.categoryForm.name}
                    />
                  </FloatingLabel>
                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={this.handleEditModelClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="submit-btn"
                      variant="contained"
                      onClick={() => this.createAndUpdateCategory("update")}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.folderModel}
          onClose={this.handleFolderModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-folder-model-popup-block"
        >
          <span className="cross-icon-block">
            <IconButton onClick={this.handleFolderModelClose}>
              <img src={crossX} alt="" />
            </IconButton>
          </span>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">Create new folder</p>
                <div className="input-field-block">
                  <Form.Group
                    className=""
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="input-field"
                      placeholder="Folder name"
                    />
                  </Form.Group>

                  <FloatingLabel
                    controlId="floatingSelect"
                    className="floating-select-field"
                    label="Choose category"
                  >
                    <Form.Select aria-label="Floating label select example">
                      <option>Category 2</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </FloatingLabel>

                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={this.handleFolderModelClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="submit-btn"
                      variant="contained"
                      onClick={this.handleFolderModelClose}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.delete}
          onClose={this.handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete_popup"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Do you want to delete this Category</p>
              <div className="info_box">
                <img src={help} alt="" />
                <div>
                  <Button
                    variant="contained"
                    className="no_btn"
                    onClick={() => {
                      this.handleDeleteClose();
                    }}
                  >
                    No
                  </Button>
                  <Button
                    variant="text"
                    className="yes_btn"
                    onClick={this.handleDeleteCategory}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const category = state.knowledgeBase.categorylist || [];
  const article = state.knowledgeBase.articlelist || {};
  const categoryForm = state.knowledgeBase.categoryForm || {};
  return {
    category,
    article,
    categoryForm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCategory: (data) => {
      dispatch(setKnowledgeCategoryList(data));
    },
    setCategoryForm: (data) => {
      dispatch(setKnowledgeCategoryForm(data));
    },
    setKnowledgeArticle: (data) => {
      dispatch(setKnowledgeArticleList(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeBaseComponent);
