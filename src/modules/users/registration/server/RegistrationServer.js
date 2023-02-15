import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";
import { errorAlert } from "../../../../js/alerts.js";


export function userRegistration(_this, data, success, error) {
  api.post(backendURL + "register", data)
    .then((res) => {
      if (res.status === 200) {
        if (res.status === 200 && res.data.message && res.data.status==="False") {
          error(res.data);
           _this.setState({ loading: false });
        } else {
           _this.setState({ loading: false });
          success(res);
        }
      } else {
         _this.setState({ loading: false });
         error(res.data);
      }
    })
    .catch((err) => {
      let Msg = "Registeration failed!";
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        if (Object.keys(data) && Object.keys(data).length > 0) {
          const mapErrors = Object.keys(data).map((prop, key) => {
            return data[prop][0];
          });

          Msg = mapErrors.join("\n\r");
        }
        error({ message: Msg });
      } else {
        error({ message: Msg });
      }
    });
}

export function getCompanyDetails(params, success, error) {
  api
    .get(`${backendURL}admin/editcompanydetails`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function userCreateCompanyDetails(_this, data, success, error) {
  api
    .post(backendURL + "admin/updatecompanydetails", data,{
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        if (
          res.status === 200 &&
          res.data.message &&
          res.data.status === "False"
        ) {
          errorAlert(`${res.data.message}`, _this);
          _this.setState({ loading: false });
        } else {
          _this.setState({ loading: false });
          success(res);
        }
      } else {
        _this.setState({ loading: false });
        error(res);
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        _this.setState({ loading: false });
        errorAlert(`${error.response.data && error.response.data}!`, _this);
      }
    });
}

export async function getCompanySizeList() {
  return api.get(`${backendURL}admin/companysizelist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
}

export async function getIndustryList() {
  return api.get(`${backendURL}admin/industrylist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
}