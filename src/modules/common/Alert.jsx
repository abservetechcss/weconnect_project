import React, { useEffect, useState, useLayoutEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/lab/Alert";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import { FiBookOpen } from "react-icons/fi";
import { useMitt } from "./WebSocketComponent";
import { useHistory } from "react-router-dom";
export const AlertContext = React.createContext({
  showAlert: () => {},
  showLoading: () => {},
});

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    duration: 5000,
    loading: false,
    chat: false,
  });
  const [websocket, setWebsocketError] = useState(false);

  const [chat, setChat] = useState({
    open: false,
    duration: 10000,
    type: "chat",
    message: "Incoming Live Chat",
    subTitle: "Visitor 10 | France | Homapage Bot",
  });

  const { emitter } = useMitt();
  const history = useHistory();

  const showAlert = (obj = {}) => {
    setAlert({
      type: obj.type || "",
      message: obj.message || "",
      duration: obj.duration || 5000,
      loading: false,
    });
  };

  const showLoading = (loading = true) => {
    setAlert({
      ...alert,
      loading: loading,
    });
  };

  useLayoutEffect(() => {
    emitter.on("chatNotification", (result) => {
      const obj = {
        ...result,
        vistor_id: result.client_id,
        open: true,
        duration: 5000,
      };

      if (result.type === "connect_agent") {
        if (result.chattype === "live_chat") {
          obj.message = "Incoming Live Chat";
        } else {
          obj.message = "Incoming Video Chat";
        }
        obj.action = "accept";
        obj.subTitle = `${result.client_name} | ${result.country} | ${result.bot_name}`;
        obj.type = "chat";

        setChat(obj);
      } else if (result.type === "offlineform_response") {
        obj.action = "offline_form";
        obj.message = "New Offline Message";
        obj.subTitle = result.client_name + `|` + result.client_email_id;
        obj.type = "offline";
        obj.open = true;
        setChat(obj);
      } else {
        obj.action = "assign_to_me";
        obj.message = "Chat Initiated";
        obj.subTitle = `${result.client_name} | ${result.country} | ${result.bot_name}`;
        obj.type = "chat";
        setChat(obj);
      }
    });
    emitter.on("websocketActive", (value) => {
      setWebsocketError(value);
    });
    emitter.on("stopLoading", () => {
      showLoading(false);
    });

    emitter.on("showAlert", (obj) => {
      setAlert({
        type: obj.type || "",
        message: obj.message || "",
        duration: obj.duration || 5000,
        loading: false,
      });
    });

    return () => {
      emitter.off("showAlert");
      emitter.off("chatNotification");
      emitter.off("websocketActive");
      emitter.off("stopLoading");
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showLoading }}>
      <>
        {chat.open && (
          <Snackbar
            TransitionComponent={"left"}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={chat.open}
            autoHideDuration={chat.duration}
            onClose={() => {
              setChat({
                ...chat,
                open: false,
              });
            }}
          >
            <MuiAlert
              onClose={() => {
                setChat({
                  ...chat,
                  open: false,
                });
              }}
              className="incoming_alert"
              elevation={6}
              variant="filled"
              icon={
                <FiBookOpen
                  fontSize="inherit"
                  style={{ fontSize: "20px", color: "#8D9194" }}
                />
              }
              severity={"success"}
              style={{
                backgroundColor: "#13171f",
                width: "350px",
              }}
              action={""}
            >
              <div className="alert_incoming_text">
                <h6 className="m-0">{chat.message}</h6>
                <small className="">Now</small>
              </div>
              <small className="alert_subtitle">{chat.subTitle}</small>
              <div className="incoming_btn">
                <Button
                  className="ignore_btn"
                  variant="contained"
                  onClick={() => {
                    setChat({
                      ...chat,
                      open: false,
                    });
                  }}
                >
                  Ignore
                </Button>
                <Button
                  className="respond_btn"
                  variant="contained"
                  onClick={() => {
                    setChat({
                      ...chat,
                      open: false,
                    });
                    if (chat.type === "chat") {
                      emitter.emit("toastAction", chat);
                      history.push("/agent/live-conversation");
                    } else {
                      history.push("/agent/offline-messages");
                    }
                  }}
                >
                  Respond
                </Button>
              </div>
            </MuiAlert>
          </Snackbar>
        )}
        {websocket && (
          <Snackbar
            TransitionComponent={"left"}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={true}
            autoHideDuration={0}
          >
            <MuiAlert
              onClose={() => {
                showAlert({ type: "", loading: false });
              }}
              style={{ whiteSpace: "pre-line", alignItems: "center" }}
              elevation={6}
              variant="filled"
              severity={"error"}
            >
              Websocket Connecting...
            </MuiAlert>
          </Snackbar>
        )}
        {alert.type !== "" && (
          <Snackbar
            TransitionComponent={"left"}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={true}
            autoHideDuration={alert.duration}
            onClose={() => {
              showAlert({ type: "", loading: false });
            }}
          >
            <MuiAlert
              onClose={() => {
                showAlert({ type: "", loading: false });
              }}
              style={{ whiteSpace: "pre-line", alignItems: "center" }}
              elevation={6}
              variant="filled"
              severity={alert.type}
            >
              {alert.message}
            </MuiAlert>
          </Snackbar>
        )}

        {alert.loading && (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{ zIndex: "10000000000000000000000000000" }}
            open={true}
          >
            <div className="loader_main">
              <div className="item_loader">
                <Loader
                  type="box-rotate-x"
                  bgColor={"#32E0A1"}
                  title={"Please wait..."}
                  color={"#fff"}
                  size={100}
                />
              </div>
            </div>
          </Backdrop>
        )}
        {children}
      </>
    </AlertContext.Provider>
  );
};
