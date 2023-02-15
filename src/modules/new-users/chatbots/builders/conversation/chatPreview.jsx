import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatPreview = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const webchat = useSelector((data) => data.webchat);
  const [previewKey, setPreviewKey] = React.useState(0);
  /**
   * To Avoid re-rendering, here we provide init method, it should be called only once per page
   * call on did mount or fetch success for each component
   */
  // const [init, setInit] = React.useState(false);

  const elementRef = useRef();

  useImperativeHandle(ref, () => ({
    initChat: () => {
      if (window.WeConnect && window.WeConnect.render) {
        let currentKey = previewKey + 1;
        setPreviewKey(currentKey);
      }
      // setInit(true);
    },
  }));

  useEffect(() => {
    if (previewKey === 0) return;
    // debugger;
    if (window.WeConnect && window.WeConnect.render) {
      if (elementRef.current) {
        window.WeConnect.render(elementRef.current, {
          deviceMode: webchat.chatPreviewType,
          mode: props.mode, // widget, landing, embed
          editMode: props.editMode, // builder, production
          botId: window.btoa(props.botId),
          key: previewKey,
        });
      }
    }
  }, [previewKey]);

  return <div ref={elementRef} key={previewKey}></div>;
});

export default ChatPreview;
