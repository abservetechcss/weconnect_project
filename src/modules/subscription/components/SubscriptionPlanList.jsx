import React, { Component, Fragment } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import tick from "../../../assets/images/Path 48732.svg";
import tick2 from "../../../assets/images/userdash/Path 48751.svg";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  FormGroup,
  Grid,
  Stack,
  Switch,
  Tab,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export class SubscriptionPlanList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    let _this = this;
    const AntSwitch = styled(Switch)(({ theme }) => ({
      width: 48,
      height: 24,
      padding: 0,
      borderRadius: "17px",
      display: "flex",
      "&:active": {
        "& .MuiSwitch-thumb": {
          width: 15,
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          transform: "translateX(9px)",
        },
      },
      "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
          transform: "translateX(25px)",
          color: "#17BDBA",
          borderRadius: "17px",
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: theme.palette.mode === "dark" ? "red" : "#EBFFFF",
            border: "2px solid #17BDBA",
            borderRadius: "17px",
          },
        },
      },
      "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 19,
        height: 19,
        borderRadius: 17,
        transition: theme.transitions.create(["width"], {
          duration: 200,
        }),
      },
      "& .MuiSwitch-track": {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,.35)"
            : "rgba(0,0,0,.25)",
        boxSizing: "border-box",
      },
    }));
    return (
      <Fragment>
        <div className="your_plan_block">
          <p className="choose_title">Choose your plan</p>
          <p className="choose_text">
            Choose a plan that works best for you and your team
          </p>
          <div className="month_toggle">
            <FormGroup>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Monthly</Typography>
                <AntSwitch
                  checked={_this.props.selectTab === "year" ? true : false}
                  inputProps={{ "aria-label": "ant design" }}
                  onChange={() => {
                    _this.props._this.setState({
                      selectTab:
                        _this.props.selectTab === "year" ? "month" : "year",
                    });
                  }}
                />
                <Typography>Yearly</Typography>
              </Stack>
            </FormGroup>
            {/* <div className="off_text">15% off</div> */}
          </div>
          <div className="subscription_module">
            {_this.props.feature_list && _this.props.feature_list.length > 0 ? (
              <Grid container spacing={2}>
                {_this.props.selectTab === "year"
                  ? _this.props.yearly_list &&
                    _this.props.yearly_list.length > 0 &&
                    _this.props.yearly_list.map((prop, index) => {
                      return (
                        <Grid item lg={4} md={4} sm={6} key={index}>
                          <div className="subscription_box">
                            <Fragment>
                              {/* <p className="month_text">1 Month Free</p> */}
                              <p className="startup_text business_text">
                                {prop.plan_name}
                              </p>
                              {prop.custom === "false" &&
                              prop.plan_name.toLowerCase() !== "business" ? (
                                <p className="year_text">
                                  <span>€</span>
                                  {parseFloat(prop.amount) > 0
                                    ? parseFloat(prop.amount).toLocaleString(
                                        "en-IN",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )
                                    : 0}
                                  <span> / year</span>
                                </p>
                              ) : prop.custom === "true" &&
                                prop.plan_name.toLowerCase() === "business" ? (
                                !isNaN(parseFloat(prop.amount)) ? (
                                  <p className="year_text">
                                    <span>€</span>
                                    {parseFloat(prop.amount) > 0
                                      ? parseFloat(prop.amount).toLocaleString(
                                          "en-IN",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )
                                      : 0}
                                    <span> / year</span>
                                  </p>
                                ) : (
                                  <p className="year_text">{prop.amount}</p>
                                )
                              ) : (
                                <p className="year_text">Custom</p>
                              )}
                              <div className="subscription_info">
                                {_this.props.feature_list.map(
                                  (feature_list, key) => {
                                    if (key < prop.index) {
                                      return (
                                        <Fragment key={key}>
                                          {prop.feature_list &&
                                            prop.feature_list.length > 0 &&
                                            prop.feature_list.map(
                                              (feature, index1) => {
                                                if (
                                                  Object.keys(feature)[0] ===
                                                  feature_list.id
                                                )
                                                  return (
                                                    <div key={index1}>
                                                      <img src={tick} alt="" />
                                                      <p>
                                                        {feature_list.name}
                                                        {`${
                                                          Object.values(
                                                            feature
                                                          )[0] === "tick"
                                                            ? ""
                                                            : `(${
                                                                Object.values(
                                                                  feature
                                                                )[0]
                                                              })`
                                                        }`}{" "}
                                                      </p>
                                                    </div>
                                                  );
                                              }
                                            )}
                                        </Fragment>
                                      );
                                    }
                                  }
                                )}
                                <Link
                                  role="button"
                                  onClick={() => {
                                    window.scrollTo(900, 900);
                                  }}
                                  className="feature_link"
                                  to="#"
                                >
                                  See all features
                                </Link>
                              </div>

                              <Button
                                variant="contained"
                                className="subscription_btn"
                                type="button"
                                onClick={() => {
                                  if (
                                    prop.custom === "false" &&
                                    prop.plan_name?.toLowerCase() !== "business"
                                  ) {
                                    if (_this.props.selectTab === "year") {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.yearly_list[index],
                                        total_Amt:
                                          _this.props.yearly_list[index].amount,
                                        finalAmount:
                                          _this.props.yearly_list[index].amount,
                                      });
                                    } else {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.monthly_list[index],
                                        total_Amt:
                                          _this.props.monthly_list[index]
                                            .amount,
                                        finalAmount:
                                          _this.props.monthly_list[index]
                                            .amount,
                                      });
                                    }
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        CouponDiscount: 0,
                                        taxAmount: 0,
                                        couponCode: "",
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    prop.custom === "true" &&
                                    prop.plan_name?.toLowerCase() ===
                                      "business" &&
                                    prop.custom_plan_status !== "not_active"
                                  ) {
                                    if (_this.props.selectTab === "year") {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.yearly_list[index],
                                        total_Amt:
                                          _this.props.yearly_list[index].amount,
                                        finalAmount:
                                          _this.props.yearly_list[index].amount,
                                      });
                                    } else {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.monthly_list[index],
                                        total_Amt:
                                          _this.props.monthly_list[index]
                                            .amount,
                                        finalAmount:
                                          _this.props.monthly_list[index]
                                            .amount,
                                      });
                                    }
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        CouponDiscount: 0,
                                        taxAmount: 0,
                                        couponCode: "",
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                              >
                                {prop.custom === "false" &&
                                prop.plan_name.toLowerCase() !== "business"
                                  ? " Choose Plan"
                                  : prop.custom === "true" &&
                                    prop.plan_name.toLowerCase() ===
                                      "business" &&
                                    prop.custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            </Fragment>
                          </div>
                        </Grid>
                      );
                    })
                  : _this.props.monthly_list &&
                    _this.props.monthly_list.length > 0 &&
                    _this.props.monthly_list.map((prop, index) => {
                      return (
                        <Grid item lg={4} md={4} sm={6} key={index}>
                          <div className="subscription_box">
                            <Fragment>
                              {/* <p className="month_text">1 Month Free</p> */}
                              <p className="startup_text business_text">
                                {prop.plan_name}
                              </p>
                              {prop.custom === "false" &&
                              prop.plan_name.toLowerCase() !== "business" ? (
                                <p className="year_text">
                                  <span>€</span>
                                  {parseFloat(prop.amount) > 0
                                    ? parseFloat(prop.amount).toLocaleString(
                                        "en-IN",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )
                                    : 0}
                                  <span> / year</span>
                                </p>
                              ) : prop.custom === "true" &&
                                prop.plan_name.toLowerCase() === "business" ? (
                                !isNaN(parseFloat(prop.amount)) ? (
                                  <p className="year_text">
                                    <span>€</span>
                                    {parseFloat(prop.amount) > 0
                                      ? parseFloat(prop.amount).toLocaleString(
                                          "en-IN",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )
                                      : 0}
                                    <span> / year</span>
                                  </p>
                                ) : (
                                  <p className="year_text">{prop.amount}</p>
                                )
                              ) : (
                                <p className="year_text">Custom</p>
                              )}
                              <div className="subscription_info">
                                {_this.props.feature_list.map(
                                  (feature_list, key) => {
                                    if (key < prop.index) {
                                      return (
                                        <Fragment key={key}>
                                          {prop.feature_list &&
                                            prop.feature_list.length > 0 &&
                                            prop.feature_list.map(
                                              (feature, index1) => {
                                                if (
                                                  Object.keys(feature)[0] ===
                                                  feature_list.id
                                                )
                                                  return (
                                                    <div key={index1}>
                                                      <img src={tick} />
                                                      <p>
                                                        {feature_list.name}
                                                        {`${
                                                          Object.values(
                                                            feature
                                                          )[0] === "tick"
                                                            ? ""
                                                            : `(${
                                                                Object.values(
                                                                  feature
                                                                )[0]
                                                              })`
                                                        }`}{" "}
                                                      </p>
                                                    </div>
                                                  );
                                              }
                                            )}
                                        </Fragment>
                                      );
                                    }
                                  }
                                )}
                              </div>
                              <Link
                                role="button"
                                onClick={() => {
                                  window.scrollTo(900, 900);
                                }}
                                className="feature_link"
                                to="#"
                              >
                                See all features
                              </Link>

                              <Button
                                variant="contained"
                                className="subscription_btn"
                                type="button"
                                onClick={() => {
                                  if (prop.custom === "false") {
                                    if (_this.props.selectTab === "year") {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.yearly_list[index],
                                        total_Amt:
                                          _this.props.yearly_list[index].amount,
                                        finalAmount:
                                          _this.props.yearly_list[index].amount,
                                      });
                                    } else {
                                      _this.props._this.setState({
                                        selectPlan:
                                          _this.props.monthly_list[index],
                                        total_Amt:
                                          _this.props.monthly_list[index]
                                            .amount,
                                        finalAmount:
                                          _this.props.monthly_list[index]
                                            .amount,
                                      });
                                    }
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        CouponDiscount: 0,
                                        taxAmount: 0,
                                        couponCode: "",
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                              >
                                {prop.custom === "false" &&
                                prop.plan_name.toLowerCase() !== "business"
                                  ? " Choose Plan"
                                  : prop.custom === "true" &&
                                    prop.plan_name.toLowerCase() ===
                                      "business" &&
                                    prop.custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            </Fragment>
                          </div>
                        </Grid>
                      );
                    })}
              </Grid>
            ) : _this.props.loading ? (
              <div className="text-center alert alert-danger">Loading...</div>
            ) : (
              <div className="text-center alert alert-danger">
                No Data Found!
              </div>
            )}
            <div className="comparison_block">
              <p className="comparison_title">Full feature comparison</p>
              {_this.props.feature_list &&
              _this.props.feature_list.length > 0 ? (
                <table>
                  <tbody>
                    <tr>
                      {_this.props.selectTab === "year"
                        ? _this.props.yearly_list &&
                          _this.props.yearly_list.length > 0 &&
                          _this.props.yearly_list.map((prop, key) => {
                            return (
                              <Fragment key={key}>
                                {key === 0 ? (
                                  <th className="feature_title">
                                    <div>Features</div>
                                  </th>
                                ) : null}
                                <th>
                                  <div className="table_header">
                                    <div>
                                      {/* <p className="month_text">2 Month Free</p> */}
                                      <p className="startup_text ">
                                        {prop.plan_name}
                                      </p>
                                      {prop.custom === "false" &&
                                      prop.plan_name.toLowerCase() !==
                                        "business" ? (
                                        <p className="year_text">
                                          <span>€</span>
                                          {parseFloat(prop.amount) > 0
                                            ? parseFloat(
                                                prop.amount
                                              ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })
                                            : 0}
                                          <span> / year</span>
                                        </p>
                                      ) : prop.custom === "true" &&
                                        prop.plan_name.toLowerCase() ===
                                          "business" ? (
                                        !isNaN(parseFloat(prop.amount)) ? (
                                          <p className="year_text">
                                            <span>€</span>
                                            {parseFloat(prop.amount) > 0
                                              ? parseFloat(
                                                  prop.amount
                                                ).toLocaleString("en-IN", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })
                                              : 0}
                                            <span> / year</span>
                                          </p>
                                        ) : (
                                          <p className="year_text">
                                            {prop.amount}
                                          </p>
                                        )
                                      ) : (
                                        <p className="year_text">Custom</p>
                                      )}
                                    </div>
                                  </div>
                                </th>
                              </Fragment>
                            );
                          })
                        : _this.props.monthly_list &&
                          _this.props.monthly_list.length > 0 &&
                          _this.props.monthly_list.map((prop, key) => {
                            return (
                              <Fragment key={key}>
                                {key === 0 ? (
                                  <th className="feature_title">
                                    <div>Features</div>
                                  </th>
                                ) : null}
                                <th>
                                  <div className="table_header">
                                    <div>
                                      {/* <p className="month_text">2 Month Free</p> */}
                                      <p className="startup_text ">
                                        {prop.plan_name}
                                      </p>
                                      {prop.custom === "false" &&
                                      prop.plan_name.toLowerCase() !==
                                        "business" ? (
                                        <p className="year_text">
                                          <span>€</span>
                                          {parseFloat(prop.amount) > 0
                                            ? parseFloat(
                                                prop.amount
                                              ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })
                                            : 0}
                                          <span> / year</span>
                                        </p>
                                      ) : prop.custom === "true" &&
                                        prop.plan_name.toLowerCase() ===
                                          "business" ? (
                                        !isNaN(parseFloat(prop.amount)) ? (
                                          <p className="year_text">
                                            <span>€</span>
                                            {parseFloat(prop.amount) > 0
                                              ? parseFloat(
                                                  prop.amount
                                                ).toLocaleString("en-IN", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })
                                              : 0}
                                            <span> / year</span>
                                          </p>
                                        ) : (
                                          <p className="year_text">
                                            {prop.amount}
                                          </p>
                                        )
                                      ) : (
                                        <p className="year_text">Custom</p>
                                      )}
                                    </div>
                                  </div>
                                </th>
                              </Fragment>
                            );
                          })}
                    </tr>
                    {_this.props.feature_list.map((prop, key) => {
                      return (
                        <tr key={key}>
                          <td>{prop.name}</td>
                          {_this.props.selectTab === "year"
                            ? _this.props.yearly_list &&
                              _this.props.yearly_list.length > 0 &&
                              _this.props.yearly_list.map((prop1, index) => {
                                if (index === 0) {
                                  return (
                                    <Fragment key={index}>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                } else if (index === 1) {
                                  return (
                                    <Fragment>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                } else if (index === 2) {
                                  return (
                                    <Fragment>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                }
                              })
                            : _this.props.monthly_list &&
                              _this.props.monthly_list.length > 0 &&
                              _this.props.monthly_list.map((prop1, index) => {
                                if (index === 0) {
                                  return (
                                    <Fragment>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                } else if (index === 1) {
                                  return (
                                    <Fragment>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                } else if (index === 2) {
                                  return (
                                    <Fragment>
                                      <td>
                                        {prop1.feature_list &&
                                          prop1.feature_list.length > 0 &&
                                          prop1.feature_list.map(
                                            (feature, index1) => {
                                              if (
                                                Object.keys(feature)[0] ===
                                                prop.id
                                              )
                                                return (
                                                  <div key={index1}>
                                                    {Object.values(
                                                      feature
                                                    )[0] === "tick" ? (
                                                      <img alt="" src={tick2} />
                                                    ) : (
                                                      Object.values(feature)[0]
                                                    )}
                                                  </div>
                                                );
                                            }
                                          )}
                                      </td>
                                    </Fragment>
                                  );
                                }
                              })}
                        </tr>
                      );
                    })}
                    <tr>
                      <td></td>
                      <td>
                        <div className="choose_text_btn">
                          <div>
                            {_this.props.selectTab === "year" ? (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.yearly_list[0].custom ===
                                      "false" &&
                                    _this.props.yearly_list[0].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[0].amount,
                                      finalAmount:
                                        _this.props.yearly_list[0].amount,
                                      selectPlan: _this.props.yearly_list[0],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.yearly_list[0].custom ===
                                      "true" &&
                                    _this.props.yearly_list[0].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[0]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[0].amount,
                                      finalAmount:
                                        _this.props.yearly_list[0].amount,
                                      selectPlan: _this.props.yearly_list[0],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.yearly_list[0].custom ===
                                  "false" &&
                                _this.props.yearly_list[0].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.yearly_list[0].custom ===
                                      "true" &&
                                    _this.props.yearly_list[0].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[0]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.monthly_list[0].custom ===
                                      "false" &&
                                    _this.props.monthly_list[0].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[0].amount,
                                      finalAmount:
                                        _this.props.monthly_list[0].amount,
                                      selectPlan: _this.props.monthly_list[0],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.monthly_list[0].custom ===
                                      "true" &&
                                    _this.props.monthly_list[0].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[0]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[0].amount,
                                      finalAmount:
                                        _this.props.monthly_list[0].amount,
                                      selectPlan: _this.props.monthly_list[0],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.monthly_list[0].custom ===
                                  "false" &&
                                _this.props.monthly_list[0].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.monthly_list[0].custom ===
                                      "true" &&
                                    _this.props.monthly_list[0].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[0]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="choose_text_btn">
                          <div>
                            {_this.props.selectTab === "year" ? (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.yearly_list[1].custom ===
                                      "false" &&
                                    _this.props.yearly_list[1].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[1].amount,
                                      finalAmount:
                                        _this.props.yearly_list[1].amount,
                                      selectPlan: _this.props.yearly_list[1],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.yearly_list[1].custom ===
                                      "true" &&
                                    _this.props.yearly_list[1].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[1]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[1].amount,
                                      finalAmount:
                                        _this.props.yearly_list[1].amount,
                                      selectPlan: _this.props.yearly_list[1],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.yearly_list[1].custom ===
                                  "false" &&
                                _this.props.yearly_list[1].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.yearly_list[1].custom ===
                                      "true" &&
                                    _this.props.yearly_list[1].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[1]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.monthly_list[1].custom ===
                                      "false" &&
                                    _this.props.monthly_list[1].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[1].amount,
                                      finalAmount:
                                        _this.props.monthly_list[1].amount,
                                      selectPlan: _this.props.monthly_list[1],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.monthly_list[1].custom ===
                                      "true" &&
                                    _this.props.monthly_list[1].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[1]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[1].amount,
                                      finalAmount:
                                        _this.props.monthly_list[1].amount,
                                      selectPlan: _this.props.monthly_list[1],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.monthly_list[1].custom ===
                                  "false" &&
                                _this.props.monthly_list[1].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.monthly_list[1].custom ===
                                      "true" &&
                                    _this.props.monthly_list[1].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[1]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="choose_text_btn">
                          <div>
                            {_this.props.selectTab === "year" ? (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.yearly_list[2].custom ===
                                      "false" &&
                                    _this.props.yearly_list[2].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[2].amount,
                                      finalAmount:
                                        _this.props.yearly_list[2].amount,
                                      selectPlan: _this.props.yearly_list[2],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.yearly_list[2].custom ===
                                      "true" &&
                                    _this.props.yearly_list[2].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[2]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.yearly_list[2].amount,
                                      finalAmount:
                                        _this.props.yearly_list[2].amount,
                                      selectPlan: _this.props.yearly_list[2],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.yearly_list[2].custom ===
                                  "false" &&
                                _this.props.yearly_list[2].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.yearly_list[2].custom ===
                                      "true" &&
                                    _this.props.yearly_list[2].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.yearly_list[2]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (
                                    _this.props.monthly_list[2].custom ===
                                      "false" &&
                                    _this.props.monthly_list[2].plan_name.toLowerCase() !==
                                      "business"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[2].amount,
                                      finalAmount:
                                        _this.props.monthly_list[2].amount,
                                      selectPlan: _this.props.monthly_list[2],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else if (
                                    _this.props.monthly_list[2].custom ===
                                      "true" &&
                                    _this.props.monthly_list[2].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[2]
                                      .custom_plan_status !== "not_active"
                                  ) {
                                    _this.props._this.setState({
                                      total_Amt:
                                        _this.props.monthly_list[2].amount,
                                      finalAmount:
                                        _this.props.monthly_list[2].amount,
                                      selectPlan: _this.props.monthly_list[2],
                                    });
                                    setTimeout(() => {
                                      _this.props._this.setState({
                                        firstStep: false,
                                        secondStep: true,
                                        thirdStep: false,
                                        fourthStep: false,
                                      });
                                    }, 1000);
                                  } else {
                                  }
                                }}
                                variant="contained"
                              >
                                {_this.props.monthly_list[2].custom ===
                                  "false" &&
                                _this.props.monthly_list[2].plan_name.toLowerCase() !==
                                  "business"
                                  ? " Choose Plan"
                                  : _this.props.monthly_list[2].custom ===
                                      "true" &&
                                    _this.props.monthly_list[2].plan_name.toLowerCase() ===
                                      "business" &&
                                    _this.props.monthly_list[2]
                                      .custom_plan_status !== "not_active"
                                  ? "Choose Plan"
                                  : "Contact Us"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : _this.props.loading ? (
                <div className="text-center alert alert-danger">Loading...</div>
              ) : (
                <div className="text-center alert alert-danger">
                  No Data Found!
                </div>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SubscriptionPlanList;
