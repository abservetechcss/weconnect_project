import { IconButton, Tooltip } from "@mui/material";
import menu from "../../../../../../assets/images/userdash/Group 18691.svg";
import line from "../../../../../../assets/images/Line 20.svg";
import {
  FiGitPullRequest,
  FiEye,
  FiCopy,
  FiEdit2,
  FiPlay,
  FiTrash,
} from "react-icons/fi";
import { chatTypes } from "../../../../../../variables/appVariables.jsx";

const ChatBlock = (props) => {
  const handleDelete = () => {
    props.handleDelete(props.item);
  };
  const handleEdit = () => {
    props.handleEditComponent({
      type: props.item.type,
      questionId: props.item.question_id,
      order_no: props.item.order_no,
    });
  };
  const handlePlay = () => {
    props.handlePlay(props.index);
  };
  const handleSkipComponent = () => {
    props.handleSkipComponent(props.item);
  };
  const handleCopyComponent = () => {
    props.handleCopyComponent(props.item);
  };
  const handleInsertMiddle = () => {
    props.handleInsertMiddle(props.item);
  };

  return (
    <div className="hover_add_component">
      <div className="chat-block">
        <span className="drag_handle">
          <img src={menu} className="noSelect" alt="" />
        </span>
        <div>
          <div className="chat_welcome_btn_block">
            <p className="chat_component_title">
              Q{props.item.order_no + 1}:{" "}
              {chatTypes[props.item.type]
                ? chatTypes[props.item.type]
                : "Unknown"}
            </p>
            {props.item.btncount > 0 && (
              <p className="chat_welcome_btn">{props.item.btncount} Buttons</p>
            )}
          </div>
          <p
            className="chat_component_text"
            dangerouslySetInnerHTML={{ __html: props.item.chat_message }}
          />
          <div className="chat_menu_block">
            <div>
              <Tooltip title="Play">
                <IconButton
                  sx={{
                    borderRadius: "0px",
                  }}
                  role="button"
                  onClick={() => handlePlay()}
                >
                  <FiPlay />
                  <span>Play</span>
                </IconButton>
              </Tooltip>
            </div>
            <div className="component_icons">
              {/*  */}
              <Tooltip title="Logical Jump">
                <IconButton
                  role="button"
                  onClick={() => {
                    props.hanleLoginCalJump();
                  }}
                >
                  <FiGitPullRequest
                    style={
                      props.item.logicalstatus === 1 ? { color: "#17BDBA" } : {}
                    }
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Skip">
                <IconButton role="button" onClick={() => handleSkipComponent()}>
                  <FiEye
                    style={props.item.skip === 0 ? { color: "#17BDBA" } : {}}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" role="button">
                <IconButton onClick={() => handleEdit()}>
                  <FiEdit2 />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy">
                <IconButton onClick={() => handleCopyComponent()}>
                  <FiCopy />
                </IconButton>
              </Tooltip>
              <img className="line_img" src={line} alt="" />
              <Tooltip title="Delete">
                <IconButton role="button" onClick={() => handleDelete()}>
                  <FiTrash />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div
        className="add_component_builder"
        onClick={() => handleInsertMiddle()}
      >
        <span>Add new component</span>
      </div>
      {/* <div className="component_line">
        <span className="text">Add new component</span>
      </div> */}
    </div>
  );
};
export default ChatBlock;
