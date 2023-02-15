import React, { Component, Fragment } from "react";
import {
  Accordion,
  Card,
  FloatingLabel,
  Form,
  useAccordionButton,
} from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import folder from "../../../../../../assets/images/folder-plus.svg";
import dots from "../../../../../../assets/images/dots.svg";
import arrow from "../../../../../../assets/images/userdash/chevron-left (1).svg";

export default class KnowledgeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryList: [],
    };
  }
  CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => console.log("totally custom!")
      // console.log(eventKey)
    );

    return (
      <button type="button" onClick={decoratedOnClick}>
        {children}
      </button>
    );
  };
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
              <Accordion>
                <Card>
                  <Card.Header>
                    <div className="header-block">
                      <div className="check-block">
                        <input type="checkbox" name="checkBox" />
                        <span>Category 1</span>
                      </div>
                      <div className="check-btn">
                        <div className="icon-block">
                          <Tooltip title="Create folder">
                            <IconButton>
                              <img src={folder} alt="" />
                            </IconButton>
                          </Tooltip>
                        </div>

                        <this.CustomToggle eventKey="0">
                          <img src={arrow} />
                        </this.CustomToggle>
                      </div>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div className="inner-folder-block">
                        <div className="folder-block">
                          <Button
                            className=""
                            variant="contained"
                            onClick={() => {
                              this.setState({
                                articalShow: true,
                              });
                            }}
                          >
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                        <div className="folder-block">
                          <Button className="" variant="contained">
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                        <div className="folder-block">
                          <Button className="" variant="contained">
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <div className="header-block">
                      <div className="check-block">
                        <input type="checkbox" name="checkBox" />
                        <span>Category 1</span>
                      </div>
                      <div className="check-btn">
                        <div className="icon-block">
                          <Tooltip title="Create folder">
                            <IconButton>
                              <img src={folder} alt="" />
                            </IconButton>
                          </Tooltip>
                        </div>

                        <this.CustomToggle eventKey="1">
                          <img src={arrow} />
                        </this.CustomToggle>
                      </div>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <div className="inner-folder-block">
                        <div className="folder-block">
                          <Button
                            className=""
                            variant="contained"
                            onClick={() => {
                              this.setState({
                                articalShow: true,
                              });
                            }}
                          >
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                        <div className="folder-block">
                          <Button className="" variant="contained">
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                        <div className="folder-block">
                          <Button className="" variant="contained">
                            <input type="checkbox" />
                            Folder 1
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
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
    );
  }
}
