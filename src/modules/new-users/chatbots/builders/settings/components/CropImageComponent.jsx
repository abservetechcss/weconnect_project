import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function CropImageComponent(props){
  const [image, setImage] = useState(props.imageProp);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();


  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      let newObj = props.childThis.state.messageData;
      newObj[props.index].message = cropper.getCroppedCanvas().toDataURL();
    newObj[props.index].cropperImg = cropper.getCroppedCanvas().toDataURL();
      props.childThis.setState({ messageData: newObj });
    }
  };

  return (
    <div>
      <div>
        <Cropper
          style={{ height: "202px", width: "202px" }}
          className="imageCropper"
          aspectRatio={1 / 1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
        <button onClick={getCropData}>Crop Image</button>
      </div>
      <div>
        {cropData !== "#" ? (
          <div className="box">
            <img style={{width:"100px",height:"100px"}} src={cropData} alt="cropped" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CropImageComponent;
