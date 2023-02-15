import { ColorPicker } from "react-color-gradient-picker";
import React, { useState } from "react";
import { Button, IconButton, Menu } from "@mui/material";

const iconColor = {
  red: 159,
  green: 22,
  blue: 237,
  alpha: 1,
};
const WidgetColorPicker = (props) => {
  // const [solidColor,setSolidColor] = useState(iconColor);
  const [modal, setModal] = useState(false);
  const solidOpen = Boolean(modal);

  const handleSolidClick = (event) => {
    setModal(event.currentTarget);
  };

  const handleSolidClose = (event) => {
    setModal(false);
  };

  const onChangeSolidColor = (colorcardAttrs) => {
    props.onChange(colorcardAttrs, props.name);
  };

  return (
    <div>
      <div className="color-block">
        <div className="simple">
          <Button
            variant="text"
            onClick={handleSolidClick}
            style={{ color: "rgba(0, 0, 0, 0.87)" }}
          >
            <div
              className="preview-color-box"
              style={
                typeof props.color === "string"
                  ? {
                      background: props.color,
                    }
                  : props.color && props.color.style
                  ? {
                      background: props.color.style,
                    }
                  : {
                      background: "#fff",
                    }
              }
            ></div>
            Color
          </Button>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={modal}
        open={solidOpen}
        onClose={handleSolidClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        className="color-model-block"
      >
        <div>
          <ColorPicker
            onStartChange={onChangeSolidColor}
            onChange={onChangeSolidColor}
            onEndChange={onChangeSolidColor}
            color={typeof props.color === "object" ? props.color : iconColor}
          />
        </div>
      </Menu>
    </div>
  );
};
export default WidgetColorPicker;
