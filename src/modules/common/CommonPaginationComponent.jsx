import React, { Component, Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { warningAlert } from "../../js/alerts";
export class CommonPaginationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSizeList: [5, 10, 25, 50]
    };
  }

  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="pagination-block-cust">
          <div className="row-page">
            <label htmlFor="Rows per page">Rows per page</label>
            <Form.Select
              aria-label="Default select example"
              className="simple-select-field-block-cust"
              value={_this.props.limit}
              onChange={(e) => {
                _this.props._this.setState({ limit: e.target.value });
                setTimeout(() => {
                  _this.props.fetchDataFromServer();
                }, 1000);
              }}
            >
              {_this.state.pageSizeList.map((prop) => {
                return <option value={prop}>{prop}</option>;
              })}
            </Form.Select>
          </div>
          <div className="pagination">
            <div className="number-block">
              <Button
                type="button"
                variant="light"
                disabled={_this.props.page <= 1}
                className={_this.props.page <= 1 ? "disabled" : ""}
                onClick={() => {
                  if (_this.props.page > 1) {
                    _this.props._this.setState({
                      page: _this.props.page - 1
                    });
                     setTimeout(() => {
                       _this.props.fetchDataFromServer();
                     }, 1000);
                  }
                }}
              >
                <ChevronLeftIcon className="icon" />
              </Button>
              <Form.Group
                className="input-field-block-cust"
                controlId="formBasicEmail"
              >
                <Form.Control
                  type="text"
                  value={_this.props.page}
                  onChange={(e) => {
                    if (
                      e.target.value > 0 &&
                      e.target.value <= _this.props.pages
                    ) {
                      _this.props._this.setState({
                        page: e.target.value
                      });
                       setTimeout(() => {
                         _this.props.fetchDataFromServer();
                       }, 1000);
                    } else {
                      warningAlert("Invalid input", _this.props._this);
                    }
                  }}
                />
              </Form.Group>
              <Button
                type="button"
                variant="light"
                disabled={_this.props.page >= _this.props.pages}
                className={
                  _this.props.page >= _this.props.pages ? "disabled" : ""
                }
                onClick={() => {
                  if (_this.props.page < _this.props.pages) {
                    _this.props._this.setState({
                      page: _this.props.page + 1
                    });
                     setTimeout(() => {
                       _this.props.fetchDataFromServer();
                     }, 1000);
                  }
                }}
              >
                <ChevronRightIcon className="icon" />
              </Button>
            </div>
            <div className="total-page">
              <label htmlFor="">of {_this.props.pages}</label>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CommonPaginationComponent;
