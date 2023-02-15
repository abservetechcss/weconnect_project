import { Button } from "@mui/material";
import React, { Component } from "react";
import shuffle from "../../../../../../../assets/images/userdash/shuffle.svg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  createLogicalJumpComp,
  getLogicalJumpComp
} from "../../BuilderConversaionServer.js";
import { successAlert } from "../../../../../../../js/alerts.js";
export class MultiChoiceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jump_to: null,
      question_id: null,
      logical_jump: [],
      jump_to: null
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
         let temp = res.logical_jump.map((prop) => {
           return {
             chip_update_id: prop.id,
             chip_update: prop.jump_to_question,
             jump_to_question: prop.jump_to_question,
             name: prop.name
           };
         });
         _this.setState({
           logical_jump: temp
         });
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
    if (_this.state.logical_jump && _this.state.logical_jump.length > 0) {
      _this.state.logical_jump.map((prop) => {
        tempObj.append(`id[]`, `${prop.chip_update_id}`);
        tempObj.append(`jump_to_question[]`, `${prop.jump_to_question}`);
      });
    } else {
       tempObj.append(`id[]`, `null`);
       tempObj.append(`jump_to_question[]`, ``);
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
              <p>Logical jump for: Multiple Choice</p>
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
            {_this.state.logical_jump &&
              _this.state.logical_jump.length > 0 &&
              _this.state.logical_jump.map((prop, key) => {
                return (
                  <div className="jump_welcome">
                    <Button variant="outlined">{prop.name}</Button>
                    <img src={shuffle} />
                    <FloatingLabel controlId="floatingSelect" label="Jump to">
                      <Form.Select
                        aria-label="Floating label select example"
                        value={prop.jump_to_question}
                        onChange={(e) => {
                          let temp = _this.state.logical_jump;
                          temp[key].jump_to_question = e.target.value;
                          _this.setState({
                            logical_jump: temp
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
                    </FloatingLabel>
                  </div>
                );
              })}
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
              variant="contained"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </section>
    );
  }
}

export default MultiChoiceComponent;
