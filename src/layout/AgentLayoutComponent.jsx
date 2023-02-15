import React, {
  useEffect,
  useLayoutEffect,
  useState,
  Fragment,
  useContext,
} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import landingRoutes from "../routes/Agent.jsx";
import { useHistory } from "react-router-dom";
import InnerSidebar from "../modules/side-bar/InnerSideBarComponent.jsx";
import cookie from "react-cookies";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import useRouteMatch from "./useRouteMatch";
import crossX from "../assets/images/x.svg";
import { AlertContext } from "../modules/common/Alert";
import Modal from "react-bootstrap/Modal";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { verifyEmailServer } from "./server/homeserver.js";

const drawerWidth = 184;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardLayout(props) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const routeParams = useRouteMatch(landingRoutes);
  const history = useHistory();
  const verify = localStorage.getItem("verify");
  console.log("verify", verify);
  const [verifyEmail, serVerifyEmail] = useState(
    localStorage.getItem("verified")
  );

  const alertContext = useContext(AlertContext);

  const [chatShow, setchatShow] = useState(true);

  const handleChatClose = () => {
    setchatShow(false);
    localStorage.removeItem("session");
  };

  useLayoutEffect(() => {
    if (routeParams && routeParams.name)
      document.title = "WeConnect | " + routeParams.name;
  }, [routeParams]);

  useEffect(() => {
    console.disableYellowBox = true;
    // setTimeout(() => {
    //     checkValidUser();
    // }, 1000)
  }, []);

  if (localStorage.getItem("loginStatus") !== "true") {
    history.replace("/login");
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const checkValidUser = () => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("admin_type") &&
      localStorage.getItem("email")
    ) {
    } else {
      history.push("/login");
    }
  };

  document.body.style.backgroundColor = "#F2F3F5";

  let form = (
    <div className="dashboard_section">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar className="dash_nav" position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar>
        {/* <Sidebar routePath="agent" {...props} /> */}
        <InnerSidebar
          routePath="agent"
          landingRoutes={landingRoutes}
          setLoading={setLoading}
          {...props}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <div className="content">
            <Switch>
              {landingRoutes.map((prop, key) => {
                if (prop.redirect)
                  return (
                    <Redirect
                      from={prop.path}
                      to={prop.pathTo}
                      name={prop.name}
                      key={key}
                    />
                  );
                else
                  return (
                    <Route
                      path={prop.path}
                      name={prop.name}
                      // component={prop.component}
                      key={key}
                    >
                      <prop.component name={prop.name} {...props} />
                    </Route>
                  );
              })}
            </Switch>
          </div>
        </Box>
      </Box>
    </div>
  );

  return (
    <Fragment>
      <style>
        {`
          .fade.modal.show{
            display:flex !important
          }
          .btn-close{
                position: absolute;
                top: 16px;
                right: 15px;
                font-size: 14px;
          }
          .modal-content{
            padding: 16px;
          }
          .hover:hover{
            background:gray;
            cursor:pointer;
            color:white !important
          }
          .hovera:hover{
            color:white !important
          }
       `}
      </style>
      {loading && (
        <>
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
        </>
      )}
      {form}
      <Dialog
        open={verifyEmail === "0" && localStorage.getItem("verified") === "0"}
        onClose={() => {
          serVerifyEmail(1);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="new-user-dashboard-model-block"
      >
        <DialogTitle id="alert-dialog-title">Verify Email</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="first-model-block" style={{ textAlign: "center" }}>
              It seems your account is not verified, please Verify!
            </div>
            <Box sx={{ textAlign: "center", paddingTop: "15px" }}>
              <Button
                className="use_btn"
                variant="contained"
                type="button"
                sx={{
                  backgroundColor: "#00434f",
                  ":hover": {
                    backgroundColor: "#00434f",
                  },
                }}
                onClick={() => {
                  alertContext.showLoading(true);
                  verifyEmailServer((res) => {
                    serVerifyEmail(1);
                    if (res.status === "True") {
                      alertContext.showAlert({
                        type: "success",
                        message: res.message,
                      });
                    } else {
                      alertContext.showAlert({
                        type: "error",
                        message: res.message,
                      });
                    }
                  });
                }}
              >
                Verify Email
              </Button>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={this.modelFirstClose}>Disagree</Button>
            <Button onClick={this.modelFirstClose} autoFocus>
              Agree
            </Button> */}
        </DialogActions>
      </Dialog>
      {!loading && localStorage.getItem("session") ? (
        <Dialog
          open={chatShow}
          onClose={() => {
            handleChatClose();
          }}
          show={chatShow}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            closeButton
            style={{
              borderBottom: "unset",
            }}
          >
            <Modal.Title
              id="contained-modal-title-vcenter"
              style={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              Use Weconnect.chat from any device
            </Modal.Title>
          </DialogTitle>
          <DialogContent
            style={{
              fontFamily: "Nunito",
              fontWeight: "300",
              borderBottom: "unset",
            }}
          >
            <DialogContentText
              id="alert-dialog-description"
              style={{
                fontFamily: "Nunito",
                fontWeight: "300",
                borderTop: "unset",
              }}
            >
              Download Weconnect.chat apps so you never miss an opportunity to
              connect.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              fontFamily: "Nunito",
              fontWeight: "300",
              borderTop: "unset",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleChatClose}
              style={{
                textTransform: "capitalize",
                border: "1px solid gray",
                fontFamily: "Nunito",
                marginRight: "5px",
              }}
              className="hover"
            >
              <a
                href="https://weconnect.chat/weconnect-apps/"
                blank="_target"
                className="hovera"
                style={{
                  color: "black",
                }}
              >
                Download Apps
              </a>
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                handleChatClose();
              }}
              style={{
                textTransform: "capitalize",
                border: "1px solid gray",
                fontFamily: "Nunito",
              }}
              className="hover"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </Fragment>
  );
}
