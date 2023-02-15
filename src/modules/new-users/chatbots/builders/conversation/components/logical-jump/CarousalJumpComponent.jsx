import { Button } from "@mui/material";
import React, { Component } from "react";
import shuffle from "../../../../../../../assets/images/userdash/shuffle.svg";
import trash from "../../../../../../../assets/images/userdash/trash-2.svg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { HiOutlinePlusSm } from "react-icons/hi";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  createLogicalJumpComp,
  getLogicalJumpComp
} from "../../BuilderConversaionServer.js";
import { successAlert } from "../../../../../../../js/alerts.js";

export class CarousalJumpComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question_lists: [],
carousel: [],
chips: [],
     
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
        let tempObj1 = [];
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
        if (res.carousel && res.carousel.length > 0) {
          res.carousel.map((prop) => {
            tempObj.push({
              key: 0,
              id: prop.id,
              value: prop.value,
              name: prop.name === undefined ? "Sample button 01" : prop.name,
              jump_to_question: prop.jump_to_question
            });
          });
        } else {
         
        }
          if (res.chips && res.chips.length > 0) {
            res.chips.map((prop) => {
              tempObj1.push({
                key: 0,
                id: prop.id,
                value: prop.value,
                name: prop.name === undefined ? "Sample button 01" : prop.name,
                jump_to_question: prop.jump_to_question
              });
            });
          } else {
            tempObj1.push({
              value: "",
              id: null,
              name: "",
              jump_to_question: null,
              
            });
          }
        _this.setState({
          question_lists: temp,
          carousel: tempObj,
          chips:tempObj1,          
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
    if (_this.state.carousel && _this.state.carousel.length > 0) {
      _this.state.carousel.map((prop) => {
        tempObj.append(`jump_to_question[]`, `${prop.jump_to_question}`);
        tempObj.append(`id[]`, `${prop.id}`);
      });
    } else {
     tempObj.append(`jump_to_question[]`, ``);
     tempObj.append(`id[]`, `null`);  
   }
    
    if (_this.state.chips && _this.state.chips.length > 0) {
        _this.state.chips.map((prop) => {
          tempObj.append(`jump_to_question[]`, `${prop.jump_to_question}`);
          tempObj.append(`id[]`, `${prop.id}`);
        });
    } else {
      
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
              <p>Logical jump for: Carousal</p>
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
          <div className="carousal_jump">
            <p className="carousal_label">Carousel</p>
            {_this.state.carousel &&
              _this.state.carousel.length > 0 &&
              _this.state.carousel.map((prop, key) => {
                return (
                  <div className="jump_welcome">
                    <Button variant="outlined">
                      {prop.name} 
                    </Button>
                    <img src={shuffle} />
                    <FloatingLabel controlId="floatingSelect" label="Jump to">
                      <Form.Select
                        value={prop.jump_to_question}
                        onChange={(e) => {
                          let temp = _this.state.carousel;
                          temp[key].jump_to_question = e.target.value;
                          _this.setState({
                            carousel: temp
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
                );
              })}
          </div>
          <div className="carousal_jump">
            <p className="carousal_label">Chips</p>
            {_this.state.chips &&
              _this.state.chips.length > 0 &&
              _this.state.chips.map((prop, key) => {
                return (
                  <div className="jump_welcome">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Sample title"
                      className="carousal_input"
                    
                    >
                      <Form.Control type="text"
                        placeholder="Sample title"
                          value={prop.name}
                     disabled
                         />
                    </FloatingLabel>
                    <img src={shuffle} />
                    <FloatingLabel controlId="floatingSelect" label="Jump to">
                      <Form.Select
                        value={prop.jump_to_question}
                        onChange={(e) => {
                          let temp = _this.state.chips;
                          temp[key].jump_to_question = e.target.value;
                          _this.setState({
                            chips: temp
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
                );
              })}
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

export default CarousalJumpComponent;
