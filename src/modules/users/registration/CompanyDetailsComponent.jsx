import React, { Component, Fragment } from "react";
import Alert from "@mui/material/Alert";
import { FloatingLabel, Form } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SimpleReactValidator from "simple-react-validator";
import {
  userCreateCompanyDetails,
  getCompanyDetails,
  getCompanySizeList,
  getIndustryList
} from "./server/RegistrationServer.js";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import LoadingButton from "react-bootstrap-button-loader";

import TimezoneSelect, { allTimezones } from "react-timezone-select";
import spacetime from "spacetime";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { AlertContext }  from "../../common/Alert";

const { getCode, getName } = require("country-list");

export class CompanyDetailsComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      alert: null,
      loading: false,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      datetime: spacetime.now(),
      flag: "",
      countryName: "",
      companyInfo: {
        name: localStorage.getItem("name"),
        company_name: "",
        phone_number: "",
        company_size: "",
        industry_type: "",
        timezone: ""
      },
      industryList: [],
      companySizeList: []
    };
  }

  getCompanySizeList = async (id) => {
    let _this = this;
    const res =  await getCompanySizeList();
    const newObj = res.data.list.map(item=>{
      return {
        label: item.company_size,
        value: item.id
      }
    });

      const updateState = {
        companySizeList: newObj
      };
      
      _this.setState(updateState);

      let data = newObj[0];
      if(id !=='') {
        data = newObj.find(item=>item.value===id);
      }

      return data; 
  }

  getIndustryList = async (id) => {
    let _this = this;
    const res = await getIndustryList();
    const newObj = res.data.industry.map(item=>{
      return {
        label: item.industry_name,
        value: item.id
      }
    })
    const updateState = {
      industryList: newObj
    };

    _this.setState(updateState)

    let data = newObj[0];
      if(id !=='') {
        data = newObj.find(item=>item.value===id);
      }
    return data;
}

  componentDidMount() {
    window.scrollTo(0, 0);
    let _this = this;
    axios.get("https://www.cloudflare.com/cdn-cgi/trace").then(function (res) {
      const data = res.data;
      let ipPath = data.split("\n")[9];
      let countryCode = ipPath.split("=")[1];
      let countryName = getName(countryCode);
      console.log("countryName", countryCode);
      _this.setState({
        country: countryName,
        countryCode: countryCode,
        countryName: countryName.toLowerCase(),
        flag: countryCode.toLowerCase()
      });
    });
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = "";
    _this.setState({ loading: true });
    _this.context.showLoading();
    getCompanyDetails(
      params,
      async (res) => {
        const companyInfo = res.company_details;

        if (companyInfo && companyInfo.timezone !== "") {
         localStorage.removeItem("timezone");
          localStorage.setItem("timezone", companyInfo.timezone);
          _this.props.handleClosePop();
        }
        try {
          companyInfo.company_size = await this.getCompanySizeList(companyInfo.company_size);
          companyInfo.industry_type = await this.getIndustryList(companyInfo.industry_type);
        } catch (err) {
          console.log("err", err);
        }

        _this.setState({
          companyInfo: res.company_details,
        },()=>{
          _this.context.showLoading(false);
          _this.setState({ loading: false });
        });
      },
      () => {
        _this.context.showLoading(false);
        _this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    var _this = this;
    if (_this.validator.allValid()) {
      var _this = this;
      let temp = JSON.parse(JSON.stringify(_this.state.companyInfo));
      
      temp.company_size = temp.company_size && temp.company_size.value? temp.company_size.value:1;
      temp.industry_type = temp.industry_type && temp.industry_type.value? temp.industry_type.value:1;

      if (temp.timezone && temp.timezone.value) {
        temp.timezone = temp.timezone && temp.timezone.value;
      }
      _this.setState({ loading: true });
      userCreateCompanyDetails(
        _this,
        temp,
        (res) => {
         localStorage.removeItem("timezone");
          localStorage.setItem("timezone", temp.timezone);
          _this.setState({ loading: false });
          _this.props.handleClosePop();
          successAlert(
            "Company Details saved Successfully!",
            _this.props._this
          );
        },
        (res) => {
          _this.setState({ loading: false });
          if (res.data.message) errorAlert(`${res.data.message}!`, _this);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    var newObj = this.state.companyInfo;
    newObj[e.target.name] = e.target.value;
    this.setState({ companyInfo: newObj });
  };
  handleContactChange = (e) => {
    var newObj = this.state.companyInfo;
    newObj.phone_number = e;
    this.setState({ companyInfo: newObj });
  };
  render() {
    let _this = this;

    return (
      <Fragment>
        <div className="first-model-block">
          <Alert severity="info">
            Please update below information to continue.
          </Alert>
          <div className="form">
            <div className="block input-block">
              <FloatingLabel
                className="floating-input-field-block-cust"
                controlId="floatingPassword"
                label="Name"
              >
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={
                    _this.state.companyInfo && _this.state.companyInfo.name
                  }
                  onChange={this.handleInputChange}
                />
                <div className="errorMsg">
                  {_this.validator.message(
                    "name",
                    _this.state.companyInfo && _this.state.companyInfo.name,
                    "required"
                  )}
                </div>
              </FloatingLabel>
            </div>
            <div className="block input-block">
              <FloatingLabel
                className="floating-input-field-block-cust"
                controlId="floatingPassword"
                label="Company"
              >
                <Form.Control
                  type="text"
                  placeholder="Company name"
                  name="company_name"
                  value={
                    _this.state.companyInfo &&
                    _this.state.companyInfo.company_name
                  }
                  onChange={this.handleInputChange}
                />
                <div className="errorMsg">
                  {_this.validator.message(
                    "company name",
                    _this.state.companyInfo &&
                      _this.state.companyInfo.company_name,
                    "required"
                  )}
                </div>
              </FloatingLabel>
            </div>
            <div className=" block input-block">
              <ReactPhoneInput
                inputExtraProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                }}
                style={{ width: "100%" }}
                 country={_this.state.flag}
                name="phone_number"
                value={
                  _this.state.companyInfo &&
                  _this.state.companyInfo.phone_number
                }
                onChange={this.handleContactChange}
              />
              {/* <div className="errorMsg">
                      {_this.validator.message(
                        "phone",
                        _this.state.user && _this.state.user.phone,
                        "required"
                      )}
                    </div> */}
            </div>
            <div className="block select-block">
              <Form.Group className="select-field-block-cust">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={_this.state.companySizeList}
                  name="company_size"
                  value={
                    _this.state.companyInfo &&
                    _this.state.companyInfo.company_size
                  }
                  onChange={(e, option) => {
                    let temp = _this.state.companyInfo;
                    temp.company_size = option;
                    _this.setState({
                      companyInfo: temp,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Company size" />
                  )}
                />
                <div className="errorMsg">
                  {_this.validator.message(
                    "company size",
                    _this.state.companyInfo &&
                      _this.state.companyInfo.company_size,
                    "required"
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="block select-block">
              <Form.Group className="select-field-block-cust">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={_this.state.industryList}
                  name="industry_type"
                  value={
                    _this.state.companyInfo &&
                    _this.state.companyInfo.industry_type
                  }
                  onChange={(e, option) => {
                    let temp = _this.state.companyInfo;
                    temp.industry_type = option;
                    _this.setState({
                      companyInfo: temp,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Industry type" />
                  )}
                />
                <div className="errorMsg">
                  {_this.validator.message(
                    "industry type",
                    _this.state.companyInfo &&
                      _this.state.companyInfo.industry_type,
                    "required"
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="block select-block">
              <FloatingLabel
                controlId="floatingSelect"
                label=""
                className="time-zone-block"
                placeholder="Select timezone"
              >
                <TimezoneSelect
                  name="timezone"
                  value={
                    _this.state.companyInfo && _this.state.companyInfo.timezone
                  }
                  onChange={(time) => {
                    var newObj = _this.state.companyInfo;
                    newObj.timezone = time;
                    _this.setState({
                      companyInfo: newObj,
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
                  _this.state.companyInfo && _this.state.companyInfo.timezone,
                  "required"
                )}
              </div>
            </div>
            <div className="btn-block">
              <LoadingButton
                variant="contained"
                type="button"
                loading={_this.state.loading}
                onClick={() => {
                  _this.onSubmit();
                }}
                autoFocus
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CompanyDetailsComponent;
