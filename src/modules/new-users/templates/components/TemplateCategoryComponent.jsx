import React, { Component, Fragment } from 'react'
import { FloatingLabel, Form, Nav, Tab } from "react-bootstrap";

export class TemplateCategoryComponent extends Component {   
    constructor(props) {
        super(props)
        this.state = {
           key:1, 
        }
    }

  render() {
    let _this = this;
        return (
          <Fragment>
            <div className="category_section">
              <div className="category_header">Categories</div>
              <div className="category_main">
                <Nav
                  defaultActiveKey={_this.state.key}
                  variant="pills"
                  className="flex-column"
                >
                  {_this.props.categoryList &&
                  _this.props.categoryList.length > 0 ? (
                    _this.props.categoryList.map((prop, key) => {
                      return (
                        <Nav.Item eventKey={key + 1}>
                          <Nav.Link
                            role="button"
                            className={
                              _this.props.categoryName === prop.name
                                ? "category_list active"
                                : "category_list"
                            }
                            onClick={() => {
                              _this.setState({
                                key: key + 1
                              });
                              _this.props._this.setState({
                                categoryName: prop.name
                              });
                              setTimeout(() => {
                                _this.props.fetchDataFromServer();
                              });
                            }}
                            eventKey={key + 1}
                          >
                            <span>{prop.name}</span>
                            <span>({prop.count})</span>
                          </Nav.Link>
                        </Nav.Item>
                      );
                    })
                  ) : this.props.loading ? 
                  (
                    <div className="text-center alert alert-danger">
                      Loading...
                    </div>
                  ):
                  (
                    <div className="text-center alert alert-danger">
                      No Data Found!
                    </div>
                  )}
                </Nav>
              </div>
            </div>
          </Fragment>
        );
    }
}

export default TemplateCategoryComponent
