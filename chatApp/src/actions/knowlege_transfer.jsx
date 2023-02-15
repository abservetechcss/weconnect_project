import { Text, CommonReply, CustomReply } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import FiExternalLink from "../assets/react-icons/FiExternalLink";
// const ButtonContainer = styled.div`
//   flex-direction: row;
// `
const RowContainer = styled.div`
  position: relative;
  padding: 10px;
  margin-left: 42px;
`;

const KnowledgeItems = styled.div`
  display: block;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  text-align: left;
  box-shadow: 0px 6px 25px #30385236;
  border-radius: 10px;
  padding: 10px;
  font-family: inherit;
  color: #00424f;
  font-size: 13px;
  max-width: 270px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  &:hover {
    background: #00424f;
    color: #fff;
  }
`;
const KnowledgeText = styled.label`
  max-width: 210px;
  width: 100%;
  white-space: break-spaces;
`;
const KnowledgeIcon = styled.label`
  font-size: 18px;
`;

export default class KnowledgeTransfer extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      reply: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  setChecked(date) {
    this.setState({
      checked: [],
    });
  }

  static async botonicInit(req) {
    return {
      question_id: "4C358C21-C3CB-4F0D-81E8-67197B550975",
      type: "multi_select",
      label: "What are you interested in?",
      back_button: "0",
      skip_button: "0",
      chip_type: "",
      welcome_card_image: "",
      enable: "0",
      bg_color: "",
      bg_color_start: null,
      text_color: "",
      welcome_card_bg_type: "",
      hide: "0",
      jump_to: 0,
      options: [
        {
          option_id: "958",
          option: "What is your favourite color?",
        },
        {
          option_id: "959",
          option: "What is your favourite State?",
        },
        {
          option_id: "960",
          option: "What is your gender?",
        },
        {
          option_id: "961",
          option: "Which of the following devices do you have?",
        },
      ],
    };
  }

  handleChange(event) {
    let checked = this.state.checked;
    var index = checked.indexOf(event.target.value);
    if (index !== -1) {
      checked.splice(index, 1);
    } else {
      checked.push(event.target.value);
    }
    this.setState({
      checked: checked,
    });
  }

  submitSelect() {

    if (this.state.checked.length > 0) {
      this.setState({
        reply: true,
      });
      const selected = this.props.options
        .filter((item) => {
          return this.state.checked.includes(item.option_id);
        })
        .map((item) => {
          return item.option;
        });
      const answer = selected.join(",");
      this.context.sendInput({ type: "text", data: answer });
    }
  }

  render() {
    return (
      <>
        <Text>{this.props.label}</Text>

        {this.state.reply === false && this.props.reply!== true && (
          <RowContainer>
            {this.props.options.map((item, i) => {
              return (
                <KnowledgeItems key={i}>
                  <KnowledgeText> {item.option}</KnowledgeText>
                  <KnowledgeIcon>
                    <FiExternalLink />
                  </KnowledgeIcon>
                </KnowledgeItems>
              );
            })}
          </RowContainer>
        )}
        <CustomReply>
          <CommonReply {...this.props} />
        </CustomReply>
      </>
    );
  }
}
