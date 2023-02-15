import { Grid } from "@mui/material";
import React, { Component } from "react";
import { Button, Col, Modal, Nav, Row, Tab } from "react-bootstrap";
import arrow from "../../../assets/images/userdash/Path 48734.svg";
import { MdOutlineFileDownload } from "react-icons/md";
import { GetInvoice, PrintInvoice } from "../server/SubscriptionServer.js";
import { AlertContext } from "../../common/Alert";
import { jsPDF } from "jspdf";
import { Pdfhtml } from "./InvoicePdfComponent";
import Pdf from "react-to-pdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog, DialogContent } from "@material-ui/core";

class InvoiceComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      invoice: [],
      selectedInvoice: false,
      activeKey: 0,
      invoiceId: null,
      modalShow: false,
      printinvoice: {},
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer() {
    let _this = this;
    _this.context.showLoading();
    GetInvoice(
      (res) => {
        _this.context.showLoading(false);
        console.log(res.invoice_list);
        if (res.invoice_list && res.invoice_list.length > 0) {
          _this.setState({
            invoice: res.invoice_list,
            selectedInvoice: res.invoice_list[0] || false,
            invoiceId: res.invoice_list[0].id,
          });
        }
      },
      (err) => {
        _this.context.showLoading(false);
        this.context.showAlert({
          type: "error",
          message: "Invoice fetch Failed",
        });
      }
    );
  }
  handleClose = () =>
    this.setState({
      modalShow: false,
    });

  downloadSubmit(event) {
    event.preventDefault();
    let _this = this;
    // _this.context.showLoading();
    let params = `id=${_this.state.invoiceId}`;
    PrintInvoice(
      params,
      (res) => {
        console.log(res);
        this.setState({
          printinvoice: res.printinvoice,
        });
        // _this.context.showLoading(false);
        if (res.printinvoice.length !== 0) {
          this.setState({
            modalShow: true,
          });
        }
      },
      (err) => {
        console.log(err);
        this.context.showAlert({
          type: "error",
          message: "Invoice fetch Failed",
        });
      }
    );
  }

  render() {
    let _this = this;
    return (
      <>
        <div className="invoice_section">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey={this.state.activeKey}
          >
            <div className="payment_history">
              <div className="payment_header">
                <p>Payment history</p>
              </div>
              <Nav variant="pills" className="flex-column">
                {this.state.invoice.map((item, i) => (
                  <Nav.Item
                    key={i}
                    onClick={() => {
                      _this.setState({
                        activeKey: i,
                        selectedInvoice: this.state.invoice[i],
                        invoiceId: item.id,
                      });
                    }}
                  >
                    <Nav.Link eventKey={i}>
                      <div className="pay_history_tabs">
                        <div className="pay_history_box">
                          <p className="pay_title">{item.plan_name}</p>
                          <p className="pay_text">
                            € {item.total_price}/ {item.plan_type}
                          </p>
                        </div>
                        <div>
                          <p className="invoice_no">
                            Invoice number: <span>{item.invoice_number}</span>
                          </p>
                          <p className="invoice_no">
                            Date: <span>{item.invoice_date}</span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <img src={arrow} alt="" />
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                ))}
                {/* <Nav.Item>
                <Nav.Link eventKey="second">
                  {" "}
                  <div className="pay_history_tabs">
                    <div className="pay_history_box">
                      <p className="pay_title">Business</p>
                      <p className="pay_text">€ 2900/ year</p>
                    </div>
                    <div>
                      <p className="invoice_no">
                        Invoice number: <span>9691</span>
                      </p>
                      <p className="invoice_no">
                        Date: <span>02/10/2022</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={arrow} alt=""/>
                  </div>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">
                  <div className="pay_history_tabs">
                    <div className="pay_history_box">
                      <p className="pay_title">Business</p>
                      <p className="pay_text">€ 2900/ year</p>
                    </div>
                    <div>
                      <p className="invoice_no">
                        Invoice number: <span>9691</span>
                      </p>
                      <p className="invoice_no">
                        Date: <span>02/10/2022</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <img src={arrow} alt=""/>
                  </div>
                </Nav.Link>
              </Nav.Item> */}
              </Nav>
            </div>
            <div className="invoice_details">
              <Tab.Content>
                {this.state.selectedInvoice ? (
                  <>
                    <Tab.Pane eventKey={this.state.activeKey}>
                      <div>
                        <div className="invoice_header">
                          <p>
                            Invoice number:{" "}
                            <span>
                              {this.state.selectedInvoice.invoice_number}
                            </span>
                          </p>
                          <a
                            // href={
                            //   "https://kaiwa-api.dev.weconnect.chat/api/admin/printinvoice?id=" +
                            //   this.state.invoiceId
                            // }
                            // target="_blank"
                            download={true}
                            className="btn btn-outlineSecondary"
                            onClick={(e) => {
                              this.downloadSubmit(e);
                            }}
                          >
                            {/* <MdOutlineFileDownload />
                            Download */}
                            <VisibilityIcon className="visibility_icon" />
                            Preview &amp; Generate PDF
                          </a>
                        </div>
                        <div className="billing_details">
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <div>
                                <p className="bill_title">Bill to:</p>
                                <p className="bill_text">
                                  {this.state.selectedInvoice.bill_to}
                                </p>
                              </div>
                            </Grid>
                            <Grid item xs={4}>
                              <div>
                                <p className="bill_title">Bill from:</p>
                                <p className="bill_text">
                                  {this.state.selectedInvoice.bill_from}
                                </p>
                              </div>
                            </Grid>
                            <Grid item xs={4}>
                              <div>
                                <p className="bill_title">Subscription date:</p>
                                <p className="bill_text date_text">
                                  {this.state.selectedInvoice.subscription_date}
                                </p>
                                {/* <p className="bill_title">Payment method:</p>
                          <p className="bill_text">
                            €2900 payment from Mastercard **** 0621
                          </p> */}
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                        <table>
                          <tr>
                            <th>Plan</th>
                            <th>Discount</th>
                            {/* <th>Taxable amount</th> */}
                            <th>Taxes</th>
                            <th>Total price</th>
                          </tr>
                          <tr>
                            <td className="startup_text">
                              {this.state.selectedInvoice.plan_name}
                              <span>
                                <br /> Billed per{" "}
                                {this.state.selectedInvoice.plan_type}
                              </span>
                            </td>
                            <td>€{this.state.selectedInvoice.discount}</td>
                            {/* <td>€0</td> */}
                            <td>€{this.state.selectedInvoice.taxes}</td>
                            <td>€{this.state.selectedInvoice.total_price}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="grand_total">
                        <p>Grand total:</p>
                        <p>€{this.state.selectedInvoice.total_price}</p>
                      </div>
                    </Tab.Pane>
                  </>
                ) : null}
                {/* <Tab.Pane eventKey="second">
                <div>
                  <div className="invoice_header">
                    <p>
                      Invoice number: <span>7892</span>
                    </p>
                    <p>
                      <MdOutlineFileDownload />
                      Download
                    </p>
                  </div>
                  <div className="billing_details">
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <div>
                          <p className="bill_title">Bill to:</p>
                          <p className="bill_text">
                            Mathew Sebastian Tc 25/1131, Bhavan, East
                            Thumbalnoor Thiruvananthapuram 695001 India Phone:
                            7012009704
                          </p>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div>
                          <p className="bill_title">Bill from:</p>
                          <p className="bill_text">
                            Mathew Sebastian Tc 25/1131, Bhavan, East
                            Thumbalnoor Thiruvananthapuram 695001 India Phone:
                            7012009704
                          </p>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div>
                          <p className="bill_title">Subscription date:</p>
                          <p className="bill_text date_text">30/09/2022</p>
                          <p className="bill_title">Payment method:</p>
                          <p className="bill_text">
                            €2900 payment from Mastercard **** 0621
                          </p>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <table>
                    <tr>
                      <th>Plan</th>
                      <th>Discount</th>
                      <th>Taxable amount</th>
                      <th>Taxes</th>
                      <th>Total price</th>
                    </tr>
                    <tr>
                      <td className="startup_text">
                        Startup&nbsp;
                        <span>
                          (2 month free)
                          <br /> Billed per year
                        </span>
                      </td>
                      <td>€68</td>
                      <td>€0</td>
                      <td>€68</td>
                      <td>€790</td>
                    </tr>
                  </table>
                </div>
                <div className="grand_total">
                  <p>Grand total:</p>
                  <p>€790</p>
                </div>
              </Tab.Pane> */}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
        <Dialog
          open={this.state.modalShow}
          onClose={() => {
            this.handleClose();
          }}
          maxWidth={"lg"}
          show={this.state.modalShow}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ height: "calc(100vh - 100px)" }}>
            <Pdfhtml myRef={this.myRef} data={this.state.printinvoice} />
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default InvoiceComponent;
