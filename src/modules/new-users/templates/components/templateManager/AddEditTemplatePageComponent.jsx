import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
  DialogActions,
  Grid,
  Input,
} from "@mui/material";
import image from "../../../../../assets/images/image.svg";

import { Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { successAlert, errorAlert } from "../../../../../js/alerts";
import SimpleReactValidator from "simple-react-validator";
import { getCategoriesList } from "../../server/CategoryServer.js";
import { getIndustryList } from "../../server/IndustryServer.js";
import CurrencyInput from "react-currency-input-field";
import {
  createTemplate,
  updateTemplate,
  getSingleTemplate,
} from "../../server/TemplateServer.js";
import LoadingButton from "react-bootstrap-button-loader";

export class AddEditTemplatePageComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      alert: null,
      loading: false,
      showImage: false,
      id: null,
      files: "",
      image_URL: null,
      template: {
        template_name: "",
        industry: "",
        category: "",
        // featured: 0,
        premium: 0,
        price: "",
        template_compatibility: "",
        template_description: "",
        template_image: null,
      },
      categoryList: [],
      industryList: [],
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    if (_this.props.editTemplate) {
      setTimeout(() => {
        this.fetchSingleGetData();
      }, 10);
    }
  }
  fetchDataFromServer() {
    let _this = this;
    getCategoriesList(
      "",
      (res) => {
        let tempObj =
          res.category &&
          res.category.length > 0 &&
          res.category.map((prop) => {
            return {
              id: prop.id,
              label: prop.category_name,
              value: prop.id,
            };
          });
        _this.setState({
          loading: false,
          categoryList: tempObj,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
    getIndustryList(
      "",
      (res) => {
        let tempObj =
          res.industry &&
          res.industry.length > 0 &&
          res.industry.map((prop) => {
            return {
              id: prop.id,
              label: prop.industry_name,
              value: prop.id,
            };
          });
        _this.setState({
          loading: false,
          industryList: tempObj,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  }
  fetchSingleGetData = () => {
    let _this = this;
    let params = `id=${_this.props.id}`;
    getSingleTemplate(
      params,
      (res) => {
        let temp = res.edittemplate;

        _this.setState({
          image_URL: temp.image,
          template: {
            template_name: temp.template_name,
            industry: temp.industry,
            category: temp.category,
            // featured: 0,
            premium: temp.premium,
            price: temp.price,
            template_compatibility: temp.template_compatibility,
            template_description: temp.description,
            template_image: temp.image,
          },
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
    let tempObj = _this.props.template;
    _this.setState({
      id: _this.props.id,
      files: "",
      image_URL: null,
      template: {
        template_name: tempObj.template_name,
        industry: "",
        category: "",
        // featured: tempObj.featured,
        premium: tempObj.premium,
        price: "",
        template_compatibility: "",
        template_description: "",
        template_image: null,
      },
    });
  };
  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.template));
    tempObj.template_image = _this.state.image_URL;
    if (_this.validator.allValid()) {
      _this.setState({
        loading: true,
      });
      if (_this.state.id === null) {
        createTemplate(
          tempObj,
          () => {
            _this.setState({
              addEditShowModal: false,
              loading: false,
            });
            setTimeout(() => {
              _this.props.history.push("/user/template-manager");
              window.location.reload(true);
              _this.props.setShowTemplateModal(false);
            }, 3000);
            successAlert("Template created successfully!", _this);
          },
          () => {
            _this.setState({ loading: false });
          }
        );
      } else {
        tempObj.id = _this.state.id;
        updateTemplate(
          tempObj,
          () => {
            _this.setState({
              addEditShowModal: false,
              loading: false,
            });
            setTimeout(() => {
              _this.props.handleCloseModal();
              _this.props.fetchDataFromServer();
            }, 3000);
            successAlert("Template updated successfully!", _this);
          },
          () => {
            _this.setState({ loading: false });
          }
        );
      }
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleImagesChange = (files, name) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0 && files[0].type.includes("image")) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }
      if (files[0].name.includes(".png") || files[0].name.includes(".jpg")) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            // _this.checkImageDimension(reader.result, name);
            console.log(reader.result);
            _this.setState({
              files: files[0],
              image_URL: reader.result,
              showImage: true,
            });
          },
          false
        );
        reader.readAsDataURL(files[0]);
      } else {
        _this.setState({
          files: "",
          image_URL: null,
          showImage: false,
        });
        errorAlert(`Please select a valid Image file type.`, _this);
      }
    }
  };

  handleInputChange = (e) => {
    var newObj = this.state.template;
    newObj[e.target.name] = e.target.value;
    this.setState({ template: newObj });
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Form.Group
                  className="input-field-block-cust"
                  controlId="formBasicEmail"
                >
                  <Form.Control
                    type="text"
                    placeholder="Template name"
                    name="template_name"
                    value={
                      _this.state.template && _this.state.template.template_name
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.validator.message(
                      "template name",
                      _this.state.template &&
                        _this.state.template.template_name,
                      "required"
                    )}
                  </div>
                </Form.Group>
              </Grid>

              <Grid item xs={6}>
                <FloatingLabel
                  controlId="floatingSelect"
                  label="Industry"
                  className="floating-select-field-block-cust"
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    name="industry"
                    value={
                      _this.state.template && _this.state.template.industry
                    }
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select</option>
                    {_this.state.industryList &&
                      _this.state.industryList.length > 0 &&
                      _this.state.industryList.map((prop) => {
                        return <option value={prop.id}>{prop.label}</option>;
                      })}
                  </Form.Select>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "industry",
                      _this.state.template && _this.state.template.industry,
                      "required"
                    )}
                  </div>
                </FloatingLabel>
              </Grid>
              {/* <Grid item xs={6}>
                <div className="template_checkbox">
                  <Form.Group
                    className="input-checkbox-field-block-cust"
                    controlId="formBasicCheckbox"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Featured Template"
                      value={_this.state.template.featured == 0 ? false : true}
                      checked={
                        _this.state.template.featured == 0 ? false : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.template;
                        newObj.featured = newObj.featured == 0 ? 1 : 0;
                        _this.setState({
                          template: newObj
                        });
                      }}
                    />
                  </Form.Group>
                </div>
              </Grid> */}
              <Grid item xs={6}>
                <FloatingLabel
                  controlId="floatingSelect"
                  label="Category"
                  className="floating-select-field-block-cust"
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    name="category"
                    value={
                      _this.state.template && _this.state.template.category
                    }
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select</option>
                    {_this.state.categoryList &&
                      _this.state.categoryList.length > 0 &&
                      _this.state.categoryList.map((prop) => {
                        return <option value={prop.id}>{prop.label}</option>;
                      })}
                  </Form.Select>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "category",
                      _this.state.template && _this.state.template.category,
                      "required"
                    )}
                  </div>
                </FloatingLabel>
              </Grid>
              <Grid item xs={6}>
                <div className="template_checkbox">
                  <Form.Group
                    className="input-checkbox-field-block-cust"
                    controlId="formBasicCheckbox1"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Premium Template"
                      value={_this.state.template.premium == 0 ? false : true}
                      checked={_this.state.template.premium == 0 ? false : true}
                      onChange={(e) => {
                        var newObj = _this.state.template;
                        newObj.premium = newObj.premium == 0 ? 1 : 0;
                        _this.setState({
                          template: newObj,
                        });
                      }}
                    />
                  </Form.Group>
                </div>
              </Grid>
              <Grid item xs={6}>
                <FloatingLabel
                  className="floating-input-field-block-cust"
                  controlId="floatingPassword"
                  label=""
                >
                  <CurrencyInput
                    id="input-example"
                    name="amount"
                    prefix="€ "
                    className="category_input currency_input_template"
                    precision={2}
                    placeholder="Price in (Euro)"
                    decimalsLimit={2}
                    value={_this.state.template.price}
                    onValueChange={(value, name) => {
                      let obj = _this.state.template;
                      obj.price = value;
                      _this.setState({ template: obj });
                    }}
                  />
                  <div className="errorMsg">
                    {_this.validator.message(
                      "price",
                      _this.state.template && _this.state.template.price,
                      "required"
                    )}
                  </div>
                </FloatingLabel>
              </Grid>
              <Grid item xs={6}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Template Description"
                    name="template_description"
                    value={
                      _this.state.template &&
                      _this.state.template.template_description
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.validator.message(
                      "template description",
                      _this.state.template &&
                        _this.state.template.template_description,
                      "required"
                    )}
                  </div>
                </Form.Group>
              </Grid>
              <Grid item xs={6}>
                <div className="compatibility_box">
                  <p>Template Compatibility</p>
                  <div className="compatibility_checkbox">
                    <Form.Group
                      className="input-checkbox-field-block-cust"
                      controlId="formBasicCheckbox"
                    >
                      <Form.Check
                        type="checkbox"
                        label="All"
                        value={
                          _this.state.template.template_compatibility === "All"
                        }
                        checked={
                          _this.state.template.template_compatibility === "All"
                        }
                        onChange={(e) => {
                          var newObj = _this.state.template;
                          newObj.template_compatibility = "All";
                          _this.setState({
                            template: newObj,
                          });
                        }}
                      />
                    </Form.Group>
                    <Form.Group
                      className="input-checkbox-field-block-cust"
                      controlId="formBasicCheckbox"
                    >
                      <Form.Check
                        type="checkbox"
                        label="Web"
                        value={
                          _this.state.template.template_compatibility === "Web"
                        }
                        checked={
                          _this.state.template.template_compatibility === "Web"
                        }
                        onChange={(e) => {
                          var newObj = _this.state.template;
                          newObj.template_compatibility = "Web";
                          _this.setState({
                            template: newObj,
                          });
                        }}
                      />
                    </Form.Group>

                    <Form.Group
                      className="input-checkbox-field-block-cust"
                      controlId="formBasicCheckbox"
                    >
                      <Form.Check
                        type="checkbox"
                        label="WhatsApp"
                        value={
                          _this.state.template.template_compatibility ===
                          "WhatsApp"
                        }
                        checked={
                          _this.state.template.template_compatibility ===
                          "WhatsApp"
                        }
                        onChange={(e) => {
                          var newObj = _this.state.template;
                          newObj.template_compatibility = "WhatsApp";
                          _this.setState({
                            template: newObj,
                          });
                        }}
                      />
                    </Form.Group>
                    <Form.Group
                      className="input-checkbox-field-block-cust"
                      controlId="formBasicCheckbox"
                    >
                      <Form.Check
                        type="checkbox"
                        label="Facebook"
                        value={
                          _this.state.template.template_compatibility ===
                          "Facebook"
                        }
                        checked={
                          _this.state.template.template_compatibility ===
                          "Facebook"
                        }
                        onChange={(e) => {
                          var newObj = _this.state.template;
                          newObj.template_compatibility = "Facebook";
                          _this.setState({
                            template: newObj,
                          });
                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "template compatibility",
                      _this.state.template &&
                        _this.state.template.template_compatibility,
                      "required"
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="basic-acc-block block ">
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE">Template Display Image</label>
                    <div className="preview-upload">
                      <div className="preview">
                        {this.state.image_URL === null ? (
                          <img src={image} alt="" />
                        ) : (
                          <img
                            src={_this.state.image_URL}
                            alt=""
                            className="show-preview"
                          />
                        )}
                      </div>
                      <div className="upload">
                        <label htmlFor="contained-button-file">
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            // multiple
                            type="file"
                            onChange={(e) =>
                              _this.handleImagesChange(
                                e.target.files,
                                "template_image"
                              )
                            }
                          />
                          <Button variant="contained" component="span">
                            Choose file
                          </Button>
                        </label>
                      </div>
                    </div>
                    <div className="condition-block">
                      <ul>
                        <li>Image format: JPG/PNG </li>
                        <li>Aspect Ratio: 16:9 </li>
                        <li>Recommended size: 300x150 pixels</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="errorMsg">
                  {_this.validator.message(
                    "Template Display Image",
                    _this.state.image_URL !== null ? true : "",
                    "required"
                  )}
                </div>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => {
              if (_this.props.editTemplate) {
                _this.props.handleCloseModal();
              } else {
                _this.props.setShowTemplateModal(false);
              }
            }}
            variant="contained"
            className="cancel_btn"
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            loading={_this.state.loading}
            onClick={() => {
              _this.onSubmit();
            }}
            variant="contained"
            className="save_btn"
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {form}
      </Fragment>
    );
  }
}

export default AddEditTemplatePageComponent;
