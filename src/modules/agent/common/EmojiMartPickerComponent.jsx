import React, { Component, Fragment } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { EditorState, convertToRaw, Modifier, ContentState } from "draft-js";

export class EmojiMartPickerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
}

componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
}
  
  handleClick(event) {
    try {
      let isEmojiClassFound = false;
    event &&
      event.path &&
      event.path.forEach(elem => {
        if (elem && elem.classList) {
          const data = elem.classList.value;
          if (data.includes("emoji")) {
            isEmojiClassFound = true;
          }
        }
      });
    if ( isEmojiClassFound === false && event.target.id !== "emojis-btn")
          this.props._this.setState({
               isShowEmojiModal: false
             });

    } catch(error) {
        return null
    }
}

  render() {
    let _this = this;
    return (
      <Fragment>
        {_this.props.isArrayFormat ? (
            <Picker
          title="Pick your emoji…"
          emoji="point_up"
          className="emoji-block-section"
          showPreview={false}
          showSkinTones={false}
          defaultSkin={1}
          onSelect={(e) => {
            let emoji = e.native;
            let obj= _this.props.messageData && _this.props.messageData.length>0&&_this.props.messageData.map((prop,i) => {
              if(_this.props.index===i)
               prop.message = `${prop.message + emoji}`;
               return prop;
             });
              _this.props._this.setState({
                messageData: obj
              });
          }}
          />
          ): (
              <Picker
          title="Pick your emoji…"
          emoji="point_up"
          className="emoji-block-section"
          showPreview={false}
          showSkinTones={false}
          defaultSkin={1}
          onSelect={(e) => {
            let emoji = e.native;
            if (_this.props.textEditor) {
              const contentState = Modifier.replaceText(
                _this.props.messageText.getCurrentContent(),
                _this.props.messageText.getSelection(),
                `${emoji}`,
                _this.props.messageText.getCurrentInlineStyle()
              );
              _this.props._this.setState({
                isShowEmojiModal: false,
                messageText: EditorState.push(
                  _this.props.messageText,
                  contentState,
                  "insert-characters"
                )
              },()=>{
                if(_this.props._this && _this.props._this.props.refreshComponent)
                _this.props._this.props.refreshComponent();
              });
            } else {
              _this.props._this.setState({
                messageText: `${_this.props.messageText + emoji}`,
                isShowEmojiModal: false
              },()=>{
                if(_this.props._this && _this.props._this.props.refreshComponent)
                _this.props._this.props.refreshComponent();
              });
            }
          }}
        />
          )
        }
      
      </Fragment>
    );
  }
}

export default EmojiMartPickerComponent;
