import React, { Component, Fragment } from "react";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { EditorState, convertToRaw,AtomicBlockUtils, Modifier,convertFromRaw, ContentState,convertFromHTML } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import Picker from "react-giphy-component";
import draftToHtml from "draftjs-to-html";
import createImagePlugin from "@draft-js-plugins/image";

export class GifImagesPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 

  insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        {_this.props.isArrayFormat ? (
          <Picker
            apiKey={"LgyFqDpSMY4BanrZVAWBdGeEQ2ppu4yR"}
            onSelected={(item) => {
               let obj =
                 _this.props.messageData &&
                 _this.props.messageData.length > 0 &&
                 _this.props.messageData
                   .filter((x) => {
                     return x.active;
                   })
                   .map((prop) => {
                     prop.message = `${item.preview_gif.url.split("?")[0]}`;
                     prop.showImage = false;
                     prop.showVideo = false;
                     prop.GIFImg = true;
                     return prop;
                   });
              _this.props.closePopUp()
               _this.props._this.setState({
                 messageData: obj,
                 isShowGifImgModal: false,
               },()=>{
                if(_this.props._this && _this.props._this.props.refreshComponent)
                _this.props._this.props.refreshComponent();
               });
            
            }}
          />
        ) : (
          <Picker
            apiKey={"LgyFqDpSMY4BanrZVAWBdGeEQ2ppu4yR"}
            onSelected={(item) => {
              const newEditorState = _this.props.imagePlugin.addImage(
                _this.props.messageText,
                item.preview_gif.url.split("?")[0]
              );
              _this.props._this.setState({
                messageText: newEditorState,
                isShowGifImgModal: false
              },()=>{
                if(_this.props._this && _this.props._this.props.refreshComponent)
                _this.props._this.props.refreshComponent();
               });
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default GifImagesPageComponent;
