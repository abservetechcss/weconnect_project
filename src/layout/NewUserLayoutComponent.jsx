import React, { useEffect, useLayoutEffect, useState, Fragment, useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Switch, Route, Redirect } from "react-router-dom";
import landingRoutes from "../routes/NewUser.jsx";
import { useHistory } from "react-router-dom";
import InnerSidebar from "../modules/side-bar/InnerSideBarComponent.jsx";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import useRouteMatch from "./useRouteMatch";
import { MittContext } from "../modules/common/WebSocketComponent"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { verifyEmailServer } from "./server/homeserver.js"
import { AlertContext } from "../modules/common/Alert";


const drawerWidth = 184;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default function NewUserLayoutComponent(props) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  let [loadKey, setLoadKey] = useState(0);
  const routeParams = useRouteMatch(landingRoutes);
  const history = useHistory();
  const verify =  localStorage.getItem('verify');
  console.log("verify", verify);
  const [verifyEmail, serVerifyEmail] = useState(localStorage.getItem('verified'));
  const alertContext = useContext(AlertContext);
  const emitterContext = useContext(MittContext);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useLayoutEffect(()=>{
    emitterContext.emitter.on("applayoutForceUpdate",()=>{
      // forceUpdate()
      console.log("loadKey", loadKey);
      loadKey = loadKey+1;
      setLoadKey(loadKey);
    });
    return ()=>{
      emitterContext.emitter.off("applayoutForceUpdate");
    };
  },[]);


  useLayoutEffect(()=>{
    if(routeParams && routeParams.name) {
      document.title = "WeConnect | "+ routeParams.name;
    }
  },[routeParams]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  if (localStorage.getItem("loginStatus")!=="true") { 
    history.replace("/login");
  } else if (localStorage.getItem("admin_type") === "agent") {
    history.replace("/agent/dashboard");
  }

  document.body.style.backgroundColor = "#F2F3F5";
  const passProps= {...props};
  delete passProps['staticContext'];
  let form = (
    <div className="dashboard_section" >
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
                ...(open && { display: "none" })
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar>
        {/* <Sidebar routePath="new-user" {...props} /> */}
        <InnerSidebar
          landingRoutes={landingRoutes}
          routePath="new-user"
          setLoading={setLoading}
          {...props}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} key={loadKey}>
          <DrawerHeader {...passProps} />
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
       {loading && (
         <>
           <Backdrop
             sx={{
               color: "#fff",
               zIndex: (theme) => theme.zIndex.drawer + 1
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
          open={verifyEmail==="0" && localStorage.getItem('verified')==='0'}
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
            <div className="first-model-block" style={{textAlign: "center"}}>
            It seems your account is not verified, please Verify! 
              </div>
              <Box sx={{textAlign:'center', paddingTop: "15px"}}>

              <Button
              className="use_btn"
              variant="contained"
              type="button"
              sx={{
                backgroundColor: '#00434f',
                ":hover": {
                  backgroundColor: '#00434f'
                }
              }}
              onClick={()=>{
                alertContext.showLoading(true);
                verifyEmailServer((res)=>{
                  serVerifyEmail(1);
                  if(res.status==="True") {
                    alertContext.showAlert({ type: "success", message: res.message });
                  } else {
                    alertContext.showAlert({ type: "error", message: res.message });
                  }
                })
              }}
              >Verify Email</Button>
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
     </Fragment>
   );
}
