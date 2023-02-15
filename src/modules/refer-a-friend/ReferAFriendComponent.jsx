import { Grid, Button } from "@mui/material";
import React, { Component } from "react";
import facebook from "../../assets/images/userdash/facebook.png";
import whatsapp from "../../assets/images/userdash/whatsapp.png";
import twitter from "../../assets/images/userdash/twitter.png";
import gmail from "../../assets/images/userdash/gmail.png";
import linkedin from "../../assets/images/userdash/linkedin.png";
import share from "../../assets/images/userdash/share-2.svg";
import user from "../../assets/images/userdash/user-plus.svg";
import gift from "../../assets/images/userdash/gift.svg";
import reward1 from "../../assets/images/userdash/Group 19212.png";
import reward2 from "../../assets/images/userdash/Group 19211.png";
import filter from "../../assets/images/userdash/Group 17736.svg";
import MUIDataTable from "mui-datatables";
import { getReferFriendList } from "../analytics/conversation/server/ConversationServer";
export class ReferAFriendComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showfriendList: [],
      referUrl: "",
      page: 1,
      limit: 10,
    };
  }

  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);

    this.fetchReferFriendList();
  }

  fetchReferFriendList() {
    let _this = this;
    let params = `limit=${this.state.limit}&page=${this.state.page}`;
    getReferFriendList(
      params,
      (res) => {
        res.referral_data.forEach((r) => {
          delete r.date;
        });
        console.log(res.referral_data);
        _this.setState({
          referUrl:
            window.location.protocol +
            "://" +
            window.location.host +
            "/referer/" +
            res.ref_key,
          showfriendList: res.referral_data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    let _this = this;
    const options = {
      filterType: "dropdown",
      print: false,
      download: false,
      responsive: "scrollMaxHeight",
      filter: false,
      viewColumns: false,
      search: false,
    };
    return (
      <div className="refer_section">
        <div className="refer_summary_block">
          <div className="title-block">
            <p className="refer_summary_title">Referral Summary</p>
            <p className="refer_summary_text">
              {/* Excepteur sint occaecat cupidatat. */}
            </p>
          </div>
          <div className="refer_count_box">
            <p className="refer_count_title">18</p>
            <p className="refer_count_text">Referral this month</p>
          </div>
          <div className="refer_count_box">
            <p className="refer_count_title">10</p>
            <p className="refer_count_text">Ranking this month</p>
          </div>
          <div className="refer_count_box">
            <p className="refer_count_title">186</p>
            <p className="refer_count_text">Referral this month</p>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item md={5} sm={12} xs={12}>
            <div className="refer_link_box">
              <div className="refer_link_box_header">
                <p className="refer_link_box_title">
                  Share your Unique Referral Link
                </p>
                <p className="refer_link_box_text">
                  Get as many people as possible to sign up using this unique
                  URL
                </p>
              </div>
              <div className="refer_link_main">
                <div className="refer_link_url">
                  <p className="url_label">URL</p>
                  <div className="url_input">
                    <input type="text" value={_this.state.referUrl} />
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigator.clipboard.writeText(_this.state.referUrl);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="social_icons_box">
                    <img src={facebook} />
                    <img src={whatsapp} />
                    <img src={twitter} />
                    <img src={gmail} />
                    <img src={linkedin} />
                  </div>
                </div>
                <div className="how_it_work_box">
                  <p className="how_it_work_title">How it Works?</p>
                  <div className="work_process">
                    <img src={share} />
                    <div>
                      <p className="work_process_title">
                        Share your refer link
                      </p>
                      <p className="work_process_text">
                        Invite your friends to join Weconnect.chat using your
                        unique referral link
                      </p>
                    </div>
                  </div>{" "}
                  <div className="work_process">
                    <img src={user} />
                    <div>
                      <p className="work_process_title">
                        Your friend joins Weconnect.chat
                      </p>
                      <p className="work_process_text">
                        {/* Duis aute irure dolor in reprehenderit in voluptate
                        velit */}
                      </p>
                    </div>
                  </div>
                  <div className="work_process">
                    <img src={gift} />
                    <div>
                      <p className="work_process_title">Earn rewards</p>
                      <div className="reward_box">
                        <img src={reward1} />
                        <p>
                          Monthly Winner will get lifetime free access to all
                          WeConnect.Chat products
                        </p>
                      </div>
                      <div className="reward_box">
                        <img src={reward2} />
                        <p>
                          Refer 5 friends to receive a free weconnect.chat
                          branded t-shirt.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item md={7} sm={12} xs={12}>
            <div className="refer_link_box">
              <div className="leader_board_header">
                <div>
                  <p className="refer_link_box_title">Leader Board</p>
                  <p className="refer_link_box_text"></p>
                </div>
              </div>
              <MUIDataTable
                title={""}
                // data={[
                //   {
                //     rank: "1",
                //     name: "Test Corp",
                //     referrals: "67",
                //   },
                //   {
                //     rank: "1",
                //     name: "Test Corp",
                //     referrals: "67",
                //   },
                //   {
                //     rank: "1",
                //     name: "Test Corp",
                //     referrals: "67",
                //   },
                //   {
                //     rank: "1",
                //     name: "Test Corp",
                //     referrals: "67",
                //   },
                // ]}
                data={this.state.showfriendList}
                columns={[
                  {
                    name: "rank",
                    label: "Rank",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                  {
                    name: "name",
                    label: "Name",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                  {
                    name: "referrals",
                    label: "Referrals",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                ]}
                options={options}
                className="leader_board_table"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ReferAFriendComponent;
