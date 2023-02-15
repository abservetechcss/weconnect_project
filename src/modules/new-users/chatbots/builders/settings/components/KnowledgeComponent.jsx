import React, { Component, Fragment } from "react";
import {
  Accordion,
  Card,
  FloatingLabel,
  Form,
  useAccordionButton,
} from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import folder from "../../../../../../assets/images/folder-plus.svg";
import dots from "../../../../../../assets/images/dots.svg";
import arrow from "../../../../../../assets/images/userdash/chevron-left (1).svg";
import { connect } from "react-redux";
import {
  createAndUpdateCategory,
  getCategoryList,
  deleteAndEditCategory,
  createAndUpdateArticle,
  listArticle,
  fetchAndDeleteArticle,
  duplicateArticle,
} from "../../../../knowledge-base/server/knowledgebaseServer";
import {
  setKnowledgeArticle,
  setKnowledgeArticleForm,
  setKnowledgeCategory,
} from "../../../../../../redux/actions/ReduxActionPage.jsx";
import { UpdateCategory } from "./server/knowledgeServer";
import { AlertContext } from "../../../../../../modules/common/Alert";
class KnowledgeComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    this.state = {
      categoryList: [],
      articleList: [],
      selected: [],
      categoryselected: [],
    };
    this.saveCategory = this.saveCategory.bind(this);
  }

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

  fetchCategoryList() {
    let _this = this;
    getCategoryList(
      "?bot_id=" + this.props.botIdURL,
      // "?bot_id=" + 342,
      (res) => {
        if (res.status === "Status") {
          this.props.setCategory(res.categoryBotList);
          this.props.setArticle(res.articleBotList);
          // if (res.categoryBotList.length > 0) {
          //   const categoryId = res.categoryBotList[0].id;

          //   this.fetchKnowledgeArticle(categoryId);
          // }
          this.setState({
            loading: false,
          });
          let art = [];
          res.articleBotList.map((list, l) => {
            if (list.article_added == 1) {
              art.push(list.article_id);
            }
            this.setState({
              selected: art,
            });
          });
          res.categoryBotList.map((catid, c) => {
            let count_avil = -1;
            let count = -1;
            res.articleBotList.map((artid, a) => {
              if (catid.category_id == artid.category_id) {
                count_avil += 1;
                if (this.state.selected.includes(artid.article_id)) {
                  count += 1;
                }
              }
            });
            if (count == count_avil && count_avil !== -1) {
              this.setState({
                categoryselected: [
                  ...this.state.categoryselected,
                  catid.category_id,
                ],
              });
            }
          });
        } else {
          this.props.setCategory([]);
          this.setState({
            loading: false,
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

  saveCategory() {
    this.context.showLoading();
    const sendParams = {
      article_id: this.state.selected.join(","),
      bot_id: this.props.botIdURL,
    };
    UpdateCategory(
      sendParams,
      (res) => {
        if (res.status === "True") {
          this.context.showAlert({
            type: "success",
            message: res.message,
          });
        } else {
          this.context.showAlert({
            type: "error",
            message: res.message,
          });
        }
      },
      (err) => {
        this.context.showAlert({
          type: "error",
          message: err.message || "Category update failed",
        });
      }
    );
  }

  render() {
    console.log(this.state.selected);
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Knowledge Base</p>
            <p className="desc">
              Select the articles you want to be displayed within the Chat
              Interface
            </p>
          </div>
          <div className="main-block">
            <div className="knoledge-base-category-block">
              <Accordion>
                {this.props.category.map((item) => {
                  const showArticle = this.props.article.some(
                    (art, i) => art.category_id === item.category_id
                  );
                  return (
                    <Card key={item.category_id}>
                      <Card.Header>
                        <div className="header-block">
                          <div className="check-block">
                            <Form.Group
                              className="input-checkbox-field-block-cust"
                              controlId="formBasicCheckbox"
                            >
                              <Form.Check
                                type="checkbox"
                                checked={this.state.categoryselected.includes(
                                  item.category_id
                                )}
                                value={item.category_id}
                                onChange={(e) => {
                                  const categoryArr = [
                                    ...this.state.categoryselected,
                                  ];
                                  const value = parseInt(e.target.value);
                                  if (e.target.checked) {
                                    categoryArr.push(value);
                                  } else {
                                    var index = categoryArr.indexOf(value);
                                    if (index !== -1) {
                                      categoryArr.splice(index, 1);
                                    }
                                  }
                                  this.setState({
                                    categoryselected: categoryArr,
                                  });

                                  let arr = [...this.state.selected];
                                  if (e.target.checked) {
                                    this.props.article.map((art, a) => {
                                      if (art.category_id == item.category_id) {
                                        var index = arr.indexOf(art.article_id);
                                        if (index == -1) {
                                          arr.push(art.article_id);
                                        }
                                      }
                                    });
                                  } else {
                                    this.props.article.map((art, a) => {
                                      if (art.category_id == item.category_id) {
                                        var index = arr.indexOf(art.article_id);
                                        if (index !== -1) {
                                          arr.splice(index, 1);
                                        }
                                      }
                                    });
                                  }
                                  this.setState({
                                    selected: arr,
                                  });
                                }}
                                label=""
                              />
                            </Form.Group>
                            <span>{item.category_name}</span>
                          </div>

                          {showArticle ? (
                            <div className="check-btn">
                              <this.CustomToggle eventKey={item.category_id}>
                                <img src={arrow} />
                              </this.CustomToggle>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey={item.category_id}>
                        <Card.Body>
                          <div className="inner-folder-block">
                            {this.props.article.map((art, a) => {
                              if (art.category_id == item.category_id)
                                return (
                                  <div className="folder-block">
                                    <Button
                                      className=""
                                      variant="contained"
                                      onClick={() => {
                                        this.setState({
                                          articalShow: true,
                                        });
                                      }}
                                    >
                                      <input
                                        id={"article" + a}
                                        type="checkbox"
                                        checked={this.state.selected.includes(
                                          art.article_id
                                        )}
                                        value={art.article_id}
                                        onChange={(e) => {
                                          const arr = [...this.state.selected];
                                          const value = parseInt(
                                            e.target.value
                                          );
                                          if (e.target.checked) {
                                            arr.push(value);
                                          } else {
                                            var index = arr.indexOf(value);
                                            if (index !== -1) {
                                              arr.splice(index, 1);
                                            }
                                          }
                                          let count = 0;
                                          let count_avil = 0;
                                          this.setState(
                                            {
                                              selected: arr,
                                            },
                                            () => {
                                              this.props.article.map(
                                                (art, a) => {
                                                  if (
                                                    item.category_id ==
                                                    art.category_id
                                                  ) {
                                                    count_avil += 1;
                                                    if (
                                                      this.state.selected.includes(
                                                        art.article_id
                                                      )
                                                    ) {
                                                      count += 1;
                                                    }
                                                  }
                                                }
                                              );
                                              if (count == count_avil) {
                                                this.setState({
                                                  categoryselected: [
                                                    ...this.state
                                                      .categoryselected,
                                                    item.category_id,
                                                  ],
                                                });
                                              } else {
                                                const catarr = [
                                                  ...this.state
                                                    .categoryselected,
                                                ];
                                                var index = catarr.indexOf(
                                                  item.category_id
                                                );
                                                if (index !== -1) {
                                                  catarr.splice(index, 1);
                                                }
                                                this.setState({
                                                  categoryselected: catarr,
                                                });
                                              }
                                            }
                                          );
                                        }}
                                      />
                                      <label htmlFor={"article" + a}>
                                        {art.article_title}
                                      </label>
                                    </Button>
                                  </div>
                                );
                            })}
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  );
                })}
              </Accordion>
            </div>
          </div>
          <div className="footer">
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={this.saveCategory}
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

function mapStateToProps(state) {
  const category = state.knowledgeBase.category || [];
  const article = state.knowledgeBase.article || [];
  return {
    category,
    article,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCategory: (data) => {
      dispatch(setKnowledgeCategory(data));
    },
    setArticle: (data) => {
      dispatch(setKnowledgeArticle(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeComponent);
