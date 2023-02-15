import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import ChatPreview from "../conversation/chatPreview";
// import { IFrameComponent } from "./ReactIframe";
const DeviceViewComponent = forwardRef((props, ref) => {
  const elementRef = useRef();

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.initChat();
    }
  }, [props.mode]);

  useImperativeHandle(ref, () => ({
    initChat: () => {
      console.log("Preview part");
      if (elementRef.current) {
        elementRef.current.initChat();
      }
    },
  }));

  return (
    <>
      {props.responsive === "laptop" ? (
        <>
          <ChatPreview
            ref={elementRef}
            mode={props.mode}
            editMode="design"
            botId={props.botId}
          />
        </>
      ) : props.responsive === "tab" ? (
        <div class="tablet_view">
          <div class="content_view">
            <ChatPreview
              ref={elementRef}
              mode={props.mode}
              editMode="design"
              botId={props.botId}
            />
          </div>
        </div>
      ) : props.responsive === "mobile" ? (
        <div class="smartphone_view">
          <div class="content_view">
            <ChatPreview
              ref={elementRef}
              mode={props.mode}
              editMode="design"
              botId={props.botId}
            />
          </div>
        </div>
      ) : null}
    </>
  );
});

export default DeviceViewComponent;
