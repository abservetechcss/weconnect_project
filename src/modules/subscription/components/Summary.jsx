import { Grid } from "@mui/material";
import React, { Component } from "react";
import { Button, Col, Modal, Nav, Row, Tab } from "react-bootstrap";
import arrow from "../../../assets/images/userdash/Path 48734.svg";
import { MdOutlineFileDownload } from "react-icons/md";
// import { GetSummary, GetCancelsub } from "../server/SubscriptionServer.js";
import { AlertContext } from "../../common/Alert";
import { jsPDF } from "jspdf";
import { Pdfhtml } from "./InvoicePdfComponent";
import Pdf from "react-to-pdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog, DialogContent } from "@material-ui/core";
import SubscriptionPlanList from "./SubscriptionPlanList";
class Summary extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      selectedInvoice: false,
      activeKey: 0,
      invoiceId: null,
      modalShow: false,
      planUsage: {},
      subscriptionDetails: {},
      remainingTrialDays: 0,
    };
    this.myRef = React.createRef();
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchSummaryData();
  }
  fetchSummaryData() {
    let _this = this;
    _this.context.showLoading();
    GetSummary(
      (res) => {
        _this.context.showLoading(false);
        console.log(res.plan_usage);
        console.log(res.subscription_details);
        console.log(res.remaining_trial_days);
        _this.setState({
          planUsage: res.plan_usage,
          subscriptionDetails: res.subscription_details,
          remainingTrialDays: res.remaining_trial_days,
        });
      },
      (err) => {
        _this.context.showLoading(false);
        this.context.showAlert({
          type: "error",
          message: "Summary fetch Failed",
        });
      }
    );
  }
  handleClose = () =>
    this.setState({
      modalShow: false,
    });

  state = {
    isComponentVisible: false,
  };

  toggleComponent = () => {
    this.setState({
      isComponentVisible: !this.state.isComponentVisible,
    });
  };

  render() {
    let _this = this;
    return (
      <>
        <div className="invoice_section">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey={this.state.activeKey}
          >
            {!this.state.isComponentVisible ? (
              <div className="container">
                <div style={{ borderBottom: "2px solid rgb(217 214 214)" }}>
                  {/* <button className="btn float-end " onClick={this.toggleComponent} type="button" style={{backgroundColor: "#32e0a1" }}>
                Upgrade Now
              </button> */}
                  {/* {this.state.isComponentVisible ? <SubscriptionPlanList /> : null}  */}
                  <p className="p-2 fw-bold fs-3" style={{ color: "#2ccf83" }}>
                    {this.state.planUsage.plan_name} PLAN
                  </p>
                </div>
                <div className="row p-3">
                  <div className="col-lg-6">
                    <ul style={{ listStyleType: "none" }}>
                      <h4>Plan Usage</h4>
                      <li>
                        {" "}
                        Users: {this.state.planUsage.user_count} of{" "}
                        {this.state.planUsage.total_user_count}
                      </li>
                      <li>
                        {" "}
                        Chat Interfaces: {
                          this.state.planUsage.bot_count
                        } of {this.state.planUsage.total_bot_count}
                      </li>
                      <li>
                        Monthly conversations:{" "}
                        {this.state.planUsage.monthly_responses_count} of{" "}
                        {this.state.planUsage.total_monthly_responses_count}
                      </li>
                    </ul>
                  </div>
                  {!this.state.planUsage.plan_id == "0" ||
                  !this.state.planUsage.plan_id == "7" ? (
                    <div className="col-md-6">
                      <h4>Subscription Date</h4>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          {this.state.subscriptionDetails.subscription_date}
                        </li>
                      </ul>
                      <h4>Payment method</h4>
                      <ul>
                        <li>
                          €{this.state.subscriptionDetails.total_price}{" "}
                          {this.state.subscriptionDetails.plan_type}
                        </li>
                        {/* <li hidden>Card Ending **** 0621</li> */}
                        <li>
                          Next Payment on{" "}
                          {this.state.subscriptionDetails.next_payment}
                        </li>
                      </ul>
                      {/* <p  style={{ color: "#2ccf83" }} >Edit Payment Method</p> */}
                      <p onClick={GetCancelsub()} style={{ color: "#2ccf83" }}>
                        Cancel Subscription
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <SubscriptionPlanList />
            )}
          </Tab.Container>
        </div>
      </>
    );
  }
}
export default Summary;
