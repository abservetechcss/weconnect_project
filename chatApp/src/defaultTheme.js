export default {
    mobileBreakpoint: 600,
    colors: {
        bgColor: "#00424f",
        textColor: "#fff"
      },
    webview: {
      style: {
        top: 0,
        right: 0,
        height: 500,
        width: "100%",
      },
      header: {
        style: {
          background: "#6677FF",
        },
      },
    },
    header: {
        title: "WeConnect.chat",
        subtitle: "How can I help you?",
        image: process.env.REACT_APP_LOGO,
    },
    replies: {
      align: "center",
      wrap: "nowrap",
    },
    server: {
      activityTimeout: 50 * 1000,
      pongTimeout: 20 * 1000,
    },
    userInput: {
      style: {
        background: "#fff",
      },
      box: {
        style: {
          // border: "2px solid #2b81b6",
          color: "#2b81b6",
          background: "#F9F9F9",
          width: "90%",
          borderRadius: 33,
          paddingLeft: 20,
          marginRight: 10,
        },
        placeholder: "Type your answer",
      },

      // enable: false,
      attachments: {
        enable: true,
      },

      emojiPicker: true,
      // These are the set of inputs which are not allowed.
      blockInputs: [
        {
          match: [/ugly/i, /bastard/i],
          message: "We cannot tolerate these kind of words.",
        },
      ],
    },
    scrollbar: {
      // enable: false,
      autoHide: true,
      thumb: {
        opacity: 1,
        color: "#e9ebf2",
        bgcolor: "#000",
        width: "5px",
        border: "10px",
      },
      track: {
        color: "#fff",
        width: "5px",
        bgcolor: "#fff",
        border: "20px",
      },
    },
  }