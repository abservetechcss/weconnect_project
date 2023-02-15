import React, {useState} from "react";
import { Form } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import edit2 from "../../../../../../assets/images/edit-2.svg";

const EditWidgetLabel = (props) => {
    const [showEdit,setShowEdit] = useState(false);
    const inputProps = props.inputProps?props.inputProps: {};
    return (<div className="editWidgetLabel">
      {showEdit ?
        <Form.Group
        className="mb-3 input-filed drag_handle"
        controlId="formBasicEmail"
      >
        <Form.Control
        autoFocus
        type="text"
        className="transparent noDrag"
        name={props.inputName}
        value={props.value[props.inputName]}
        placeholder={props.placeholder || "active agents"}
        onBlur={()=>{setShowEdit(false);}}
        onChange={(e)=>{props.onChange(e)}}
        onKeyDown={(e)=>{
            if (e.key === "Enter") {
                setShowEdit(false);
              }
        }}
        {...inputProps}
      />
      </Form.Group>:
      <div className="availability_box">
        {props.checkboxName !==false &&
      <input
        value={
            props.value[props.checkboxName] ===
          0
            ? false
            : true
        }
        checked={
            props.value[props.checkboxName] ===
          0
            ? false
            : true
        }
        name={props.checkboxName}
        onChange={(e) => {
            props.onChangeCheckbox(e)
        }}
        type="checkbox"
      ></input>}
      <div style={{ width: "100%" }}>
        <p className="availability_title" style={{width: "40ch",overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis"}}>
          {props.label?props.label:props.value[props.inputName]}
        </p>
        <p className="availability_text">
                    {props.placeholder}
                  </p>
      </div>
    </div>
        }
        <IconButton onClick={()=>{
            setShowEdit(true);
          }}>
          <img src={edit2} alt="" />
        </IconButton></div>);
}
export default EditWidgetLabel;