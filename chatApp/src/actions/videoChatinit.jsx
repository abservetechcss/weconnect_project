import { Text, Reply } from "../components";
import React from "react";
import BsFillCameraVideoFill from "../assets/react-icons/BsFillCameraVideoFill";

export default class VideoChatInit extends React.Component {
  static async botonicInit(req) {
    const item = req.input.item || {};
    let message = item.message;
    // https://meet.dev.weconnect.chat/N2UzeTFBT2FBaU42OVpMVXNkRWxCRDU5YUpTYk9ReDZaU3pnN01JcVVROD0
    const link = item.vistorvideolink;
    const type = item.type;
    if(type==="videochatlink") {
      message = item.message || "Click Here to Start Video Chat";
    }
    return { message, link, type };
  }

  render() {
    return (
      <>
        <Text html={false} from={this.props.type==="videochatlink"?"user":"bot"}>
          <div>
          <Reply href={this.props.link} item={this.props.item} text={this.props.message} disable={true} component="a" style={{margin: "0px", whiteSpace:"nowrap"}} target="_blank">
            <BsFillCameraVideoFill style={{marginRight: "8px"}}/>
            {this.props.message}
          </Reply>
          </div>
        </Text>
      </>
    );
  }
}
