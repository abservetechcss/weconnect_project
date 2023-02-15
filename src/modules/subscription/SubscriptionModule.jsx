import React, { Component, Fragment } from "react";
import { Box, Tab } from "@mui/material";
import { Link, withRouter } from "react-router-dom";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import SubscriptionPlanList from "./components/SubscriptionPlanList.jsx";
import InvoiceComponent from "./components/InvoiceComponent";
import SubscriptionBillingPage from "./components/SubscriptionBillingPage.jsx";
import BillingSummary from "./components/BillingSummary.jsx";
import {
  getSubscriptionPlanList,
  getSubscriptionBillingAddress,
  updateCompanyBillingAddr,
  GetPaymentStatus,
} from "./server/SubscriptionServer.js";
import SimpleReactValidator from "simple-react-validator";
import { AlertContext } from "../common/Alert";
import Summary from "./components/Summary.jsx";

export class SubscriptionModule extends Component {
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
      activeSettingTab: 3,
      selectTab: "year",
      feature_list: [],
      monthly_list: [],
      yearly_list: [],
      plan_list_monthly_yearly: [],
      firstStep: true,
      secondStep: false,
      thirdStep: false,
      fourthStep: false,
      selectPlan: {},
      plan_expiry_date: null,
      payment: {
        country: null,
        invoice_email: "",
        address: "",
        expiry: "",
        cvc: "",
        card_number: "",
        company_name: "",
        full_name: "",
      },
      CouponDiscount: 0,
      taxAmount: 0,
      couponCode: "",
      couponCodeLoading: false,
      applyCouponCode: false,
      total_Amt: 0,
      finalAmount: 0,
      beforeAmount: 0,
      mollieToken: null,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    _this.fetchBillingAddress();
    _this.validator.hideMessages();
    if (_this.props.match.params.id) {
      GetPaymentStatus(
        _this,
        _this.props.match.params.id,
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
            message: err.message || "Payment Failed",
          });
        }
      );
    }
  }

  fetchDataFromServer = () => {
    let _this = this;
    _this.setState({ loading: true });
    getSubscriptionPlanList(
      "",
      (res) => {
        _this.setState({
          loading: false,
        });
        let tempObj = [],
          monthly_list = [],
          yearly_list = [];
        Object.keys(res.feature_list) &&
          Object.keys(res.feature_list).length > 0 &&
          Object.keys(res.feature_list).map((prop, key) => {
            tempObj.push({
              name: res.feature_list[prop],
              id: prop,
              show: key < 3 ? true : false,
            });
          });
        monthly_list =
          res.full_feature_monthly_yearly &&
          res.full_feature_monthly_yearly.monthly.length > 0 &&
          res.full_feature_monthly_yearly.monthly.map((prop) => {
            prop.show = false;
            prop.index = 3;
            return prop;
          });
        yearly_list =
          res.full_feature_monthly_yearly &&
          res.full_feature_monthly_yearly.yearly.length > 0 &&
          res.full_feature_monthly_yearly &&
          res.full_feature_monthly_yearly.yearly.map((prop) => {
            prop.show = false;
            prop.index = 3;
            return prop;
          });
        _this.setState({
          loading: false,
          activeSettingTab: 3,
          selectTab: "year",
          feature_list: tempObj,
          monthly_list: monthly_list,
          yearly_list: yearly_list,
          plan_list_monthly_yearly: res.plan_list_monthly_yearly,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  fetchBillingAddress = () => {
    let _this = this;
    getSubscriptionBillingAddress(
      "",
      (res) => {
        let temp = res.company_details;
        let newObj = _this.state.payment;
        newObj.country = temp.country;
        newObj.invoice_email = temp.email;
        newObj.company_name = temp.company_name;
        newObj.address = temp.address;
        _this.setState({
          payment: newObj,
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.payment));
    updateCompanyBillingAddr(
      tempObj,
      (res) => {
        setTimeout(() => {
          _this.setState({
            //  beforeAmount:_this.state.finalAmount,
            firstStep: false,
            secondStep: false,
            thirdStep: true,
            fourthStep: false,
          });
        }, 10);
        _this.fetchBillingAddress();
      },
      (res) => {}
    );
  };
  render() {
    let _this = this;

    let form = (
      <Fragment>
        {/* <div className="upgrade_plan_block">
          <p>
            To keep using this account after the trial ends, set up a
            subscription.
          </p>
          <p>
            Free trail ends in <span>11 days</span>
          </p>
        </div> */}
        <section className="subscription_block">
          <TabContext value={_this.state.activeSettingTab}>
            <Box className="subscription_tabs">
              <TabList
                defaultActiveKey={_this.state.activeSettingTab}
                value={_this.state.activeSettingTab}
                aria-label="lab API tabs example"
              >
                <Tab
                  className="tab_names"
                  label="Summary"
                  role="button"
                  onClick={() => {
                    _this.setState({
                      activeSettingTab: 3,
                    });
                  }}
                  value={3}
                />
                <Tab
                  className="tab_names"
                  label="Plan and Pricing"
                  role="button"
                  onClick={() => {
                    _this.setState({
                      activeSettingTab: 1,
                    });
                  }}
                  value={1}
                />
                <Tab
                  className="tab_names"
                  label="Invoice"
                  role="button"
                  onClick={() => {
                    _this.setState({
                      activeSettingTab: 2,
                    });
                  }}
                  value={2}
                />
              </TabList>
            </Box>
            <TabPanel value={1}>
              {_this.state.activeSettingTab === 1 ? (
                _this.state.firstStep ? (
                  <SubscriptionPlanList
                    _this={_this}
                    loading={_this.state.loading}
                    selectTab={_this.state.selectTab}
                    monthly_list={_this.state.monthly_list}
                    yearly_list={_this.state.yearly_list}
                    feature_list={_this.state.feature_list}
                    selectActiveTab={(value) => {
                      _this.setState({
                        activeSettingTab: value,
                      });
                    }}
                    handleLoadingShow={(value) => {
                      _this.setState({
                        loading: value,
                      });
                    }}
                    {..._this.props}
                  />
                ) : _this.state.secondStep ? (
                  <SubscriptionBillingPage
                    _this={_this}
                    selectTab={_this.state.selectTab}
                    monthly_list={_this.state.monthly_list}
                    yearly_list={_this.state.yearly_list}
                    feature_list={_this.state.feature_list}
                    payment={_this.state.payment}
                    validator={this.validator}
                    selectPlan={_this.state.selectPlan}
                    total_Amt={_this.state.total_Amt}
                    CouponDiscount={_this.state.CouponDiscount}
                    selectActiveTab={(value) => {
                      _this.setState({
                        activeSettingTab: value,
                      });
                    }}
                    handleLoadingShow={(value) => {
                      _this.setState({
                        loading: value,
                      });
                    }}
                    {..._this.props}
                  />
                ) : _this.state.thirdStep ? (
                  <BillingSummary
                    _this={_this}
                    selectTab={_this.state.selectTab}
                    monthly_list={_this.state.monthly_list}
                    yearly_list={_this.state.yearly_list}
                    feature_list={_this.state.feature_list}
                    CouponDiscount={_this.state.CouponDiscount}
                    payment={_this.state.payment}
                    validator={this.validator}
                    selectPlan={_this.state.selectPlan}
                    plan_expiry_date={_this.state.plan_expiry_date}
                    total_Amt={_this.state.total_Amt}
                    selectActiveTab={(value) => {
                      _this.setState({
                        activeSettingTab: value,
                      });
                    }}
                    handleLoadingShow={(value) => {
                      _this.setState({
                        loading: value,
                      });
                    }}
                    {..._this.props}
                  />
                ) : null
              ) : null}
            </TabPanel>
            <TabPanel className="invoice_tabpanel" value={2}>
              <InvoiceComponent
                _this={_this}
                selectActiveTab={(value) => {
                  _this.setState({
                    activeSettingTab: value,
                  });
                }}
                handleLoadingShow={(value) => {
                  _this.setState({
                    loading: value,
                  });
                }}
                {..._this.props}
              />
            </TabPanel>

            <TabPanel className="invoice_tabpanel" value={3}>
              <Summary />
            </TabPanel>
          </TabContext>
        </section>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{ zIndex: "10000000000000000000000000000" }}
            open={true}
          >
            <div className="loader_main">
              <div className="item_loader">
                <Loader
                  type="box-rotate-x"
                  bgColor={"#32E0A1"}
                  title={"Please wait..."}
                  color={"#fff"}
                  size={100}
                />
              </div>
            </div>
          </Backdrop>
        )}
        {form}
      </Fragment>
    );
  }
}

export default withRouter(SubscriptionModule);
