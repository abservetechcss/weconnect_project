import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Button, Grid } from "@mui/material";
import { MenuItem, Select, FormControl } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  getCompanyDetailsList,
  updateCompanyDetails,
} from "../server/EditProfileServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert, errorAlert } from "../../../../js/alerts";
import { languageFlagList } from "../../../../variables/appVariables.jsx";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import spacetime from "spacetime";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default class CompanyDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      datetime: spacetime.now(),
      companyDetails: {
        company_name: "",
        company_size: "",
        industry_type: "",
        language: "",
        timezone: "",
        company_email: "",
        company_address: "",
        city: "",
        zipcode: "",
      },
      industryList: [
        { label: "Software", value: "1" },
        { label: "Retail", value: "2" },
        { label: "Agency", value: "3" },
        { label: "Consulting", value: "4" },
        { label: "Education", value: "6" },
        { label: "Healthcare", value: "5" },
      ],
      companySizeList: [
        { label: "1 - 10", value: "1" },
        { label: "11 - 100", value: "2" },
        { label: "101 - 500", value: "3" },
        { label: "500 +", value: "4" },
      ],
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getCompanyDetailsList(
      "",
      (res) => {
        let temp = res.basicaccount;
        _this.setState({
          companyDetails: temp,
        });

        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.companyDetails));
    // if (
    //   tempObj.company_size = _this.state.companySizeList.filter((x) => {
    //     return x.value == tempObj.company_size;
    //   }).length>0)
    //  {
    //   tempObj.company_size = _this.state.companySizeList.filter((x) => {
    //     return x.value == tempObj.company_size;
    //   })[0].value;
    // }
    if (
      _this.state.industryList.filter((x) => {
        return x.value == tempObj.industry_type;
      }).length > 0
    ) {
      tempObj.industry_type = _this.state.industryList.filter((x) => {
        return x.value == tempObj.industry_type;
      })[0].value;
    }

    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      if (tempObj.timezone && tempObj.timezone.value) {
        tempObj.timezone = tempObj.timezone && tempObj.timezone.value;
      }
      updateCompanyDetails(
        _this,
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert(
            "Company Details Updated Successfully!",
            _this.props._this
          );
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(1);
        },
        (res) => {
          errorAlert(
            res.message || "Update company details faied",
            _this.props._this
          );
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    var newObj = this.state.companyDetails;
    newObj[e.target.name] = e.target && e.target.value;
    this.setState({ companyDetails: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Company details</p>
            <p className="desc"></p>
          </div>
          <div className="main-block">
            {" "}
            <div className="basic-acc-block">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FloatingLabel controlId="floatingInput" label="Company name">
                    <Form.Control
                      type="text"
                      placeholder="Company name"
                      name="company_name"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.company_name
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "company name",
                      _this.state.companyDetails &&
                        _this.state.companyDetails.company_name,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    className="language-selector"
                    label="Company size"
                  >
                    <Select
                      displayEmpty
                      style={{ width: "100%" }}
                      inputProps={{ "aria-label": "Without label" }}
                      name="company_size"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.company_size
                      }
                      onChange={this.handleInputChange}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                          Select company size
                        </p>
                      </MenuItem>
                      {_this.state.companySizeList &&
                        _this.state.companySizeList.length > 0 &&
                        _this.state.companySizeList.map((prop, i) => {
                          return (
                            <MenuItem key={i} value={prop.value}>
                              {` ${prop.label}`}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "company size",
                      _this.state.companyDetails &&
                        _this.state.companyDetails.company_size,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    className="language-selector"
                    label="Industry"
                  >
                    <Select
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      name="industry_type"
                      style={{ width: "100%" }}
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.industry_type
                      }
                      onChange={this.handleInputChange}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                          Select industry type
                        </p>
                      </MenuItem>
                      {_this.state.industryList &&
                        _this.state.industryList.length > 0 &&
                        _this.state.industryList.map((prop, i) => {
                          return (
                            <MenuItem key={i} value={prop.value}>
                              {` ${prop.label}`}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "Industry",
                      _this.state.companyDetails &&
                        _this.state.companyDetails.industry_type,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Language preference"
                    className="language-selector"
                  >
                    <FormControl fullWidth className="">
                      <Select
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        name="language"
                        value={
                          _this.state.companyDetails &&
                          _this.state.companyDetails.language
                        }
                        onChange={this.handleInputChange}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="">
                          <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                            Select language
                          </p>
                        </MenuItem>
                        {languageFlagList &&
                          languageFlagList.length > 0 &&
                          languageFlagList.map((prop, i) => {
                            return (
                              <MenuItem key={i} value={prop.value}>
                                {` ${prop.label}`}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </FloatingLabel>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Company timezone"
                    className="time-zone-block"
                  >
                    <TimezoneSelect
                      name="timezone"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.timezone
                      }
                      onChange={(time) => {
                        var newObj = _this.state.companyDetails;
                        newObj.timezone = time;
                        _this.setState({
                          companyDetails: newObj,
                        });
                      }}
                      timezones={{
                        ...allTimezones,
                        "America/Lima": "Pittsburgh",
                        "Europe/Berlin": "Frankfurt",
                      }}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "timezone",
                      _this.state.companyDetails &&
                        _this.state.companyDetails.timezone,
                      "required"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Company email"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Company email"
                      name="company_email"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.company_email
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "company email",
                      _this.state.companyDetails &&
                        _this.state.companyDetails.company_email,
                      "required|email"
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Company address"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Company address"
                      style={{ height: "87px" }}
                      name="company_address"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.company_address
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                </Grid>
                <Grid item xs={6}>
                  <FloatingLabel
                    style={{ marginBottom: "16px" }}
                    controlId="floatingPassword"
                    label="City"
                  >
                    <Form.Control
                      type="text"
                      placeholder="City"
                      name="city"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.city
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword" label="Zip code">
                    <Form.Control
                      type="text"
                      placeholder="Zip code"
                      name="zipcode"
                      value={
                        _this.state.companyDetails &&
                        _this.state.companyDetails.zipcode
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                </Grid>
              </Grid>
            </div>
          </div>
          <div className="footer">
            <Button
              type="button"
              onClick={() => {
                _this.fetchDataFromServer();
              }}
              variant="outlined"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              variant="outlined"
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
