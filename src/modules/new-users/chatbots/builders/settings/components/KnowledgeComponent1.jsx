import React, { Component, Fragment } from 'react'
import { Accordion, FloatingLabel, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
} from "@mui/material";
import folder from "../../../../../../assets/images/folder-plus.svg"

export default class KnowledgeComponent extends Component {
  render() {
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Knowledge Base</p>
            <p className="desc">
              Select the articles you want to be displayed within the Chat Interface
            </p>
          </div>
          <div className="main-block">
            <div className="knoledge-base-category-block">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="header-block">
                      <div className="check-block">
                        <input type="checkbox" />
                        <span>Category 1</span>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos soluta ea excepturi porro quos obcaecati delectus, at voluptatem repellendus, commodi, nihil nulla aperiam modi quas dignissimos neque magnam facilis beatae?
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <div className="header-block">
                      <div className="check-block">
                        <input type="checkbox" />
                        <span>Category 2</span>
                      </div>
                      <div className="icon-block">
                        <IconButton>
                          <img src={folder} alt="" />
                        </IconButton>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Accordion defaultActiveKey="11" className="inner-according">
                      <Accordion.Item eventKey="11">
                        <Accordion.Header>
                          <div className="header-block">
                            <div className="check-block">
                              <input type="checkbox" />
                              <span>Folder 01</span>
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="check-block">
                            <input type="checkbox" />
                            <span>What is the Knowledge Base?</span>
                          </div>
                          <div className="check-block">
                            <input type="checkbox" />
                            <span>Setting up your Knowledge Base</span>
                          </div>
                          <div className="check-block">
                            <input type="checkbox" />
                            <span>Creating a new Knowledge Base article</span>
                          </div>
                          <div className="check-block">
                            <input type="checkbox" />
                            <span>Customizing your Knowledge Base for additional lang..</span>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <div className="header-block">
                      <div className="check-block">
                        <input type="checkbox" />
                        <span>Category 3</span>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos soluta ea excepturi porro quos obcaecati delectus, at voluptatem repellendus, commodi, nihil nulla aperiam modi quas dignissimos neque magnam facilis beatae?
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
    )
  }
}
