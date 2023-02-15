import React, { Component, Fragment, createRef } from "react";
import { Button, Grid } from "@mui/material";
import BillingHeader from "./BillingHeader";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  getCouponCodeList,
  createPaymentMollie,
  createBusinessPaymentMollie,
} from "../server/SubscriptionServer.js";
import LoadingButton from "react-bootstrap-button-loader";

import { warningAlert, successAlert } from "../../../js/alerts.js";
export class BillingSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formSubmit = this.formSubmit.bind(this);
    this.formRef = createRef();
  }
  formSubmit(e) {
    e.preventDefault();
    // if(this.formRef.current)
    // this.formRef.current.submit();
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.props._this.validator.hideMessages();
    // if(this.formRef.current)
    // this.formRef.current.addEventListener('submit', this.formSubmit);
  }

  componentWillUnmount() {
    // if(this.formRef.current)
    // this.formRef.current.removeEventListener('submit', this.formSubmit);
  }

  calclulateAmount() {
    let _this = this;
    const newObj = _this.props._this.state;
    const planAmount = newObj.selectPlan.amount;
    let amount = planAmount;

    // apply coupon
    if (newObj.CouponDiscount && newObj.CouponDiscount > 0)
      amount =
        parseFloat(amount) -
        parseFloat(planAmount * (newObj.CouponDiscount / 100));

    return amount;
  }

  calculateTaxAmount() {
    let _this = this;
    let taxAmount = 0;
    const newObj = _this.props._this.state;
    let finalAmount = this.calclulateAmount();
    if (newObj.payment.country === "NL") {
      const vat = 21;
      taxAmount = parseFloat(vat / 100) * finalAmount;
    }
    return taxAmount;
  }

  calculateFinalAmount() {
    let _this = this;
    let finalAmount = _this.calclulateAmount();

    // apply tax
    let taxAmount = _this.calculateTaxAmount();
    finalAmount = parseFloat(finalAmount) + taxAmount;

    return parseFloat(finalAmount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  fetchCouponCode = () => {
    let _this = this;
    _this.props._this.setState({ couponCodeLoading: true, loading: true });
    let params = `coupon_code=${_this.props._this.state.couponCode}`;
    getCouponCodeList(
      _this,
      params,
      (res) => {
        if (res.status === "True") {
          successAlert("Coupon code applied successfully!", _this.props._this);
          let discount = res.coupon_discount;
          let totalAmt = 0;
          totalAmt =
            parseFloat(_this.props._this.state.finalAmount) -
            parseFloat(
              _this.props._this.state.selectPlan.amount * (discount / 100)
            );
          _this.props._this.setState({
            couponCodeLoading: false,
            finalAmount: totalAmt,
            applyCouponCode: true,
            loading: false,
            // couponCode: "",
            CouponDiscount: res.coupon_discount,
          });
        } else {
          warningAlert(`Invalid coupon code!`, _this.props._this);
          _this.props._this.setState({
            couponCodeLoading: false,
            loading: false,
            couponCode: "",
            CouponDiscount: 0,
            finalAmount: _this.props._this.state.beforeAmount,
          });
        }
      },
      (res) => {
        _this.setState({
          loading: false,
        });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let newObj = _this.props._this.state;
    console.log(newObj.selectPlan.plan_name);
    if (newObj.selectPlan.plan_name.toLowerCase() !== "business") {
      let tempObj = {
        plan_id: newObj.selectPlan.plan_id,
        amount: _this.calculateFinalAmount(),
        cardToken: newObj.mollieToken,
        country: newObj.payment.country,
      };
      if (newObj.applyCouponCode) {
        tempObj.couponCode = newObj.couponCode;
      } else {
        tempObj.couponCode = "";
      }
      _this.props._this.setState({ loading: true });

      createPaymentMollie(
        _this,
        tempObj,
        (res) => {
          successAlert("Thanks for your payment!", _this.props._this);
          _this.props._this.setState({ loading: false });
          const url = res.redirect_url;
          window.open(url, "_blank");

          setTimeout(() => {
            if (localStorage.getItem("admin_type") === "agent") {
              _this.props.history.push("/agent/dashboard");
            } else {
              _this.props.history.push("/user/dashboard");
            }
          }, 3000);
        },
        (res) => {}
      );
    } else if (newObj.selectPlan.plan_name.toLowerCase() === "business") {
      let tempObj = {
        plan_id: newObj.selectPlan.plan_id,
        cardToken: newObj.mollieToken,
        country: newObj.payment.country,
      };
      if (newObj.applyCouponCode) {
        tempObj.couponCode = newObj.couponCode;
      } else {
        tempObj.couponCode = "";
      }
      _this.props._this.setState({ loading: true });

      createBusinessPaymentMollie(
        _this,
        tempObj,
        (res) => {
          successAlert("Thanks for your payment!", _this.props._this);
          _this.props._this.setState({ loading: false });
          const url = res.redirect_url;
          window.open(url, "_blank");

          setTimeout(() => {
            if (localStorage.getItem("admin_type") === "agent") {
              _this.props.history.push("/agent/dashboard");
            } else {
              _this.props.history.push("/user/dashboard");
            }
          }, 3000);
        },
        (res) => {}
      );
    } else {
    }
  };
  render() {
    let _this = this;
    let newObj = _this.props._this.state;
    return (
      <Fragment>
        <div className="billing_section">
          <input type="hidden" name="cardToken" value={newObj.mollieToken} />
          <input
            type="hidden"
            name="amount"
            value={_this.calculateFinalAmount()}
          />
          <input
            type="hidden"
            name="plan_id"
            value={newObj.selectPlan.plan_id}
          />
          <input type="hidden" name="country" value={newObj.payment.country} />
          <BillingHeader />
          <div className="summary_block">
            <p className="billing_title">Summary</p>
            <p className="billing_text">
              Review your placed order before payment
            </p>
            <div className="billing_summary_block">
              <div className="summary_detail_box">
                <div className="basic_info_box">
                  <div className="choosen_box choosen_basic_info">
                    <p className="choosen_text">Basic Information</p>
                  </div>
                  <div className="shipping_box">
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <div className="shipping_add_box">
                          <p className="shipping_text">
                            Shipping address
                            <Link
                              role="button"
                              onClick={() => {
                                _this.props._this.setState({
                                  firstStep: false,
                                  secondStep: true,
                                  thirdStep: false,
                                  fourthStep: false,
                                });
                              }}
                              to="#"
                            >
                              Change
                            </Link>
                          </p>
                          <p className="address_text">
                            {_this.props.payment && _this.props.payment.address}
                          </p>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="shipping_add_box">
                          <p className="shipping_text">
                            Payment method
                            <Link
                              role="button"
                              onClick={() => {
                                _this.props._this.setState({
                                  firstStep: false,
                                  secondStep: true,
                                  thirdStep: false,
                                  fourthStep: false,
                                });
                              }}
                              to="#"
                            >
                              Change
                            </Link>
                          </p>
                          <p className="address_text">Credit card</p>
                          <p>
                            {`********${
                              _this.props.payment &&
                              _this.props.payment.card_number.substring(7, 12)
                            }`}
                          </p>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div className="basic_info_box">
                  <div className="choosen_box">
                    <p className="choosen_text">Choose Plan</p>
                    <p
                      className="change_text"
                      role="button"
                      onClick={() => {
                        _this.props._this.setState({
                          firstStep: true,
                          secondStep: false,
                          thirdStep: false,
                          fourthStep: false,
                        });
                      }}
                    >
                      Change
                    </p>
                  </div>
                  {Object.keys(_this.props.selectPlan) &&
                  Object.keys(_this.props.selectPlan).length > 0 ? (
                    <div>
                      <p className="days_text">Plan</p>
                      <p className="days_subtext">
                        {_this.props.selectPlan &&
                          _this.props.selectPlan.plan_name}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="days_text">Days</p>
                    {_this.props.plan_expiry_date !== null ? (
                      <p className="days_subtext">
                        Till{" "}
                        {moment(_this.props.plan_expiry_date).format(
                          "DD/MMM/yyyy"
                        )}
                      </p>
                    ) : null}
                  </div>
                  {Object.keys(_this.props.selectPlan) &&
                  Object.keys(_this.props.selectPlan).length > 0 ? (
                    <div>
                      <p className="days_text">Subscription charge</p>
                      <p className="days_subtext">
                        {`€ ${`${parseFloat(
                          _this.props.selectPlan.amount
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}/${
                          _this.props.selectTab === "year" ? "Year" : "Month"
                        }`}{" "}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="summary_feature_box">
                <div className="coupon_info_box">
                  <p className="coupon_title">Coupon code</p>
                  <div className="coupon_input">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={_this.props._this.state.couponCode}
                      onChange={(e) => {
                        _this.props._this.setState({
                          couponCode: e.target.value,
                        });
                      }}
                    ></input>
                    <LoadingButton
                      type="button"
                      disabled={_this.props._this.state.couponCode === ""}
                      loading={_this.props._this.state.couponCodeLoading}
                      onClick={() => {
                        setTimeout(() => {
                          _this.fetchCouponCode();
                        }, 100);
                      }}
                    >
                      Apply
                    </LoadingButton>
                  </div>
                </div>
                <div className="coupon_info_box">
                  <p className="coupon_title">Order summary</p>
                  <div className="price_table_box">
                    <div>
                      <p className="total_title">Subtotal</p>
                      {Object.keys(_this.props.selectPlan) &&
                      Object.keys(_this.props.selectPlan).length > 0 ? (
                        <p className="total_text">{`€${parseFloat(
                          _this.props.selectPlan.amount
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}</p>
                      ) : null}
                    </div>
                    <div>
                      <p className="total_title">Coupon discount</p>
                      <p className="total_text total_red_text">{`-€ ${parseFloat(
                        _this.props.selectPlan.amount *
                          (_this.props._this.state.CouponDiscount / 100)
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}</p>
                    </div>
                    <div>
                      <p className="total_title">Taxes</p>
                      <p className="total_text">{`€ ${parseFloat(
                        this.calculateTaxAmount()
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}</p>
                    </div>{" "}
                    {/* <div>
                      <summary_titlep className="total_title">
                        Discount
                      </summary_titlep>
                      <p className="total_text total_green_text">-€0</p>
                    </div>{" "} */}
                  </div>
                  <div className="summary_total_box">
                    <p className="">Total price:</p>
                    <p className="summary_text">{`€ ${this.calculateFinalAmount()}`}</p>
                  </div>
                  <div className="place_btn">
                    <Button
                      role="button"
                      disabled={
                        parseFloat(_this.props._this.state.finalAmount) > 0
                          ? false
                          : true
                      }
                      onClick={() => {
                        _this.onSubmit();
                      }}
                      variant="contained"
                    >
                      Place order
                    </Button>
                    <Link
                      role="button"
                      onClick={() => {
                        _this.props._this.setState({
                          firstStep: false,
                          secondStep: true,
                          thirdStep: false,
                          fourthStep: false,
                        });
                      }}
                      to="#"
                    >
                      &lt; Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default BillingSummary;
