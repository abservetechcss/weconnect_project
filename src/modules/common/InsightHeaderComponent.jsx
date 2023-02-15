import React, { Fragment, useState, useContext } from "react";
import { Form } from "react-bootstrap";
import searchIcon from "../../assets/images/search (1).svg";
import downArrow from "../../assets/images/Path 48024.svg";
import calenderIcon from "../../assets/images/calendar.svg";
import DatePicker from "react-datepicker";
import {
  Button,
  Autocomplete,
  TextField,
  Drawer,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import arrow from "../../assets/images/chevron-left (1).svg";
import { MittContext } from "./WebSocketComponent";

function InsightHeaderComponent(props) {
  const emitterContext = useContext(MittContext);

  const [startDate, endDate] = props.createFunnel?props.createFunnelDate: props.filterDate;
  const [state, setState] = React.useState({
    right: false,
  });


  return (
    <Fragment>
      <div className="submain_header lead-sub-header-block insight-sub-header">
        <div className="search_date_block">
          <div className="search-block">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              name="selectBotId"
              options={props._this.state.botItemList}
              value={props._this.state.botName}
              onChange={(e, option) => {
                

                props._this.setState({
                  botId: option.value,
                  botName: option.label,
                },()=>{
                  if (option && option.label !== undefined) {
                    const url = window.location.href.includes('/user/analytics/funnel') ? '/user/analytics/funnel':
                    window.location.href.includes('/user/analytics/indicators') ? '/user/analytics/indicators': '/user/analytics/insights';
                    emitterContext.emitter.emit("changebotUrl", {
                      botId: option.value,
                      botName: option.label,
                      url: url
                    });

                    if (props.createFunnel) {
                      props.fetchCreateFunnel();
                    } else {
                      props.fetchDataFromServer();
                    }
                }
                });
                
              }}
              className="conv_select"
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="" />}
            />
          </div>

          {window.location.href.includes("user/analytics/insights") ||
          props.createFunnel ? (
            <Fragment>
              <div className="date-picker-range-block-cust">
                <div className="icon-block">
                  <img src={calenderIcon} className="calender-icon" alt="" />
                </div>
                <div className="date-picker-box">
                  <fieldset>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                        onChange={(date) => {
                          if (props.createFunnel) {
                          props.filterDate1(date);
                          } else {
                             props._this.setState({
                               filterDate: date
                             });
                        }
                         
                        if (date[0] !== null && date[1] !== null) {
                          setTimeout(() => {
                            if (props.createFunnel) {
                              props.fetchCreateFunnel();
                            } else {
                              props.fetchDataFromServer();
                            }
                          }, 1000);
                        } else {
                          if (date[0] === null && date[1] === null) {
                            setTimeout(() => {
                              if (props.createFunnel) {
                                props.fetchCreateFunnel();
                              } else {
                                props.fetchDataFromServer();
                              }
                            }, 1000);
                          }
                        }
                      }}
                      isClearable={true}
                      dateFormat="MMMM d"
                      // withPortal
                    />
                  </fieldset>
                  <img src={downArrow} alt="" />
                </div>
              </div>
              {props.createFunnel ? (
                <div>
                  <div>
                    {["right"].map((anchor) => (
                      <React.Fragment key={anchor}>
                        <div
                          className="edit_que_text"
                          onClick={() => {
                            setState({right:true});
                          }}
                        >
                          Edit questions
                        </div>
                        <Drawer
                          anchor={anchor}
                          open={state[anchor]}
                          onClose={() => {
                           setState({ right: false });
                          }}
                        >
                          <Box
                            sx={{
                              width:
                                anchor === "top" || anchor === "bottom"
                                  ? "auto"
                                  : 512
                            }}
                            role="presentation"
                            // onClick={toggleDrawer(anchor, false)}
                            // onKeyDown={toggleDrawer(anchor, false)}
                          >
                            <div className="edit_question_drawer">
                              <div className="edit_question_header">
                                <p className="created_heading">
                                  Created Funnel
                                </p>
                                <p
                                  role="button"
                                  onClick={() => {
 setState({ right: false });
                                  }}
                                  className="back_text"
                                >
                                  <img src={arrow} />
                                  Back
                                </p>
                              </div>
                              <Form.Group
                                className="search-block-cust"
                                controlId="formBasicEmail"
                              >
                                <div className="search-field-box">
                                  <Form.Control
                                    type="text"
                                    placeholder="Search questions"
                                  />
                                  <img src={searchIcon} alt="" />
                                </div>
                              </Form.Group>
                              <div className="funnel_main">
                                <FormGroup>
                                  {props.resultData &&
                                  props.resultData.length > 0 ? (
                                    props.resultData.map((prop, index) => {
                                      return (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={prop.value}
                                              value={prop.value}
                                              onChange={(e) => {
                                                let temp = props.question_lists;
                                                temp[index].value = !prop.value;
                                                props._this.setState({
                                                  question_lists: temp
                                                });
                                              }}
                                            />
                                          }
                                          label={prop.question}
                                        />
                                      );
                                    })
                                  ) : (
                                    <div className="text-center alert alert-danger">
                                      No questions found!
                                    </div>
                                  )}
                                </FormGroup>
                              </div>
                              <div className="funnel_btn_block">
                                <Button
                                  variant="contained"
                                  className="fcancel_btn"
                                  type="button"
                                  onClick={() => {
                                     setState({ right: false });
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  className="fupdate_btn"
                                  type="button"
                                  onClick={() => {
                                    props._this.setState({
                                    question_lists:props.resultData
                                    });
                                    // props.fetchCreateFunnel();
                                    setTimeout(() => {
                                      props.fetchCreateFunnel();
                                      setState({ right: false });
                                    }, 1000);
                                  }}
                                >
                                  Update funnel
                                </Button>
                              </div>
                            </div>
                          </Box>
                        </Drawer>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : null}
            </Fragment>
          ) : null}

          {props.funnel ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              {props.question_lists && props.question_lists.length > 0 ? (
                <Fragment>
                  <div
                    role="button"
                    onClick={() => {
                      let temp = props.question_lists;
                      temp.map((prop) => {
                        prop.value = true;
                      });
                      props._this.setState({
                        question_lists: temp,
                      });
                    }}
                  >
                    <p className="funnel_question_header_text">
                      Select All Questions
                    </p>
                  </div>
                  <div
                    role="button"
                    onClick={() => {
                      let temp = props.question_lists;
                      temp.map((prop) => {
                        prop.value = false;
                      });
                      props._this.setState({
                        question_lists: temp,
                      });
                    }}
                  >
                    <p className="funnel_reset_header_text">Reset All</p>
                  </div>
                </Fragment>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}

export default InsightHeaderComponent;
