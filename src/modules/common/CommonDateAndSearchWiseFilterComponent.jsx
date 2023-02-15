import React, { Component, Fragment } from "react";
import { Dropdown, FloatingLabel, Form } from "react-bootstrap";
import searchIcon from "../../assets/images/search (1).svg";
import filter from "../../assets/images/Group 17736 (1).svg";
import arrow from "../../assets/images/Path 48024.svg";
import downArrow from "../../assets/images/Path 48024.svg";
import calenderIcon from "../../assets/images/calendar.svg";
import print1 from "../../assets/images/printer.svg";
import download from "../../assets/images/download.svg";
import file from "../../assets/images/file1.svg";
import deleteIcon from "../../assets/images/trash-2.svg";
import helpIcon from "../../assets/images/sidebar/help-circle.svg";

import DatePicker from "react-datepicker";
import {
  Menu,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Autocomplete,
  TextField,
} from "@mui/material";
import CsvDownloader from "react-csv-downloader";
import DownloadConversationReport from "../analytics/conversation/components/DownloadConversationReport.jsx";
import PrintConversationPageComponent from "../analytics/conversation/components/PrintConversationPageComponent.jsx";
import { MittContext } from "./WebSocketComponent";

export class CommonDateAndSearchWiseFilterComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      moreFilter: "or",
      showFilterModal: false,
      botName: "",
      ruleList: [
        { label: "contains", value: "contains" },
        { label: "doesn't contains", value: "doesn't contains" },
        { label: "equals", value: "equals" },
        { label: "not equals", value: "not equals" },
        { label: "is empty", value: "is empty" },
        { label: "is not empty", value: "is not empty" },
      ],
    };
  }
  handleFilterClick = (e) => {
    this.setState({ showFilterModal: e.currentTarget });
  };

  render() {
    let _this = this;
    const [startDate, endDate] = _this.props.filterDate;
    const filteropen = Boolean(this.state.showFilterModal);

    return (
      <Fragment>
        <Fragment>
          <div className="submain_header lead-sub-header-block">
            <div className="search_date_block">
              {_this.props.showBotList ? (
                <div className="search-block">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="selectBotId"
                    options={_this.props.botItemList && _this.props.botItemList}
                    value={_this.props._this.state.botName || ""}
                    isOptionEqualToValue={(option, value) => {
                      // console.log(option.label +"==="+ value);
                      if (value === undefined) {
                        return true;
                      }
                      return option.label === value;
                    }}
                    onChange={(e, option) => {
                      _this.context.emitter.emit("changebotUrl", {
                        botId: option.value,
                        botName: option.label,
                        url: "/user/analytics/conversation",
                      });
                      _this.props._this.setState(
                        {
                          botId: option.value,
                          botName: option.label,
                        },
                        () => {
                          if (option && option.label !== undefined) {
                            _this.props.fetchDataFromServer();
                          }
                        }
                      );
                    }}
                    className="conv_select"
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="" />}
                  />
                </div>
              ) : null}
              {!window.location.href.includes("/user/analytics/leads") && (
                <div className="search-block">
                  <Form.Group
                    className="search-block-cust"
                    controlId="formBasicEmail"
                  >
                    <div className="search-field-box">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        value={_this.props.searchValue}
                        onChange={(e) => {
                          _this.props.fetchAnalyticsSearchList(e.target.value);
                        }}
                      />
                      <a
                        role="button"
                        onClick={() => {
                          setTimeout(() => {
                            _this.props.fetchDataFromServer();
                          }, 10);
                        }}
                      >
                        <img src={searchIcon} alt="" />
                      </a>
                    </div>
                  </Form.Group>
                </div>
              )}

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
                        _this.props._this.setState({
                          filterDate: date,
                        });
                        if (date[0] !== null && date[1] !== null) {
                          setTimeout(() => {
                            _this.props.fetchDataFromServer();
                          }, 1000);
                        } else {
                          if (date[0] === null && date[1] === null) {
                            setTimeout(() => {
                              _this.props.fetchDataFromServer();
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
            </div>
            {window.location.href.includes("user/leads") ? (
              <div>
                <button
                  id="basic-button"
                  aria-controls={filteropen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={filteropen ? "true" : undefined}
                  onClick={this.handleFilterClick}
                  className="filter_box"
                >
                  <img src={filter} alt="" />
                  <p>Filter</p>
                  <img src={arrow} alt="" />
                </button>
              </div>
            ) : (
              <div className="lead_conv_subheader">
                <div
                  role="button"
                  onClick={() => {
                    _this.props.downloadConversationReport("print");
                  }}
                >
                  <img alt="" src={print1} />
                  <p>Print</p>
                </div>

                <div>
                  <div
                    role="button"
                    onClick={() => {
                      _this.props.downloadConversationReport("downloadExcel");
                    }}
                  >
                    <img alt="" src={file} />
                    Download Excel
                  </div>
                </div>

                <div
                  role="button"
                  onClick={() => {
                    _this.props.downloadConversationReport("download");
                  }}
                >
                  <img alt="" src={download} />
                  <p>Download PDF</p>
                </div>
              </div>
            )}
          </div>
          <Menu
            id="basic-menu"
            anchorEl={this.state.showFilterModal}
            open={filteropen}
            onClose={() => {
              _this.setState({
                showFilterModal: null,
              });
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className="leads_filter_popup"
          >
            {_this.props.applyFilter &&
              _this.props.applyFilter.length > 0 &&
              _this.props.applyFilter.map((prop, key) => {
                return (
                  <Fragment>
                    {key === 0 ? null : (
                      <div className="add_more_filters">
                        <ToggleButtonGroup
                          color="primary"
                          value={prop.conditionalOperator}
                          exclusive
                          onChange={(e) => {
                            let temp = _this.props.applyFilter;
                            temp[key].conditionalOperator = e.target.value;
                            _this.props._this.setState({
                              applyFilter: temp,
                            });
                          }}
                        >
                          <ToggleButton value="and">AND</ToggleButton>
                          <ToggleButton value="or">OR</ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    )}
                    <div className="filter_inputs">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Select Column"
                      >
                        <Form.Select
                          value={prop.columnName}
                          onChange={(e, name) => {
                            let temp = _this.props.applyFilter;
                            temp[key].columnName = e.target.value;
                            if (e.target.value.length > 1) {
                              temp[key].position =
                                _this.props.columnsList.filter((x) => {
                                  return x.value === e.target.value;
                                })[0].position;
                            }
                            if (key % 2 !== 0) {
                              temp[key].conditionalOperator = "";
                            }
                            _this.props._this.setState({
                              applyFilter: temp,
                            });
                          }}
                          aria-label="Floating label select example"
                        >
                          <option>Select...</option>
                          {_this.props.columnsList &&
                            _this.props.columnsList.length > 0 &&
                            _this.props.columnsList.map((list) => {
                              return (
                                <option value={list.value} name={list.position}>
                                  {list.label}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </FloatingLabel>
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Apply Rule"
                      >
                        <Form.Select
                          value={prop.rule}
                          onChange={(e) => {
                            let temp = _this.props.applyFilter;
                            temp[key].rule = e.target.value;
                            _this.props._this.setState({
                              applyFilter: temp,
                            });
                          }}
                          aria-label="Floating label select example"
                        >
                          <option>Select...</option>
                          {_this.state.ruleList.map((prop) => {
                            return (
                              <option value={prop.value}>{prop.label}</option>
                            );
                          })}
                        </Form.Select>
                      </FloatingLabel>

                      {prop.rule === "is not empty" ||
                      prop.rule === "is empty" ? (
                        <FloatingLabel
                          controlId="floatingPassword"
                          label=""
                        ></FloatingLabel>
                      ) : (
                        <FloatingLabel
                          controlId="floatingPassword"
                          label="Value"
                        >
                          <Form.Control
                            value={prop.value.trim()}
                            onChange={(e) => {
                              let temp = _this.props.applyFilter;
                              temp[key].value = e.target.value.trim();
                              _this.props._this.setState({
                                applyFilter: temp,
                              });
                            }}
                            type="text"
                            placeholder="Name"
                          />
                        </FloatingLabel>
                      )}

                      {key === 0 ? (
                        <Button
                          type="button"
                          onClick={() => {
                            let temp = _this.props.applyFilter;
                            temp.push({
                              key:
                                _this.props.applyFilter &&
                                _this.props.applyFilter.length,
                              columnName: null,
                              rule: null,
                              value: "",
                              position: "",
                              conditionalOperator: "or",
                            });
                            _this.props._this.setState({
                              applyFilter: temp,
                            });
                          }}
                          variant="contained"
                          className="add_btn"
                        >
                          Add
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => {
                            let temp = _this.props.applyFilter;
                            temp.splice(key, 1);
                            _this.props._this.setState({
                              applyFilter: temp,
                            });
                          }}
                          variant="contained"
                          className="add_btn"
                        >
                          {/* delete */}
                          <img src={deleteIcon} alt="" />
                        </Button>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            <div className="filter_btn_block">
              <Button
                type="button"
                onClick={() => {
                  _this.props._this.setState({
                    applyFilter: [
                      {
                        key: 0,
                        columnName: null,
                        rule: null,
                        value: "",
                        position: null,
                        conditionalOperator: "or",
                      },
                    ],
                  });
                  _this.setState({
                    showFilterModal: null,
                  });
                  //  setTimeout(() => {
                  //    _this.props.fetchDataFromServer();
                  //  }, 1000);
                }}
                variant="contained"
                className="cancel-btn"
              >
                Clear{" "}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  _this.setState({
                    showFilterModal: null,
                  });
                  setTimeout(() => {
                    _this.props.fetchApplyFilterDataFromServer();
                  }, 1000);
                }}
                variant="contained"
                className="submit-btn"
              >
                Apply
              </Button>
            </div>
          </Menu>
        </Fragment>

        <DownloadConversationReport
          {..._this.props}
          downloadReportList={_this.props.downloadReportList}
          downloadReportColumn={_this.props.downloadReportColumn}
          showDownloadModal={_this.props.showDownloadModal}
          closeDownloadModal={() => {
            _this.props._this.setState({
              showDownloadModal: false,
            });
          }}
        />

        <PrintConversationPageComponent
          {..._this.props}
          downloadReportList={_this.props.downloadReportList}
          downloadReportColumn={_this.props.downloadReportColumn}
          showPrintModal={_this.props.showPrintModal}
          closeDownloadModal={() => {
            _this.props._this.setState({
              showPrintModal: false,
            });
          }}
        />

        <Dialog
          open={_this.props.showDownloadExcelReport}
          onClose={() => {
            _this.props._this.setState({
              showDownloadExcelReport: false,
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
                  <small>Download report for conversation!</small>
                </p>
                <div className="info-btn-block">
                  <img src={helpIcon} alt="" />
                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={() => {
                        _this.props._this.setState({
                          showDownloadExcelReport: false,
                        });
                      }}
                    >
                      No
                    </Button>
                    <CsvDownloader
                      filename="conversation"
                      extension=".csv"
                      columns={_this.props.downloadReportColumn}
                      datas={_this.props.downloadReportList}
                      text="DOWNLOAD"
                    >
                      <Button
                        className="leave-btn"
                        variant="contained"
                        onClick={() => {
                          _this.props._this.setState({
                            showDownloadExcelReport: false,
                          });
                        }}
                      >
                        Yes
                      </Button>
                    </CsvDownloader>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default CommonDateAndSearchWiseFilterComponent;
