import React from "react";
import { Text, customMessage, CommonReply, CustomReply } from "../components";
import styled from "styled-components";
import { WebchatContext } from "../contexts";

import TextField from "@mui/material/TextField";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FormGroup = styled.div`
  padding: 10px 0px;
`;
const FormContainer = styled.div`
  border: none;
  color: black;
  border-radius: 20px;
  background: #fff;
  max-width: 100%;
  box-shadow: 0px 6px 25px #30385236;
  border-radius: 10px;
  padding: 10px;
  opacity: 1;
`;
const Button = styled.button`
  height: 40px;
  background: #2f2f2f;
  border-radius: 8px;
  margin-top: 5px;
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;


class OfflineForm extends React.Component {
  static contextType = WebchatContext;
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.form,
      saveClicked: false,
      disbleButton: false,
      reply: false
    };
  }

  handleArrayObject = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = "value";
    const value = event.target.value;
    let updatedForm = [
      ...this.state.formData.slice(0, index),
      {
        ...this.state.formData[index],
        [label]: value,
      },
      ...this.state.formData.slice(index + 1),
    ];
    if(this.state.saveClicked)
    updatedForm = this.markErrors(updatedForm);
    
    this.setState(
      {
        formData: updatedForm,
      }
    );
  };

  async close() {
    const markError = this.markErrors(this.state.formData);
    this.setState({ formData: markError, saveClicked: true });
    const errorCount = markError.filter(item=>item.error===true).length;
    if (errorCount===0) {
      
      const offlineData = this.state.formData.map(item=>{
        delete item.error;
        delete item.required;
        delete item.name;
        return item;
      });
      this.context.sendMessage({
        type: "offlineform",
        offline_form: JSON.stringify(offlineData)
      });
      this.setState(
        {
          reply: true,
        }
      );
    }
  }

  markErrors(state) {
    const markError = state.map((item)=>{
      if(item.value.trim()=="") {
        item.error = true;
      } else {
        if(item.subtype==="email") {
          const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
          if(item.value.match(emailRegex)===null) {
            item.error = true;    
            return item;
          }
        }
        item.error = false;
      }
      return item;
    });
    return markError;
  }

  render() {
    return (
      <>{this.state.reply===false && 
        (<FormContainer>
        <Form>
          {this.state.formData.map((item,i)=>{
            if(item.subtype==="date") {
              return (<FormGroup key={i}>
                <TextField
                type="date"
              required={item.required}
              label=""
              name={item.name}
              inputProps={{ "data-index": i }}
              onChange={this.handleArrayObject}
              className="weconnect_offline_form_ip"
              placeholder={item.label}
              value={item.value}
              error={item.error}
              style={{ width: "100%" ,marginRight: "40px"}}
            /></FormGroup>)
            } else if(item.subtype==="phone") {
              return (<FormGroup key={i}>
                <TextField
                type="tel"
              required={item.required}
              label=""
              name={item.name}
              inputProps={{ "data-index": i }}
              onChange={this.handleArrayObject}
              className="weconnect_offline_form_ip"
              placeholder={item.label}
              value={item.value}
              error={item.error}
            /></FormGroup>)
            } else if(item.type==="text") {
            return (<FormGroup key={i}><TextField
            required={item.required}
            label=""
            name={item.name}
            inputProps={{ "data-index": i }}
            onChange={this.handleArrayObject}
            className="weconnect_offline_form_ip"
            placeholder={item.label}
            value={item.value}
            error={item.error}
          /></FormGroup>)
          } else if(item.type==="email") {
            return (<FormGroup key={i}>
              <TextField
                required={item.required}
                placeholder={item.label}
                type="email"
                className="weconnect_offline_form_ip"
                label=""
                name={item.name}
                inputProps={{ "data-index": i }}
                onChange={this.handleArrayObject}
                value={item.value}
                error={item.error}
              />
            </FormGroup>)
          } else if(item.type==="textarea") {
            return (<FormGroup key={i}>
              <TextField
                required={item.required}
                label=""
                name={item.name}
                className="weconnect_offline_form_ip"
                placeholder={item.label}
                multiline
                rows={4}
                inputProps={{ "data-index": i }}
                onChange={this.handleArrayObject}
                value={item.value}
                error={item.error}
              />
            </FormGroup>)
          } else if(item.type==="number") {
            return (<FormGroup key={i}><TextField
              // required={item.required}
              type="number"
              label=""
              name={item.name}
              inputProps={{ "data-index": i }}
              onChange={this.handleArrayObject}
              className="weconnect_offline_form_ip"
              placeholder={item.label}
              value={item.value}
              error={item.error}
            /></FormGroup>);
          }

          }
          )}
           <FormGroup>
            <Button disabled={this.state.disbleButton} onClick={() => this.close()}>Submit</Button>
          </FormGroup>
        </Form>
      </FormContainer>)
    }</>
    );
  }
}

const CustomMessage = customMessage({
  name: "offline-form",
  component: OfflineForm,
  defaultProps: {
    style: {
      background: "none",
      width: "100%",
      border: "none",
      boxShadow: "none",
    },
    imagestyle: { display: "none" },
    blob: false,
    enabletimestamps: false,
  },
});
export default class OfflineMessage extends React.Component {
  static contextType = WebchatContext;
  constructor(props) {
    super(props);
  }
  static async botonicInit(req) {
    const item = req.input.item || {};
    item.form = [];
    try {
      var form = [];
      // why api team is sending different param on different scenario
      if(item.offline_form && item.offline_form.form)
      form = JSON.parse("["+item.offline_form.form+"]");

      if(item.offlineform && item.offlineform.offlineform)
      form = JSON.parse("["+item.offlineform.offlineform+"]");

      if(item.offlineform && item.offlineform.form)
      form = JSON.parse("["+item.offlineform.form+"]");
      item.form = form.map((arr,i)=>{
        arr.value = "";
        let subtype = arr.subtype || "";
        if(arr.subtype==="name") {
          subtype = "first_name";
        }
        if(item.leads && item.leads[subtype])
        arr.value = item.leads[subtype];
        arr.required = false;
        arr.name = "form"+i;
        arr.error = false;
        if(arr.subtype!=="") {
          arr.required = true;
        }
        return arr;
      });
    } catch(error) {
      console.log("offlineForm Error", error)
    }
    console.log("Offline Form Agent", req);
    return item;
  }

  render() {
    return (
      <>
        <Text>{this.props.message}</Text>
        {this.props.reply!== true && (<>
          <CustomMessage {...this.props} />
        <CustomReply>
          <CommonReply {...this.props} />
        </CustomReply>
        </>)}
      </>
    );
  }
}
