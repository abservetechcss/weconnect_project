import { Button } from "@mui/material";
import React, { Component } from "react";
import shuffle from "../../../../../../../assets/images/userdash/shuffle.svg";
import trash from "../../../../../../../assets/images/userdash/trash-2.svg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { HiOutlinePlusSm } from "react-icons/hi";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions
} from "@mui/material";
import helpIcon from "../../../../../../../assets/images/sidebar/help-circle.svg";


import {
  createLogicalJumpComp,
  getLogicalJumpComp,
  deleteLogicalJumpComponent
} from "../../BuilderConversaionServer.js";
import { successAlert } from "../../../../../../../js/alerts.js";

export class OpinionScaleComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question_lists: [],
      data: [],
      answered_other_than_jump_to: null,
      showDeleteModal: false,
      selectRow: {}
    };
  }
  componentDidMount() {
    let _this = this;
    setTimeout(() => {
      _this.fetchDataFromServer();
    }, 10);
  }

  fetchDataFromServer() {
    let _this = this;
    const params = `bot_id=${_this.props.botIdURL}&question_id=${_this.props.logicalJumpQueId}`;
    getLogicalJumpComp(
      params,
      (res) => {
        let tempObj = [];
        let temp = [];
        if (res.question_lists && res.question_lists.length > 0) {
          temp = res.question_lists.map((prop) => {
            return {
              id: prop.id,
              label: prop.chat_message,
              value: prop.id
            };
          });
        }
        if (res.logical_jump && res.logical_jump.length > 0) {
          res.logical_jump.map((prop) => {
            tempObj.push({
              key: 0,
              id: prop.id,
              value: prop.value,
              jump_to_question: prop.jump_to_question,
              condition: prop.condition,
              value_to: prop.value_to
            });
          });
        } else {
          // tempObj.push({
          //   key: 0,
          //   value: "",
          //   id: null,
          //   jump_to_question: null,
          //   condition: "equal_to"
          // });
        }
        _this.setState({
          question_lists: temp,
          data: tempObj,
          answered_other_than_jump_to: res.answered_other_than_jump_to
        });
      },
      (error) => {}
    );
  }
  onSubmit = () => {
    let _this = this;
    const params = `bot_id=${_this.props.botIdURL}&question_id=${_this.props.logicalJumpQueId}`;
    var tempObj = new FormData();
    tempObj.append("question_id", _this.props.logicalJumpQueId);
    tempObj.append("bot_id", _this.props.botIdURL);
    tempObj.append(
      "answered_other_than_jump_to",
      _this.state.answered_other_than_jump_to
    );
    if (_this.state.data && _this.state.data.length > 0) {
      _this.state.data.map((prop) => {
        tempObj.append(`value[]`, `${prop.value}`);
        tempObj.append(`value_to[]`, `${prop.value_to}`);
        tempObj.append(`jump_to_question[]`, `${prop.jump_to_question}`);
        tempObj.append(`id[]`, `${prop.id}`);
        tempObj.append(`condition[]`, `${prop.condition}`);
      });
    } else {
        tempObj.append(`jump_to_question[]`, ``);
        tempObj.append(`id[]`, `null`);
        tempObj.append(`condition[]`, ``);
      tempObj.append(`value[]`, `null`);
         tempObj.append(`value_to[]`, ``);
    }
    _this.props.handleLoadingShow(true);
    createLogicalJumpComp(
      params,
      tempObj,
      (res) => {
        _this.props.handleLoadingShow(false);
        successAlert("Updated Successfully!", _this.props.super_this);
        _this.props.handleCloseLogicalJumpModal();
      },
      (res) => {
        _this.setState({ loading: false });
        _this.props.handleLoadingShow(false);
      }
    );
  };
  deleteSelectRow = (value) => {
    let _this = this;
    let tempObj = {};
    const params = `bot_id=${_this.props.botIdURL}&question_id=${_this.props.logicalJumpQueId}&id=${value.id}`;
    _this.setState({ showDeleteModal: false });
    _this.props.handleLoadingShow(true);
    deleteLogicalJumpComponent(
      params,
      tempObj,
      () => {
        _this.props.handleLoadingShow(false);
        successAlert("Deleted Successfully!", _this.props.super_this);
        _this.fetchDataFromServer();
      },
      () => {
        _this.props.handleLoadingShow(false);
      }
    );
  };
  render() {
    let _this = this;
    return (
      <section className="add-chat-block-section">
        <div className="knowledge_header">
          <div
            role="button"
            onClick={() => {
              _this.props.handleCloseLogicalJumpModal();
            }}
          >
            <ChevronLeftIcon className="icon" />
            <div>
              <p>Logical jump for: Opinion Scale</p>
              <p
                className="logical_jump_text"
                dangerouslySetInnerHTML={{
                  __html: _this.props.logicalActiveMsg
                }}
              ></p>
            </div>
          </div>
        </div>

        <div className="main-section logical_jump_section">
          <div className="logical_add_more">
            {_this.state.data &&
              _this.state.data.length > 0 &&
              _this.state.data.map((prop, key) => {
                return (
                  <div className="number_jump">
                    <div className="number_jump_box">
                      <p>Jump {key + 1}</p>
                      <div
                        role="button"
                        onClick={() => {
                          if (prop.id === null || prop.id === undefined) {
                            let temp = _this.state.data;
                            temp.splice(key, 1);
                            _this.setState({
                              data: temp
                            });
                          } else {
                            _this.setState({
                              selectRow: prop,
                              showDeleteModal: true
                            });
                          }
                        }}
                        className="trash_img"
                      >
                        <img alt="" src={trash} />
                      </div>
                    </div>
                    <div className="jump_welcome jump_welcome_gap">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Condition"
                      >
                        <Form.Select
                          value={prop.condition}
                          onChange={(e) => {
                            let temp = _this.state.data;
                            temp[key].condition = e.target.value;
                            _this.setState({
                              data: temp
                            });
                          }}
                          aria-label="Floating label select example"
                        >
                          <option value={"equal_to"}>Equal To</option>
                          <option value={"between"}>Between </option>
                          <option value={"greater_than"}>Greater than </option>
                          <option value={"less_than"}>Less than </option>
                        </Form.Select>
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingInput" label="Equal to">
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number"
                          value={prop.value}
                          onChange={(e) => {
                            let temp = _this.state.data;
                            temp[key].value = e.target.value;
                            _this.setState({
                              data: temp
                            });
                          }}
                        />
                      </FloatingLabel>
                      {prop.condition === "between" ? (
                        <FloatingLabel
                          controlId="floatingInput"
                          label="value to"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter "
                            value={prop.value_to}
                            onChange={(e) => {
                              let temp = _this.state.data;
                              temp[key].value_to = e.target.value;
                              _this.setState({
                                data: temp
                              });
                            }}
                          />
                        </FloatingLabel>
                      ) : null}
                      {/* <Button variant="outlined">Sample button 01</Button> */}
                      <img src={shuffle} />
                      <FloatingLabel controlId="floatingSelect" label="Jump to">
                        <Form.Select
                          value={prop.jump_to_question}
                          onChange={(e) => {
                            let temp = _this.state.data;
                            temp[key].jump_to_question = e.target.value;
                            _this.setState({
                              data: temp
                            });
                          }}
                          aria-label="Floating label select example"
                        >
                          <option value={null}>No jump</option>
                          <option value={"-1"}>End of conversation</option>
                          {_this.state.question_lists &&
                            _this.state.question_lists.length > 0 &&
                            _this.state.question_lists.map((prop) => {
                              return (
                                <option
                                  value={prop.id}
                                  dangerouslySetInnerHTML={{
                                    __html: prop.label
                                  }}
                                ></option>
                              );
                            })}
                        </Form.Select>
                      </FloatingLabel>
                    </div>
                  </div>
                );
              })}
            <Button
              type="button"
              onClick={() => {
                let temp = _this.state.data;
                temp.push({
                  key: temp.length,
                  value:null,
                  jump_to_question: null,
                  value_to: "",
                  condition: "equal_to",
                  id:null,
                });
                _this.setState({
                  data: temp
                });
              }}
              className="logical_add_btn"
              variant="outlined"
            >
              <HiOutlinePlusSm />
              Add next jump
            </Button>
          </div>
          <div className="jump_question">
            <label>Answer other than above</label>
            <Form.Select
              aria-label="Floating label select example"
              value={_this.state.answered_other_than_jump_to}
              onChange={(e) => {
                _this.setState({
                  answered_other_than_jump_to: e.target.value
                });
              }}
            >
              <option value={null}>No jump</option>
              <option value={"-1"}>End of conversation</option>
              {_this.state.question_lists &&
                _this.state.question_lists.length > 0 &&
                _this.state.question_lists.map((prop) => {
                  return (
                    <option
                      value={prop.id}
                      dangerouslySetInnerHTML={{ __html: prop.label }}
                    ></option>
                  );
                })}
            </Form.Select>
          </div>
        </div>

        <div className="knowledge_footer logical_jump_footer">
          <div className="btn_block">
            <Button
              type="button"
              onClick={() => {
                _this.props.handleCloseLogicalJumpModal();
              }}
              variant="contained"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              s
              variant="contained"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
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
                        _this.deleteSelectRow(_this.state.selectRow);
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
      </section>
    );
  }
}

export default OpinionScaleComponent;
