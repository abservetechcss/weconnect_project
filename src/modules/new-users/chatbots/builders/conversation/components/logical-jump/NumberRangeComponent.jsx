import { Button } from "@mui/material";
import React, { Component } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  createLogicalJumpComp,
  getLogicalJumpComp
} from "../../BuilderConversaionServer.js";
import { successAlert } from "../../../../../../../js/alerts.js";
export class NumberRangeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question_lists: [],
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
        if (res.question_lists && res.question_lists.length > 0) {
          let temp = res.question_lists.map((prop) => {
            return {
              id: prop.id,
              label: prop.chat_message,
              value: prop.id
            };
          });
          _this.setState({
            jump_to: res.answered_other_than_jump_to,
            question_lists: temp
          });
        }
      },
      (error) => {}
    );
  }

  onSubmit = () => {
    let _this = this;
    const params = `bot_id=${_this.props.botIdURL}&question_id=${_this.props.logicalJumpQueId}`;
    let tempObj = {
      jump_to_question: _this.state.jump_to,
      question_id: _this.props.logicalJumpQueId,
      bot_id: _this.props.botIdURL
    };
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
      <>
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
                <p>Logical jump for: Number Range</p>
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
            <FloatingLabel controlId="floatingSelect" label="Jump to">
              <Form.Select
                aria-label="Floating label select example"
                value={_this.state.jump_to}
                onChange={(e) => {
                  _this.setState({
                    jump_to: e.target.value
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
      </>
    );
  }
}

export default NumberRangeComponent;
