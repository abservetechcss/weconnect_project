import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import dots from "../../../../../../assets/images/dots.svg";

export default class WelcomeMsgComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        sec: 0,
      },
    };
  }

  increase = () => {
    let tempObj = this.state.formData;
    tempObj["sec"] = parseInt(this.state.formData.sec) + 1;
    this.setState({
      sec: tempObj,
    });
  };

  decrease = () => {
    let tempObj = this.state.formData;
    tempObj["sec"] = this.state.formData.sec - 1;
    this.setState({
      sec: tempObj,
    });
  };

  render() {
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Multi-Lingual Configuration</p>
            <p className="desc">
              Configure Chat Interface language options for Internationalisation
            </p>
          </div>
          <div className="main-block languague_block">
            <div className="availability_box">
              <input type="checkbox"></input>
              <div>
                <p className="availability_title">
                  Enable Multiple language Chat Interface
                </p>
                <p className="availability_text">
                  Setup configuration for multi language Chat Interface conversation
                </p>
              </div>
            </div>
            <div className="basic-acc-block language_box">
              <label className="lang_label">OPTIONS</label>
              <div className="language_inputs">
                <img src={dots} />
                <FloatingLabel
                  className="floating-input-field-block-cust"
                  controlId="floatingPassword"
                  label="text"
                >
                  <Form.Control type="text" placeholder="text" />
                </FloatingLabel>
              </div>
              <div className="language_inputs">
                <img src={dots} />
                <FloatingLabel
                  className="floating-input-field-block-cust"
                  controlId="floatingPassword"
                  label="text"
                >
                  <Form.Control type="text" placeholder="text" />
                </FloatingLabel>
              </div>
              <div className="language_inputs">
                <img src={dots} />
                <FloatingLabel
                  className="floating-input-field-block-cust"
                  controlId="floatingPassword"
                  label="text"
                >
                  <Form.Control type="text" placeholder="text" />
                </FloatingLabel>
              </div>
              <p className="note_text">
                Control options for how the Chat Interface will appear to user in
                particular language. Set the priority for preferences. <br />
                Note: Users location is detected based on IP address where
                Chat Interface is running <br />
                Note: Option 3 will allow users to switch language only from
                Widget
              </p>
            </div>
            <div className="basic-acc-block language_box">
              <p className="sync_title">ENABLE / DISABLE CURRENT LANGUAGES</p>

              <FormGroup>
                <FormControlLabel
                  className="edit-checkbox"
                  control={<Checkbox defaultChecked />}
                  label="EN - ENGLISH"
                />
                <FormControlLabel
                  className="edit-checkbox"
                  control={<Checkbox defaultChecked />}
                  label="NL - DUTCH"
                />{" "}
                <FormControlLabel
                  className="edit-checkbox"
                  control={<Checkbox defaultChecked />}
                  label="FR - FRENCH"
                />{" "}
              </FormGroup>
            </div>
          </div>
          <div className="footer">
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
            <Button variant="outlined" className="save-btn">
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
