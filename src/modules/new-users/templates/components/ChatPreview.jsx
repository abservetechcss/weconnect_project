import React, { useEffect, useRef,forwardRef, useImperativeHandle } from "react";


const ChatPreview = forwardRef((props, ref) => {
  const [previewKey, setPreviewKey] = React.useState(0);
  /**
   * To Avoid re-rendering, here we provide init method, it should be called only once per page
   * call on did mount or fetch success for each component
   */
  const [init, setInit] = React.useState(false); 
  
  const elementRef = useRef();

  useImperativeHandle(ref, () => ({
    initChat: ()=>{
      if (window.WeConnect && window.WeConnect.render) {
        console.log("weconnect refresh..");
        let currentKey = previewKey + 1;
        setPreviewKey(currentKey);
        setInit(true);
      }
    }
  }));

  useEffect(() => {
    if(previewKey===0)
    return;
    console.log("INit Using UseEffect");
    if (window.WeConnect && window.WeConnect.render) {
      console.log("elementRef.current", elementRef.current);
      if (elementRef.current) {
        window.WeConnect.render(elementRef.current, {
          mode: props.mode, // widget, landing, embed
          editMode: props.editMode, // builder, production
          botId: window.btoa(props.botId),
          key: previewKey
        });
      }
    }
  },[previewKey]);

  useEffect(() => {
    console.log("Init Value", init);
    if(!init) return;
    console.log("Hard Refresh");
    if (window.WeConnect && window.WeConnect.render) {
      console.log("weconnect refresh..");
      let currentKey = previewKey + 1;
      setPreviewKey(currentKey);
    }
  }, [props.mode, props.botId]);

  return (
    <div ref={elementRef} key={previewKey}>
    </div>
  );
});

export default ChatPreview;