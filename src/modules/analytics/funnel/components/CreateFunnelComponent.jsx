import React, { Component, Fragment } from "react";
import { Tooltip } from "@mui/material";
import { ResponsiveFunnel } from "@nivo/funnel";
import CreateFunnelHeaderComponent from "../../../common/CreateFunnelHeaderComponent";
import chart from "../../../../assets/images/bar-chart-2.svg";
import { getCreateFunnelList } from "../server/FunnelServer.js";
import moment from "moment";

export class CreateFunnelComponent extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: true,
      botId: props.botId,
      botName: props.botName,
      botItemList: [],
      filterDate: [null, null],
      question_lists: props.question_lists,
      resultData: props.question_lists,
      searchText: "",
      question_Data: [],
      conversation_rate: 0,
      final_funnel: [],
      percentage: [],
      lowesetPercent: 0,
      total_conversation: 0,
      total_leads: 0,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchCreateFunnel(_this.props.botId);
  }

  fetchCreateFunnel(id) {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = `botid=${botId}`;
    if (
      _this.state.question_lists &&
      _this.state.question_lists.filter((x) => {
        return x.value;
      }).length > 0
    ) {
      _this.state.question_lists
        .filter((x) => {
          return x.value;
        })
        .map((prop) => {
          params += `&id[]=${prop.id}`;
        });
    }
    if (startDate === null) {
      params += `&duration=all`;
    } else {
      params += `&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&duration=date`;
    }
    _this.setState({
      loading: true,
    });

    getCreateFunnelList(
      _this,
      params,
      (res) => {
        let temp = [];
        temp =
          Object.keys(res.final_funnel) &&
          Object.keys(res.final_funnel).length > 0 &&
          Object.keys(res.final_funnel).map((prop, key) => {
            return {
              questionId: prop,
              id: `answered-dropped${key}`,
              value: `${parseInt(
                res.final_funnel[prop].answered + res.final_funnel[prop].dropped
              )}`,
              label: `answered:${res.final_funnel[prop].answered}  dropped:${res.final_funnel[prop].dropped}`,
              answered: res.final_funnel[prop].answered,
              dropped: res.final_funnel[prop].dropped,
            };
          });
        let newObj = [];
        if (temp && temp.length > 0) {
          temp
            .sort((a, b) => {
              return b.value - a.value;
            })
            .map((prop) => {
              if (
                _this.state.question_lists.filter((x) => {
                  return parseInt(x.id) === parseInt(prop.questionId);
                }).length > 0
              ) {
                let obj = _this.state.question_lists.filter((x) => {
                  return parseInt(x.id) === parseInt(prop.questionId);
                })[0];
                newObj.push({
                  question: obj.question,
                  id: obj.id,
                  value: obj.value,
                });
              }
            });
        }
        debugger;
        console.log("updated value", {
          loading: false,
          conversation_rate: res.conversation_rate,
          final_funnel: temp,
          percentage: res.percentage,
          lowesetPercent: res.percentage.indexOf(
            Math.min.apply(null, res.percentage)
          ),
          total_conversation: res.total_conversation,
          total_leads: res.total_leads,
          question_Data:
            newObj && newObj.length > 0 ? newObj : _this.state.question_lists,
        });
        _this.setState({
          loading: false,
          conversation_rate: res.conversation_rate,
          final_funnel: temp,
          percentage: res.percentage,
          lowesetPercent: res.percentage.indexOf(
            Math.min.apply(null, res.percentage)
          ),
          total_conversation: res.total_conversation,
          total_leads: res.total_leads,
          question_Data:
            newObj && newObj.length > 0 ? newObj : _this.state.question_lists,
        });
        _this.props.showLoading(false);
      },
      () => {
        _this.setState({
          loading: false,
        });
        _this.props.showLoading(false);
      }
    );
  }

  render() {
    let _this = this;

    return (
      <Fragment>
        <div>
          <CreateFunnelHeaderComponent
            chidThis={_this}
            createFunnelDate={_this.state.filterDate}
            filterDate1={(date) => {
              _this.setState({
                filterDate: date,
              });
            }}
            createFunnel={true}
            question_lists={_this.state.question_lists}
            resultData={_this.state.resultData}
            searchText={_this.state.searchText}
            handleChange={(e) => {
              _this.setState({
                searchText: e.target.value,
              });
            }}
            fetchCreateFunnel={() => {
              _this.fetchCreateFunnel();
            }}
            {..._this.props}
          />
          <div className="funnel_main_section">
            <div className="col-xl-4 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="funnel_inner_header">Questions</div>
              <div className="funnel_question_list">
                {_this.state.question_Data &&
                  _this.state.question_Data.length > 0 &&
                  _this.state.question_Data
                    .filter((x) => {
                      return x.value;
                    })
                    .map((prop) => {
                      return (
                        <p className="funnel_inner_questions">
                          {prop.question}
                        </p>
                      );
                    })}
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="funnel_inner_header">Funnel</div>
              {_this.state.final_funnel &&
              _this.state.final_funnel.length > 0 ? (
                <div className="funnel_chart_block">
                  <div className="funnel_graph_container">
                    {_this.state.final_funnel
                      .sort((a, b) => {
                        return b.value - a.value;
                      })
                      .map((item, i) => {
                        const answerPercent =
                          (item.answered / item.value) * 100;
                        const droppedPercent =
                          (item.dropped / item.value) * 100;
                        return (
                          <Tooltip title={item.label} placement="top">
                            <div className="funnel_block">
                              <div className="funnel_percentage">
                                <div
                                  className="funnel_per_content"
                                  style={
                                    this.state.lowesetPercent === i
                                      ? { color: "red" }
                                      : {}
                                  }
                                >
                                  {this.state.percentage[i] > 0
                                    ? window
                                        .parseFloat(this.state.percentage[i])
                                        .toFixed(2) + " %"
                                    : ""}
                                </div>
                              </div>
                              <div
                                id={i > 7 ? "level7" : "level" + i}
                                className="funnelChild"
                              >
                                <div className="funnel_bar">
                                  <div
                                    className="answered"
                                    style={{ width: answerPercent + "%" }}
                                  >
                                    {item.answered}
                                  </div>
                                  <div
                                    className="dropped"
                                    style={{ width: droppedPercent + "%" }}
                                  >
                                    {item.dropped}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                        );
                      })}
                  </div>

                  {/* <ResponsiveFunnel
                    data={_this.state.final_funnel.sort((a, b) => {
                      return b.value - a.value;
                    })}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    shapeBlending={0}
                    spacing={14}
                    valueFormat=">-.4s"
                    colors={[
                      "#48eadf",
                      "#32e7db",
                      "#1be4d7",
                      "#18cdc1",
                      "#17c7ba",
                    ]}
                    borderWidth={0}
                    borderOpacity={0.35}
                    fillOpacity={1}
                    labelColor={{
                      from: "color",
                      modifiers: [["darker", "3"]],
                    }}
                    enableBeforeSeparators={false}
                    beforeSeparatorLength={100}
                    enableAfterSeparators={false}
                    afterSeparatorLength={100}
                    currentBorderWidth={0}
                    motionConfig="wobbly"
                  /> */}
                </div>
              ) : _this.state.loading ? (
                <div className="text-center alert alert-danger position-static">
                  Loading...
                </div>
              ) : (
                <div className="text-center alert alert-danger position-static">
                  No data found!
                </div>
              )}
            </div>
            <div className="col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="funnel_inner_header">Details</div>
              <div className="funnel_detail_section">
                <div className="funnel_detail_block">
                  <img src={chart} alt="" />
                  <div>
                    <p className="funnel_detail_title">Total Conversations</p>
                    <p className="funnel_detail_text">
                      {_this.state.total_conversation}
                    </p>
                  </div>
                </div>
                <div className="funnel_detail_block">
                  <img src={chart} alt="" />
                  <div>
                    <p className="funnel_detail_title">Leads</p>
                    <p className="funnel_detail_text">
                      {_this.state.total_leads}
                    </p>
                  </div>
                </div>
                <div className="funnel_detail_block">
                  <img src={chart} alt="" />
                  <div>
                    <p className="funnel_detail_title">Conversion rate</p>
                    {_this.state.conversation_rate > 0 ? (
                      <p className="funnel_detail_text">{`${_this.state.conversation_rate.toFixed(
                        2
                      )}%`}</p>
                    ) : (
                      <p className="funnel_detail_text">{`${_this.state.conversation_rate}%`}</p>
                    )}
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

export default CreateFunnelComponent;
