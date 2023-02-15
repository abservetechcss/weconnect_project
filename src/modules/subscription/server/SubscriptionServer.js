import { backendURL } from "../../../variables/appVariables.jsx";
import { api } from "../../../js/api.js";

import { warningAlert } from "../../../js/alerts"
let secretkey = "test_uazsAzDCpFaxf8BHS5upKSMuPBz266";

export function getSubscriptionPlanList(params, success, error) {
  api
    .get(`${backendURL}admin/planandpricing`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function getSubscriptionBillingAddress(params, success, error) {
  api
    .get(`${backendURL}admin/editsubscribenow`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function updateCompanyBillingAddr(data, success, error) {
  api
    .post(`${backendURL}admin/updatesubscribenow`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
export function getCouponCodeList(_this, params, success, error) {
  api
    .get(`${backendURL}admin/applycouponcode?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      _this.props._this.setState({
        couponCodeLoading: false,
        loading: false,
        couponCode: "",
        CouponDiscount: 0,
        finalAmount: _this.props._this.state.beforeAmount,

      });
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
export function createPaymentMollie(_this, data, success, error) {
  api
    .post(`${backendURL}admin/makepayment`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        _this.props._this.setState({ loading: false });
        //  warningAlert("Your card was declined.", _this.props._this);
      }
    })
    .catch((err) => {
      _this.props._this.setState({ loading: false });
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
      //  warningAlert("Your card was declined.", _this.props._this);
    });
}

export function createBusinessPaymentMollie(_this, data, success, error) {
  api
    .post(`${backendURL}admin/makebusinesspayment`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        _this.props._this.setState({ loading: false });
        //  warningAlert("Your card was declined.", _this.props._this);
      }
    })
    .catch((err) => {
      _this.props._this.setState({ loading: false });
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
      //  warningAlert("Your card was declined.", _this.props._this);
    });
}

export function PrintInvoice(params, success, error) {
  api
    .get(`${backendURL}admin/printinvoice?${params}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res);
        //  warningAlert("Your card was declined.", _this.props._this);
      }
    })
    .catch((err) => {
      error(err);
      //  warningAlert("Your card was declined.", _this.props._this);
    });
}

export function GetInvoice(success, error) {
  api
    .get(`${backendURL}admin/invoice`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res);
        //  warningAlert("Your card was declined.", _this.props._this);
      }
    })
    .catch((err) => {
      error(err);
      //  warningAlert("Your card was declined.", _this.props._this);
    });
}

export function GetPaymentStatus(_this, orderId, success, error) {
  api
    .get(`${backendURL}admin/paymentstatus?order_id=${orderId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res)
        _this.setState({ loading: false });
      }
    })
    .catch((err) => {
      error(err)
      _this.setState({ loading: false });
    });
}
export function GetSummary(success, error) {
  api
    .get(`${backendURL}admin/subscriptiondetails`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      console.log("summary", res);
      if (res.status === 200) {
        console.log("iffffffffff summary", res.data);

        success(res.data);
      } else {
        error(res);
      }
    })
    .catch((err) => {
      error(err);
    });
}


export function GetCancelsub(success, error) {
  api
    .get(`${backendURL}admin/cancelsubscription`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      console.log("summary", res);
      if (res.status === 200) {

        success(res.data);
      } else {
        error(res);
      }
    })
    .catch((err) => {
      error(err);
    });
}
