import React, { Component, Fragment, useState, useEffect, useRef } from "react";
import BillingHeader from "./BillingHeader";
import tick from "../../../assets/images/Path 48732.svg";
import { FloatingLabel, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
// import CreditCardInput from "react-credit-card-input";
import { Button, Grid } from "@mui/material";
import ReactFlagsSelect from "react-flags-select";
// import moment from "moment";
// import { createCardToken, } from "../server/SubscriptionServer.js";

// const Mollie = require("molliejs");
//  const mollieApi = new Mollie("test_uazsAzDCpFaxf8BHS5upKSMuPBz266");

const SubscriptionBillingPage = (props) => {
  // const [payment,setPayment] = useState({});
  const [mollie, setMollie] = useState();
  const [showAll, setShowAll] = useState(9);

  const mollieRef = useRef();
  // const cardNumber = useRef();
  // const cardHolder = useRef();
  // const expiryDate = useRef();
  // const verificationCode = useRef();

  const cardNumberRef = useRef();
  const cardHolderRef = useRef();
  const expiryDateRef = useRef();
  const veriCodeRef = useRef();

  const cardNumberErrRef = useRef();
  const cardHolderErrRef = useRef();
  const expiryDateErrRef = React.useRef();
  const veriCodeErrRef = React.useRef();

  // const [showCardError, setShowCardError] = useState("");

  const mollieHolderFunc = (event) => {
    if (cardHolderErrRef.current) {
      if (event.error && event.touched) {
        cardHolderErrRef.current.textContent = event.error;
      } else {
        cardHolderErrRef.current.textContent = "";
      }
    }
  };

  const molliecardNumberFunc = (event) => {
    if (cardNumberErrRef.current) {
      if (event.error && event.touched) {
        cardNumberErrRef.current.textContent = event.error;
      } else {
        cardNumberErrRef.current.textContent = "";
      }
    }
  };

  const mollieExpiryFunc = (event) => {
    if (expiryDateErrRef.current) {
      if (event.error && event.touched) {
        expiryDateErrRef.current.textContent = event.error;
      } else {
        expiryDateErrRef.current.textContent = "";
      }
    }
  };

  const mollieVerifyFunc = (event) => {
    if (veriCodeErrRef.current) {
      if (event.error && event.touched) {
        veriCodeErrRef.current.textContent = event.error;
      } else {
        veriCodeErrRef.current.textContent = "";
      }
    }
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showAll: 9,
  //     showCardError: ""
  //   };
  // }

  useEffect(() => {
    window.scrollTo(0, 0);
    props.validator.hideMessages();
    if (props.payment.country === "NL") {
      let vat = 21;
      let priceExcludingVat = parseFloat(props.total_Amt);
      let vatToPay = parseFloat(priceExcludingVat / 100) * vat;
      let finalTotal = parseFloat(priceExcludingVat) + vatToPay;
      let total = parseFloat(finalTotal) - props.CouponDiscount;
      props._this.setState({
        finalAmount: total,
        beforeAmount: total,
        taxAmount: vatToPay,
      });
    } else {
      let total = parseFloat(props.total_Amt) - props.CouponDiscount;
      props._this.setState({
        finalAmount: total,
        beforeAmount: total,
        taxAmount: 0,
      });
    }

    if (mollieRef && mollieRef.current) {
      return;
    }
    if (window.myMollieRef) {
      mollieRef.current = window.myMollieRef;
      setMollie(window.myMollieRef);
    } else {
      const script = document.createElement("script");
      script.src = "https://js.mollie.com/v1/mollie.js";
      script.addEventListener("load", () => {
        let data = window.location.href.split("/user/subscription")[0];
        let testMode = false;
        if (
          data.includes("localhost")
        ) {
          testMode = true;
        }
        // if (
        //   data.includes("weconnect.leocoders") ||
        //   data.includes("localhost")
        // ) {
        //   testMode = true;
        // } else if (data.includes("kaiwa-ui.dev.weconnect.chat")) {
        //   testMode = true;
        // }

        mollieRef.current = window.Mollie("pfl_TrEtPgwRFH", {
          locale: "en_US",
          testmode: testMode,
        });
        window.myMollieRef = mollieRef.current;
        setMollie(mollieRef.current);
      });
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (mollie) {
      console.log(typeof mollie, mollie);
      var options = {
        styles: {
          base: {
            color: "rgba(0, 0, 0, 0.8)",
          },
        },
      };
      try {
        if (!window.mollieCardNumber) {
          window.mollieCardNumber = mollieRef.current.createComponent(
            "cardNumber",
            options
          );
          window.molliecardHolder = mollieRef.current.createComponent(
            "cardHolder",
            options
          );
          window.molliecardExpiry = mollieRef.current.createComponent(
            "expiryDate",
            options
          );
          window.molliecardVerify = mollieRef.current.createComponent(
            "verificationCode",
            options
          );
        }
        window.mollieCardNumber.mount(cardNumberRef.current);
        window.molliecardHolder.mount(cardHolderRef.current);
        window.molliecardExpiry.mount(expiryDateRef.current);
        window.molliecardVerify.mount(veriCodeRef.current);

        window.molliecardHolder.addEventListener("change", mollieHolderFunc);
        window.mollieCardNumber.addEventListener(
          "change",
          molliecardNumberFunc
        );
        window.molliecardExpiry.addEventListener("change", mollieExpiryFunc);
        window.molliecardVerify.addEventListener("change", mollieVerifyFunc);

        //       var cardNumber = mollie.createComponent('cardNumber', options);
        // cardNumber.mount('#card-number');

        // var cardHolder = mollie.createComponent('cardHolder', options);
        // cardHolder.mount('#card-holder');

        // var expiryDate = mollie.createComponent('expiryDate', options);
        // expiryDate.mount('#expiry-date');

        // var verificationCode = mollie.createComponent('verificationCode', options);

        // verificationCode.mount('#verification-code');
      } catch (err) {
        console.log("Error", err);
      }

      return () => {
        window.molliecardHolder.removeEventListener("change", mollieHolderFunc);
        window.mollieCardNumber.removeEventListener(
          "change",
          molliecardNumberFunc
        );
        window.molliecardExpiry.removeEventListener("change", mollieExpiryFunc);
        window.molliecardVerify.removeEventListener("change", mollieVerifyFunc);
      };
    }
  }, [mollie]);

  const createMollieToken = async () => {
    if (mollieRef.current) {
      const { token, error } = await mollieRef.current.createToken();
      console.log("Token", token, error);
      if (token) {
        let _this = this;
        let payment = props.payment;
        let cardNumber = payment.card_number.split(" ").join("");
        let data = window.location.href.split("/user/subscription")[0];
        let hostname = "";
        if (
          data.includes("weconnect.leocoders") ||
          data.includes("localhost")
        ) {
          hostname = "weconnect.leocoders.com";
        } else if (data.includes("kaiwa-ui.dev.weconnect.chat")) {
          hostname = "kaiwa-ui.dev.weconnect.chat";
        } else if (data.includes("app.weconnect.chat")) {
          hostname = "app.weconnect.chat";
        }

        let tempObj = {
          cardCvv: payment.cvc,
          cardExpiryDate: payment.expiry.replace(" / ", "/"),
          cardHolder: payment.full_name,
          cardNumber: cardNumber,
          hostname: hostname,
          locale: "en_US",
          profileToken: "pfl_TrEtPgwRFH",
          testmode: true,
        };
        props._this.setState({
          mollieToken: token,
        });
        props._this.onSubmit();
      } else {
      }
    }
  };

  const handleInputChange = (e) => {
    let _this = this;
    var newObj = props.payment;
    newObj[e.target.name] = e.target.value;
    props._this.setState({ payment: newObj });
  };

  let _this = this;
  let payment = props.payment;
  return (
    <Fragment>
      <div className="billing_section">
        <BillingHeader {...props} />
        <div className="billing_block">
          <p className="billing_title">Billing</p>
          <p className="billing_text"></p>
          <div className="billing_card_box">
            <div className="billing_detail_box">
              <p className="detail_title">Enter details</p>
              <div className="card_inputs">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <div className="form-fields">
                      <div className="row">
                        <div className="form-group form-group--card-holder">
                          <label className="label" htmlFor="card-holder">
                            Name
                          </label>
                          <div id="card-holder" ref={cardHolderRef}></div>
                          <div
                            id="card-holder-error"
                            ref={cardHolderErrRef}
                            className="field-error"
                            role="alert"
                          ></div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group form-group--card-number">
                          <label className="label" htmlFor="card-number">
                            Card number
                          </label>
                          <div id="card-number" ref={cardNumberRef}></div>
                          <div
                            id="card-number-error"
                            ref={cardNumberErrRef}
                            className="field-error"
                            role="alert"
                          ></div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group form-group--expiry-date">
                          <label className="label" htmlFor="expiry-date">
                            Expiry date
                          </label>
                          <div id="expiry-date" ref={expiryDateRef}></div>
                          <div
                            id="expiry-date-error"
                            ref={expiryDateErrRef}
                            className="field-error"
                            role="alert"
                          ></div>
                        </div>

                        <div className="form-group form-group--verification-code">
                          <label className="label" htmlFor="verification-code">
                            CVC
                          </label>
                          <div id="verification-code" ref={veriCodeRef}></div>
                          <div
                            id="verification-code-error"
                            ref={veriCodeErrRef}
                            className="field-error"
                            role="alert"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <FloatingLabel controlId="floatingSelect" label="">
                      <ReactFlagsSelect
                        searchable={true}
                        className="select_category"
                        showSelectedLabel
                        fullWidth
                        selected={payment && payment.country}
                        onSelect={(code) => {
                          if (code === "NL") {
                            let vat = 21;
                            let priceExcludingVat = parseFloat(props.total_Amt);
                            let vatToPay =
                              parseFloat(priceExcludingVat / 100) * vat;
                            let finalTotal =
                              parseFloat(priceExcludingVat) + vatToPay;
                            let total =
                              parseFloat(finalTotal) - props.CouponDiscount;
                            props._this.setState({
                              finalAmount: total,
                              beforeAmount: total,
                              taxAmount: vatToPay,
                            });
                          } else {
                            let total =
                              parseFloat(props.total_Amt) -
                              props.CouponDiscount;
                            props._this.setState({
                              finalAmount: total,
                              beforeAmount: total,
                              taxAmount: 0,
                            });
                          }
                          var newObj = props.payment;
                          newObj.country = code;
                          props._this.setState({ payment: newObj });
                        }}
                        placeholder="Select country"
                        customLabels={{ GG: "Alderney" }}
                      />
                      <div className="errorMsg">
                        {props.validator.message(
                          "last name",
                          payment && payment.country !== null ? true : "",
                          "required"
                        )}
                      </div>
                    </FloatingLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      type="text"
                      placeholder="Company name"
                      name="company_name"
                      value={payment && payment.company_name}
                      onChange={handleInputChange}
                    />
                    <div className="errorMsg">
                      {props.validator.message(
                        "company name",
                        payment && payment.company_name,
                        "required"
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <textarea
                      type="text"
                      placeholder="Address"
                      name="address"
                      value={payment && payment.address}
                      onChange={handleInputChange}
                    />
                    <div className="errorMsg">
                      {props.validator.message(
                        "address",
                        payment && payment.address,
                        "required"
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      type="text"
                      placeholder="Invoice email"
                      name="invoice_email"
                      value={payment && payment.invoice_email}
                      onChange={handleInputChange}
                    />
                    <div className="errorMsg">
                      {props.validator.message(
                        "email",
                        payment && payment.invoice_email,
                        "required|email"
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="total_price_box">
                <p className="price_text">
                  Total price{" "}
                  {/* <Link to="#">(Switch to annual and get 15% discount)</Link> */}
                </p>
                {Object.keys(props.selectPlan) &&
                Object.keys(props.selectPlan).length > 0 ? (
                  <p className="price_rate">{`€${parseFloat(
                    props._this.state.finalAmount
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}</p>
                ) : null}
              </div>
              <div className="subscribe_btn">
                <Button
                  type="button"
                  onClick={() => {
                    createMollieToken();
                    // if (props.validator.allValid()) {
                    //   if (props.selectTab === "year") {
                    //     let d = moment(new Date()).add(1, "years").calendar();
                    //     props._this.setState({
                    //       plan_expiry_date: d
                    //     });
                    //   } else {
                    //     let d = moment(new Date())
                    //       .add(1, "months")
                    //       .calendar();
                    //     props._this.setState({
                    //       plan_expiry_date: d
                    //     });
                    //   }
                    //   createMollieToken();
                    // } else {
                    //   props.validator.showMessages();
                    //   this.forceUpdate();
                    // }
                  }}
                  variant="contained"
                >
                  Subscribe now{" "}
                </Button>
                <Link
                  to="#"
                  role="button"
                  onClick={() => {
                    props._this.setState({
                      firstStep: true,
                      secondStep: false,
                      thirdStep: false,
                      fourthStep: false,
                    });
                  }}
                >
                  &lt; Back
                </Link>
              </div>
            </div>
            {Object.keys(props.selectPlan) &&
            Object.keys(props.selectPlan).length > 0 ? (
              <div className="billing_feature_box">
                <p className="choosen_text">You have choose</p>
                <p className="month_text"></p>
                <p className="startup_text">
                  {props.selectPlan && props.selectPlan.plan_name}
                </p>
                {props.selectPlan && props.selectPlan.custom === "false" ? (
                  <p className="price_text">
                    <span>€</span>{" "}
                    {`${parseFloat(
                      props._this.state.finalAmount
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    <span>{`/ ${
                      props.selectTab === "year" ? "Year" : "Month"
                    }`}</span>
                  </p>
                ) : (
                  <p className="price_text">Custom</p>
                )}

                <div className="billing_info">
                  {props.feature_list.map((feature_list, key) => {
                    if (key < showAll) {
                      return (
                        <Fragment>
                          {props.selectPlan.feature_list &&
                            props.selectPlan.feature_list.length > 0 &&
                            props.selectPlan.feature_list.map(
                              (feature, index1) => {
                                if (Object.keys(feature)[0] === feature_list.id)
                                  return (
                                    <div>
                                      <img src={tick} alt="" />
                                      <p>
                                        {feature_list.name}
                                        {`${
                                          Object.values(feature)[0] === "tick"
                                            ? ""
                                            : `(${Object.values(feature)[0]})`
                                        }`}{" "}
                                      </p>
                                    </div>
                                  );
                              }
                            )}
                        </Fragment>
                      );
                    }
                  })}
                </div>
                {props.feature_list && props.feature_list.length > 9 ? (
                  showAll === 9 ? (
                    <Link
                      role="button"
                      onClick={() => {
                        setShowAll(props.feature_list.length - 1);
                      }}
                      to="#"
                    >
                      See all features
                    </Link>
                  ) : (
                    <Link
                      role="button"
                      onClick={() => {
                        setShowAll(9);
                      }}
                      to="#"
                    >
                      Less
                    </Link>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SubscriptionBillingPage;
