import React, { Component, Fragment } from "react";
import { IconButton, Button } from "@mui/material";
import add_field from "../../../../../../../../../assets/images/Group 20295.svg";
import edit from "../../../../../../../../../assets/images/edit-2.svg";
import trash from "../../../../../../../../../assets/images/trash (1).svg";
import { Form } from "react-bootstrap";
import { step3get, step3save } from "./RaibuStepComponentServer";
import { Container, Draggable } from "react-smooth-dnd";
import { AlertContext } from "../../../../../../../../common/Alert";

// const AntSwitch = styled(Switch)(({ theme }) => ({
//   width: 28,
//   height: 16,
//   padding: 0,
//   display: "flex",
//   "&:active": {
//     "& .MuiSwitch-thumb": {
//       width: 15,
//     },
//     "& .MuiSwitch-switchBase.Mui-checked": {
//       transform: "translateX(9px)",
//     },
//   },
//   "& .MuiSwitch-switchBase": {
//     padding: 2,
//     "&.Mui-checked": {
//       transform: "translateX(12px)",
//       color: "#fff",
//       "& + .MuiSwitch-track": {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
//       },
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     transition: theme.transitions.create(["width"], {
//       duration: 200,
//     }),
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 16 / 2,
//     opacity: 1,
//     backgroundColor:
//       theme.palette.mode === "dark"
//         ? "rgba(255,255,255,.35)"
//         : "rgba(0,0,0,.25)",
//     boxSizing: "border-box",
//   },
// }));
const leadsArr = ["name", "email", "message"]
function removeDuplicates(originalArray, prop) {
  let newArray = [];
  let lookupObject  = {};

  for(let i in originalArray) {
    if(!originalArray.hasOwnProperty(originalArray[i])){
      console.log("loop", originalArray[i][prop], originalArray[i])
    if(originalArray[i][prop])
     lookupObject[originalArray[i][prop]] = originalArray[i];
     else 
     lookupObject[i] = originalArray[i];
    }
  }
  console.log("lookupObject", lookupObject);

  for(let i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}

export default class RaibuStep3Component extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    this.state = {
      addAgent: false,
      edit: false,
      offlineForm: [],
      offline_form_enable: false,
      leadTags: [{
        type: "text",
        subtype: "last_name",
        addLabel: "Add Last Name",
        label: "Last Name"
      }, 
      {
        type: "text",
        subtype: "gender",
        addLabel: "Add Gender",
        label: "Gender",
      },
      {
        type: "text",
        subtype: "company",
        addLabel: "Add Company",
        label: "Company",
      },
      {
        type: "text",
        subtype: "phone",
        addLabel: "Add Phone",
        label: "phone",
      },
      {
        type: "text",
        subtype: "date",
        addLabel: "Add Date",
        label: "date",
      },
      {
        type: "text",
        subtype: "website_url",
        addLabel: "Add Website Url",
        label: "Website Url",
      },
      {
        type: "text",
        subtype: "age",
        addLabel: "Add Age",
        label: "Age",
      },
      {
        type: "text",
        subtype: "lead_country",
        addLabel: "Add Country",
        label: "Country",
      },
      {
        type: "text",
        subtype: "city",
        addLabel: "Add City",
        label: "city",
      },
      {
        type: "text",
        subtype: "address",
        addLabel: "Add Address",
        label: "Address",
      },
      {
        type: "text",
        subtype: "pincode",
        addLabel: "Add Pincode",
        label: "Pincode",
      },
      ],
      savedLeads: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeArrayObject = this.changeArrayObject.bind(this);
    this.handCheckChange = this.handCheckChange.bind(this);
    this.pushObject = this.pushObject.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.getStep = this.getStep.bind(this);
    this.resetForm = this.resetForm.bind(this);

  }

  saveStep() {
    if (
      this.checkDefaultNameExist(this.state.offlineForm) &&
      this.checkDefaultEmailExist(this.state.offlineForm) &&
      this.checkDefaultMessageExist(this.state.offlineForm)
    ) {
      let offlineForm = this.state.offlineForm.map((item) => {
        delete item.edit;
        
        // change correct lead based on label value
        const isLead = this.state.leadTags.findIndex((leadItem,i)=> leadItem.subtype.toLowerCase()===item.label || leadItem.label.toLowerCase()===item.label);

        if(isLead!==-1) {
          const leads = this.state.leadTags[isLead];
          if(item.subtype !== leads.subtype) {
            item.subtype = leads.subtype;
          }
        }

        return item;
      });
      // check unique labels
      // remove duplicate subtype
      // has some sorting issues while removing duplicates
      // offlineForm = removeDuplicates(offlineForm, "subtype");
      // if(true==true) return;
      var formData = new FormData();
      formData.append("bot_id", this.props.botId);
      formData.append(
        "offline_form_enable",
        this.state.offline_form_enable ? 1 : 0
      );
      offlineForm.forEach((item) => {
        formData.append("offlineform[]", JSON.stringify(item));
      });
      this.context.showLoading(false);
      step3save(
        formData,
        (res) => {
          if (res.status === "True") {
            this.props.handleFinishSetupLive();
          } else {
            // this.props.handleSetupLiveClose();
            this.context.showAlert({
              type: "error",
              message: "Add Form Failed",
            });
          }
        },
        (error) => {
          this.context.showAlert({
            type: "error",
            message: error.message || "Add Form Failed",
          });
        }
      );
    }
  }

  addSubType(offlineForm) {
    let newOfflineForm = offlineForm;

    // check name
    if (!this.checkDefaultNameExist(newOfflineForm)) {
      // change name here
      newOfflineForm = newOfflineForm.map((item) => {
        if (item.type === "text" && item.label === "Name")
          item.subtype = "name";
        return item;
      });
      if (!this.checkDefaultNameExist(newOfflineForm)) {
        newOfflineForm.push({
          type: "text",
          label: "Name",
          subtype: "name",
        });
      }
    }

    if (!this.checkDefaultEmailExist(newOfflineForm)) {
      // change name here
      newOfflineForm = newOfflineForm.map((item) => {
        if (item.type === "email" && item.label === "Email")
          item.subtype = "email";
        return item;
      });
      if (!this.checkDefaultEmailExist(newOfflineForm)) {
        newOfflineForm.push({
          type: "email",
          label: "Email",
          subtype: "email",
        });
      }
    }

    if (!this.checkDefaultMessageExist(newOfflineForm)) {
      // change name here
      newOfflineForm = newOfflineForm.map((item) => {
        if (item.type === "textarea" && item.label === "Message")
          item.subtype = "message";
        return item;
      });
      if (!this.checkDefaultMessageExist(newOfflineForm)) {
        newOfflineForm.push({
          type: "textarea",
          label: "Message",
          subtype: "message",
        });
      }
    }
    return newOfflineForm;
  }

  getStep() {
    const params = `bot_id=${this.props.botId}&question_id=${this.props.questionId}`;

    step3get(
      params,
      (res) => {
        if (res.status === "True") {
          let offlineForm = [];
          try {
          offlineForm = JSON.parse("[" + res.offline_form + "]");
        } catch(err) {
          console.log("encode error", err);
        }

          console.log("res.offlineForm", offlineForm);
          if (Array.isArray(offlineForm)) {

            const offsetOfflineForm = this.addSubType(offlineForm);
            let savedLeads = {};
            offsetOfflineForm.forEach(item=>{
              savedLeads[item.subtype] = "True";
            });
            if(this.checkDefaultNameExist(offsetOfflineForm) &&
      this.checkDefaultEmailExist(offsetOfflineForm) &&
      this.checkDefaultMessageExist(offsetOfflineForm)) {
        this.setState({
          offlineForm: offsetOfflineForm,
          savedLeads: savedLeads,
          offline_form_enable:
            res.offline_form_enable === 1 ? true : false,
        });
      }

          }


        }
      },
      (error) => {}
    );
  }

  componentDidMount() {
    this.getStep();
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.dataset.label]: event.target.value });
  };

  handCheckChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.checked });
  };

  changeArrayObject = (index, obj) => {
    this.setState({
      offlineForm: [
        ...this.state.offlineForm.slice(0, index),
        {
          ...this.state.offlineForm[index],
          ...obj,
        },
        ...this.state.offlineForm.slice(index + 1),
      ],
    });
  };

  deleteArrayObject = (index) => {
    console.log("deleteArrayObject", index);
    const isDefault = this.checkDefaultParams(index);

    const offlineForm = [...this.state.offlineForm];
    const activeItem = offlineForm[index];
    offlineForm.splice(index, 1);
    const updateState = {
      offlineForm: offlineForm,
    };
    if(activeItem.subtype) {
      const savedLeads = {...this.state.savedLeads};
      delete savedLeads[activeItem.subtype];
      updateState.savedLeads = savedLeads;
    }
    console.log("offlineForm", offlineForm);
    

    if (!isDefault)
      this.setState(updateState);
  };

  pushObject = (object) => {
    const offlineForm = [...this.state.offlineForm];
    const savedLeads = {...this.state.savedLeads};

    offlineForm.push(object);
    const updateState = {
      offlineForm: offlineForm,
    };
    if(object.subtype) {
      savedLeads[object.subtype] = "True";
      updateState.savedLeads = savedLeads;
    }
    this.setState(updateState);
  };

  addTextField = () => {
    this.pushObject({
      type: "text",
      label: "Text Input",
    });
  };

  addNumberField = () => {
    this.pushObject({
      type: "number",
      label: "Number Input",
    });
  };

  addLongField = () => {
    this.pushObject({
      type: "textarea",
      label: "Long Input",
    });
  };

  addLeadField = (obj) => {
    this.pushObject({
      type: obj.type,
      subtype: obj.subtype,
      label: obj.label,
    });
  };

  resetForm = () => {
    this.setState({
      offlineForm: [
        {
          type: "text",
          label: "Name",
          subtype: "name",
        },
        {
          type: "email",
          label: "Email",
          subtype: "email",
        },
        {
          type: "textarea",
          label: "Message",
          subtype: "message",
        },
      ],
    });
  };

  handleArrayObject = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.dataset.label;
    const value = event.target.value;
    this.changeArrayObject(index, {[label]: value});
  };

  handleKeyDown = (event) => {
    console.log(event);
    if (event.keyCode === 13) {
      const label = "edit";
      const value = false;
      const index = parseInt(event.target.dataset.index);

      // enssure unique name for field
      let labelValue ="";
      if(typeof event.target.value==="string") {
        labelValue = event.target.value.trim().toLowerCase();
      }
      const labelFound = this.state.offlineForm.findIndex((item,i)=> i!==index && item.label.trim().toLowerCase()===labelValue);
      
      const isLead = this.state.leadTags.findIndex((item,i)=> item.type.toLowerCase()===labelValue || item.label.toLowerCase()===labelValue)
          
    if(labelFound!==-1) {
      console.log("labelFound", labelFound);
      const filteredItems = this.state.offlineForm.filter((item,i)=>i!==index);
      
      this.context.showAlert({
        type: "error",
        message: "Label "+event.target.value+" Already Exists!"
      });

      this.setState({
        offlineForm: filteredItems
      });
      
    } else {
      let obj = {[label]: value};
      if(isLead!==-1) {
        const lead = this.state.leadTags[isLead];
        const existing_lead = this.state.offlineForm[index];
        let savedLeads = {...this.state.savedLeads};

        if(existing_lead && existing_lead.subtype) {

          if(leadsArr.includes(existing_lead.subtype)) { 
            this.context.showAlert({
              type: "error",
              message: "Type "+existing_lead.subtype+" is Required!"
            });
            return;
          }
          
         delete savedLeads[existing_lead.subtype]; 
        }


      savedLeads[lead.subtype] = "True";

      this.setState({
        savedLeads: savedLeads
      })

        obj = {...obj,
          ...{
              type: lead.type,
              subtype: lead.subtype,
          }
        }
      }
      this.changeArrayObject(index, obj);
    }

    }
  };

  openEditable = (index) => {
    const label = "edit";
    const value = true;
    this.changeArrayObject(index, {[label]: value});
  };

  closeEditable = (event) => {
    const index = parseInt(event.target.dataset.index);
    const label = "edit";
    const value = false;

    // enssure unique name for field
    let labelValue ="";
    if(typeof event.target.value==="string") {
      labelValue = event.target.value.trim().toLowerCase();
    }
    const labelFound = this.state.offlineForm.findIndex((item,i)=>i!==index && item.label.trim().toLowerCase()===labelValue);
    const isLead = this.state.leadTags.findIndex((item,i)=> item.type.toLowerCase()===labelValue || item.label.toLowerCase()===labelValue)
    if(labelFound!==-1) {
      console.log("labelFound", labelFound);
      const filteredItems = this.state.offlineForm.filter((item,i)=>i!==index);
      this.context.showAlert({
        type: "error",
        message: "Label "+event.target.value+" Already Exists!"
      });
      this.setState({
        offlineForm: filteredItems
      })
      
    } else {
      let obj = {[label]: value};
      if(isLead!==-1) {
        const lead = this.state.leadTags[isLead];
        const existing_lead = this.state.offlineForm[index];
        let savedLeads = {...this.state.savedLeads};
        if(existing_lead && existing_lead.subtype) {

          if(leadsArr.includes(existing_lead.subtype)) { 
            this.context.showAlert({
              type: "error",
              message: "Type "+existing_lead.subtype+" is Required!"
            });
            return;
          }

         delete savedLeads[existing_lead.subtype]; 
        }


      savedLeads[lead.subtype] = "True";

      this.setState({
        savedLeads: savedLeads
      })

        obj = {...obj,
          ...{
              type: lead.type,
              subtype: lead.subtype,
          }
        }
      }
      this.changeArrayObject(index, obj);
    }

  };

  checkDefaultParams = (index) => {
    const item = this.state.offlineForm[index];
    return (
      item.subtype === "email" ||
      item.subtype === "name" ||
      item.subtype === "message"
    );
  };

  checkDefaultNameExist = (offlineForm) => {
    return (
      offlineForm.filter((item) => {
        if (item.subtype === "name") return true;
        return false;
      }).length > 0
    );
  };

  checkDefaultEmailExist = (offlineForm) => {
    return (
      offlineForm.filter((item) => {
        if (item.subtype === "email") return true;
        return false;
      }).length > 0
    );
  };

  checkDefaultMessageExist = (offlineForm) => {
    return (
      offlineForm.filter((item) => {
        if (item.subtype === "message") return true;
        return false;
      }).length > 0
    );
  };

  render() {
    const applyDrag = (arr, dragResult) => {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    };

    return (
      <Fragment>
        <section className="raibu-step-block raibu-step-3">
          <div className="offline-block border">
            <div className="text-block">
              <p className="title">
                Select offline form when all agents are offline
              </p>
              {/* <p className="text">
                Duis aute irure dolor in reprehenderit in voluptate velit dolor
                in reprehenderit
              </p> */}
            </div>
            <span className="switch-btn-cust">
              <input
                type="checkbox"
                id="switch"
                data-label="offline_form_enable"
                checked={this.state.offline_form_enable}
                onChange={this.handCheckChange}
              />
              <label htmlFor="switch">Toggle</label>
            </span>
          </div>
          <div className="add-form-block">
            <div className="add-field-block border">
              <div className="add-block">
                <IconButton
                  component="div"
                  className="add-field"
                  style={{ borderRadius: 0 }}
                  onClick={this.addTextField}
                >
                  <p>Add short text field</p>
                  <img src={add_field} alt="" />
                </IconButton>
                <IconButton
                  component="div"
                  className="add-field"
                  style={{ borderRadius: 0 }}
                  onClick={this.addNumberField}
                >
                  <p>Add number field</p>
                  <img src={add_field} alt="" />
                </IconButton>

                <IconButton
                  component="div"
                  className="add-field"
                  style={{ borderRadius: 0 }}
                  onClick={this.addLongField}
                >
                  <p>Add long text field</p>
                  <img src={add_field} alt="" />
                </IconButton>
                {this.state.leadTags.filter((item) => {
                  return this.state.savedLeads[item.subtype]!=="True"
                }).map((item,i)=>(<IconButton
                  key={i}
                  component="div"
                  className="add-field"
                  style={{ borderRadius: 0 }}
                  onClick={()=>{
                    this.addLeadField(item)
                  }}
                >
                  <p>{item.addLabel}</p>
                  <img src={add_field} alt="" />
                </IconButton>))}

              </div>
              <div className="btn-block">
                <Button variant="outlined" onClick={this.resetForm}>
                  Reset form
                </Button>
              </div>
            </div>
            <div className="form-field-block border">
              <div className="form-block">
                <Form>
                  <Container
                    nonDragAreaSelector=".noDrag"
                    animationDuration={500}
                    onDrop={(e) => {
                      this.setState({
                        offlineForm: applyDrag(this.state.offlineForm, e),
                      });
                    }}
                  >
                    {this.state.offlineForm.map((item, i) => {
                      let editable = true;
                      if (this.checkDefaultParams(i)) editable = false;
                      return (
                        <Draggable key={i}>
                          <Form.Group
                            className="mb-3 input-filed drag_handle"
                            controlId="formBasicEmail"
                            key={i}
                          >
                            <div className="label-block">
                              {item.edit ? (
                                <Form.Control
                                  autoFocus
                                  type="text"
                                  className="transparent noDrag"
                                  value={item.label}
                                  placeholder=""
                                  onBlur={this.closeEditable}
                                  onChange={this.handleArrayObject}
                                  onKeyDown={this.handleKeyDown}
                                  data-index={i}
                                  data-label="label"
                                />
                              ) : (
                                <>
                                  <Form.Label className="drag_handle">
                                    {item.label}
                                  </Form.Label>
                                  <span className="editIcon noDrag">
                                    <IconButton
                                      onClick={() => this.openEditable(i)}
                                    >
                                      <img src={edit} alt="" />
                                    </IconButton>

                                    {editable && (
                                      <IconButton>
                                        <img
                                          src={trash}
                                          alt=""
                                          onClick={() => {
                                            this.deleteArrayObject(i);
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                            <Form.Control
                              type={item.type}
                              className="drag_handle"
                              as={
                                item.type === "textarea" ? "textarea" : "input"
                              }
                              readOnly
                              placeholder=""
                            />
                          </Form.Group>
                        </Draggable>
                      );
                    })}
                  </Container>
                </Form>
              </div>
              <div className="btn-block">
                <Button variant="outlined">Submit</Button>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
