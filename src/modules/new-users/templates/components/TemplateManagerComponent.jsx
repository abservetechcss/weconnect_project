import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Form } from "react-bootstrap";
import { setInnerSideBar } from "../../../../redux/actions/ReduxActionPage.jsx";

import deleteIconBlack from "../../../../assets/images/userdash/trash-2.svg";
import editBlack from "../../../../assets/images/userdash/edit-2.svg";
import preview from "../../../../assets/images/Group 19435.svg";


export class TemplateManagerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClickOpen = () => {
    this.setState({ template: true });
  };

  handleClose = () => {
    this.setState({ template: false });
  };
  render() {
    let _this = this;
    const data = [
      [
        <div className="chatbot_title">
          <div></div>
          <a
            role="button"
            onClick={() => {
              let obj = {};
              obj.innerSideBarActive = true;
              obj.chatBotName = "Hybrid Conversation";
              _this.props.setInnerSideBarActive(obj);
              setTimeout(() => {
                this.props.history.push("/user/chatbots/overview");
              }, 100);
            }}
          >
            <p>Template Name 1</p>
          </a>
          <p className="chatbot_text">New</p>
        </div>,
        "Yes",
        "Yes",
        "Education",
        "General",
        <div className="chatbot_switch">
          <span className="switch-btn-cust">
            <input type="checkbox" id="switch_temp1" />
            <label htmlFor="switch_temp1">Toggle</label>
          </span>
          <p>Active</p>
        </div>,
      ],
      [
        <div className="chatbot_title">
          <div></div>
          <a
            role="button"
            onClick={() => {
              let obj = {};
              obj.innerSideBarActive = true;
              obj.chatBotName = "Hybrid Conversation";
              _this.props.setInnerSideBarActive(obj);
              setTimeout(() => {
                this.props.history.push("/user/chatbots/overview");
              }, 100);
            }}
          >
            <p>Template Name 1</p>
          </a>
          <p className="chatbot_text">New</p>
        </div>,
        "Yes",
        "Yes",
        "Education",
        "General",
        <div className="chatbot_switch">
          <span className="switch-btn-cust">
            <input type="checkbox" id="switch_temp2" />
            <label htmlFor="switch_temp2">Toggle</label>
          </span>
          <p>Active</p>
        </div>,
      ],
      [
        <div className="chatbot_title">
          <div></div>
          <a
            role="button"
            onClick={() => {
              let obj = {};
              obj.innerSideBarActive = true;
              obj.chatBotName = "Hybrid Conversation";
              _this.props.setInnerSideBarActive(obj);
              setTimeout(() => {
                this.props.history.push("/user/chatbots/overview");
              }, 100);
            }}
          >
            <p>Template Name 1</p>
          </a>
          <p className="chatbot_text">New</p>
        </div>,
        "Yes",
        "Yes",
        "Education",
        "General",
        <div className="chatbot_switch">
          <span className="switch-btn-cust">
            <input type="checkbox" id="switch_temp3" />
            <label htmlFor="switch_temp3">Toggle</label>
          </span>
          <p>Active</p>
        </div>,
      ],
      [
        <div className="chatbot_title">
          <div></div>
          <a
            role="button"
            onClick={() => {
              let obj = {};
              obj.innerSideBarActive = true;
              obj.chatBotName = "Hybrid Conversation";
              _this.props.setInnerSideBarActive(obj);
              setTimeout(() => {
                this.props.history.push("/user/chatbots/overview");
              }, 100);
            }}
          >
            <p>Template Name 1</p>
          </a>
          <p className="chatbot_text">New</p>
        </div>,
        "Yes",
        "Yes",
        "Education",
        "General",
        <div className="chatbot_switch">
          <span className="switch-btn-cust">
            <input type="checkbox" id="switch_temp4" />
            <label htmlFor="switch_temp4">Toggle</label>
          </span>
          <p>Active</p>
        </div>,
      ],
    ];

    const options = {
      filterType: "dropdown",
      print: false,
      download: false,
      filter: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      search: false,
    };
    let form = (
      <Fragment>
        <div className="chatbots_section">
          <MUIDataTable
            title={""}
            data={data}
            columns={[
              {
                name: "Template Name",
                label: "Template Name",
                options: {
                  filter: true,
                  sort: true,
                },
              },
              {
                name: "Featured",
                label: "Featured",
                options: {
                  filter: true,
                  sort: true,
                },
              },
              {
                name: "Premium",
                label: "Premium",
                options: {
                  filter: true,
                  sort: true,
                },
              },
              {
                name: "Industry",
                label: "Industry",
                options: {
                  filter: true,
                  sort: true,
                },
              },
              {
                name: "Category",
                label: "Category",
                // options: {
                //   filter: true,
                //   sort: true,
                // },
                options: {
                  filter: true,
                  sort: true,
                  className: "category_td",
                  customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('pending', tableMeta.rowData[4]);
                    // console.log('approve', tableMeta.rowData[5]);
                    return (
                      // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                      <>
                        <div className="middle-edit-block">
                          <span className="value">{value}</span>
                          <div className="trend-edit-block">
                            <span className="edit duplicate">
                              <img src={preview} alt="" />
                              Preview
                            </span>
                            <span className="edit">
                              <img src={editBlack} alt="" />
                              Edit
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  },
                },
              },
              {
                name: "status",
                label: "Status",
                // options: {
                //   filter: true,
                //   sort: true,
                // },
                options: {
                  filter: true,
                  sort: true,
                  customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('pending', tableMeta.rowData[4]);
                    // console.log('approve', tableMeta.rowData[5]);
                    return (
                      // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                      <>
                        <div className="middle-edit-block">
                          <span className="value">
                            <div className="chatbot_switch">
                              <span className="switch-btn-cust">
                                <input type="checkbox" id="switch_temp5" />
                                <label htmlFor="switch_temp5">Toggle</label>
                              </span>
                              <p>Active</p>
                            </div>
                          </span>
                          <span className="edit delete">
                            <img src={deleteIconBlack} alt="" />
                            Delete
                          </span>
                        </div>
                      </>
                    );
                  },
                },
              },
            ]}
            className="chatbot_table"
            options={options}
          />
        </div>
      </Fragment>
    );
    return <Fragment>{form}</Fragment>;
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setInnerSideBarActive: (data) => {
      dispatch(setInnerSideBar(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(TemplateManagerComponent);
