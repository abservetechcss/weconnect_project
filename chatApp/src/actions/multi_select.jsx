import { Text, CommonReply, CustomReply } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import Checkbox from "@mui/material/Checkbox";

const RowContainer = styled.div`
  position: relative;
  padding: 10px;
`;

const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 7px 10px 7px 6px;
  text-align: center;
  border: none;
  background: #f2f3f5;
  font-size: inherit;
  font-family: inherit;
  width: 100px;
  margin: 4px auto 20px auto;
`;

const OptionContainer = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  color: #00424f;
  font-family: inherit;
  user-select: none;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  word-break: break-all;
  white-space: pre-line;
`;

const FormContainer = styled.div`
  background: #fff;
  color: black;
  box-shadow: 0px 6px 25px #30385236;
  border-radius: 10px;
  text-align: center;
  margin: 10px 10px 10px 50px;
  max-width: 200px;
  width: 100%;
`;

export default class MultiSelect extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      reply: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  static async botonicInit(req) {
    const item = req.input.item || {};
    return item;
  }

  handleChange(event) {
    let checked = this.state.checked;
    const value = event.target.value;
    var index = checked.indexOf(value);
    if (index !== -1) {
      checked.splice(index, 1);
    } else {
      checked.push(value);
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
      const selectedValues = this.props.btn_detail.filter((item) => {
        return this.state.checked.includes(item.btn_id.toString());
      });

      const answerId = selectedValues
        .map((item) => {
          return item.btn_text;
        })
        .join(", ");

      const btnId = selectedValues
        .map((item) => {
          return item.btn_id;
        })
        .join(",");

      this.context.sendInput({
        from: "user",
        type: "text",
        data: answerId,
        item: { btn_id: btnId, btn_text: answerId },
      });
    }
  }

  render() {
    return (
      <>
        <style>
          {`
        .checkbox input{
            cursor: inherit;
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            z-index: 1;
        }
        .checkbox svg{
            width:20px;
            height:20px;
            margin-right:5px
        }
        span.MuiCheckbox-root.MuiCheckbox-colorPrimary.MuiButtonBase-root.MuiCheckbox-root.MuiCheckbox-colorPrimary.PrivateSwitchBase-root.Mui-checked {
            color: #17bdba;
        }
        `}
        </style>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>

        {this.state.reply === false && this.props.reply !== true && (
          <FormContainer>
            <RowContainer>
              {this.props.btn_detail.map((item, i) => {
                return (
                  <OptionContainer key={i} className="checkbox">
                    <Checkbox
                      onChange={this.handleChange}
                      value={item.btn_id}
                      checked={this.state.checked.includes(
                        item.btn_id.toString()
                      )}
                    />
                    {item.btn_text}
                  </OptionContainer>
                );
              })}
            </RowContainer>
            <StyledButton onClick={() => this.submitSelect()}>
              Confirm
            </StyledButton>
          </FormContainer>
        )}
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </>
    );
  }
}
