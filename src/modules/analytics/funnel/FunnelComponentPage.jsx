import React, { Component, Fragment } from "react";
import { Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import InsightHeaderComponent from "../../common/InsightHeaderComponent";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";

import { decryptBot } from "../../../js/encrypt";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { getAllFunnelList } from "./server/FunnelServer.js";
import CreateFunnelComponent from "./components/CreateFunnelComponent.jsx";

export class FunnelComponentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      filterDate: [null, null],
      activeTab: 0,
      selectFilter: false,
      botId: null,
      botName: "",
      botItemList: [],
      question_lists: [],
      stepFirst: true,
      stepSecond: false,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({
        botId: decryptedData && decryptedData.botId,
        botName: decryptedData && decryptedData.botName,
      });
      _this.fetchDataFromServer(decryptedData && decryptedData.botId);
    }
    getAdminChatBotList(
      _this,
      "",
      (res) => {
        _this.setState({ loading: false });
        let newObj =
          res.bot_list &&
          res.bot_list.length > 0 &&
          res.bot_list.map((prop) => {
            return {
              id: prop.bot_id,
              label: prop.bot_name,
              value: prop.bot_id,
            };
          });
        _this.setState({
          botItemList: newObj,
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  }
  fetchDataFromServer(id) {
    let _this = this;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = `botid=${botId}`;
    _this.setState({ loading: true });
    getAllFunnelList(
      _this,
      params,
      (res) => {
        let tempObj = [];
        var parser = new DOMParser();
        Object.keys(res.question_lists) &&
          Object.keys(res.question_lists).length > 0 &&
          Object.keys(res.question_lists).map((prop, key) => {
            let doc = parser.parseFromString(
              `${res.question_lists[prop]?.title}`,
              "text/html"
            );
            tempObj.push({
              question: doc.body.innerText,
              id: res.question_lists[prop].id,
              value: false,
              key: key,
            });
          });
        _this.setState({ loading: false, question_lists: tempObj });
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  render() {
    let _this = this;
    let form = (
      <Fragment>
        {_this.state.stepFirst ? (
          <div className="chatbots_section">
            <InsightHeaderComponent
              _this={_this}
              filterDate={_this.state.filterDate}
              funnel={true}
              question_lists={_this.state.question_lists}
              fetchDataFromServer={() => {
                _this.fetchDataFromServer();
              }}
              {..._this.props}
            />
            <div className="funnel_section">
              <div className="funnel_header_block">
                <div>
                  <p className="funnel_title">Select questions</p>
                  <p className="funnel_text">
                    Select the questions to be added in the funnel.
                  </p>
                </div>
                <Button
                  disabled={
                    _this.state.question_lists &&
                    _this.state.question_lists.filter((x) => {
                      return x.value;
                    }).length > 0
                      ? false
                      : true
                  }
                  style={
                    _this.state.question_lists &&
                    _this.state.question_lists.filter((x) => {
                      return x.value;
                    }).length > 0
                      ? { backgroundColor: "#00434f" }
                      : { backgroundColor: "rgb(173 170 170)" }
                  }
                  onClick={() => {
                    if (
                      _this.state.question_lists &&
                      _this.state.question_lists.filter((x) => {
                        return x.value;
                      }).length > 0
                    ) {
                      _this.setState({
                        stepFirst: false,
                        stepSecond: true,
                      });
                    }
                  }}
                  variant="contained"
                >
                  Create funnel
                </Button>
              </div>
              <div className="funnel_main">
                <FormGroup>
                  {_this.state.question_lists &&
                  _this.state.question_lists.length > 0 ? (
                    _this.state.question_lists.map((prop, index) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={prop.value}
                              value={prop.value}
                              onChange={(e) => {
                                let temp = _this.state.question_lists;
                                temp[index].value = !prop.value;
                                _this.setState({
                                  question_lists: temp,
                                });
                              }}
                            />
                          }
                          label={prop.question}
                        />
                      );
                    })
                  ) : _this.state.loading ? (
                    <div className="text-center alert alert-danger">
                      Loading...
                    </div>
                  ) : (
                    <div className="text-center alert alert-danger">
                      No questions found!
                    </div>
                  )}
                </FormGroup>
              </div>
            </div>
          </div>
        ) : _this.state.stepSecond ? (
          <CreateFunnelComponent
            _this={_this}
            botId={_this.state.botId}
            botName={_this.state.botName}
            showLoading={(value) => {
              _this.setState({
                loading: value,
              });
            }}
            question_lists={_this.state.question_lists}
            fetchDataFromServer={() => {
              _this.fetchDataFromServer();
            }}
            {..._this.props}
          />
        ) : null}
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
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

export default FunnelComponentPage;
