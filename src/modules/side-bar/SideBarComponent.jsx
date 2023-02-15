import React, { Fragment, useContext, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import dashSelect from "../../assets/images/sidebar/home.svg";
import dash from "../../assets/images/sidebar/home (1).svg";
import { Link } from "react-router-dom";
import message from "../../assets/images/sidebar/message-circle (1).svg";
import messageSelect from "../../assets/images/sidebar/message-circle (1) (1).svg";

import message2 from "../../assets/images/sidebar/message2.svg";
import message2Select from "../../assets/images/sidebar/email.png";

import product from "../../assets/images/sidebar/dots.svg";
import productSelect from "../../assets/images/sidebar/dots.svg";

import setting from "../../assets/images/sidebar/settings.svg";
import settingSelect from "../../assets/images/sidebar/settings.svg";

import search from "../../assets/images/sidebar/search.svg";
import searchSelect from "../../assets/images/sidebar/search.svg";

import notification from "../../assets/images/sidebar/bell.svg";
import notificationSelect from "../../assets/images/sidebar/bell.svg";

import chat from "../../assets/images/userdash/message-square (1).svg";
import chatSelect from "../../assets/images/userdash/message-square.svg";

import layout from "../../assets/images/userdash/layout.svg";
import layoutSelect from "../../assets/images/userdash/layout1.svg";

import analytics from "../../assets/images/userdash/trending-up.svg";
import analyticsSelect from "../../assets/images/userdash/trending-up1.svg";

import user from "../../assets/images/userdash/user.svg";
import userSelect from "../../assets/images/userdash/user1.svg";

import knowledgeSelect from "../../assets/images/userdash/book-open1.svg";
import helpIcon from "../../assets/images/sidebar/help-circle.svg";
import helpSelect from "../../assets/images/sidebar/help-circle selected.svg";
import { useHistory } from "react-router-dom";
import { Menu, MenuItem, Stack, Switch } from "@mui/material";

import agent from "../../assets/images/sidebar/check-circle.svg";
import refer from "../../assets/images/sidebar/user-plus.svg";
// import help from "../../assets/images/sidebar/1234567890";
import feedback from "../../assets/images/sidebar/thumbs-up (2).svg";
import lang from "../../assets/images/sidebar/Path 48633.svg";
import feature from "../../assets/images/sidebar/cast.svg";
import editProfile from "../../assets/images/sidebar/edit.svg";
import support from "../../assets/images/sidebar/headphones (2).svg";
import signout from "../../assets/images/sidebar/log-out (1).svg";
import homeProuduct from "../../assets/images/sidebar/home.svg";
import check from "../../assets/images/green_check.svg";
import { Dropdown } from "react-bootstrap";
import img1 from "../../assets/images/userdash/plus-circle (1).svg";
import img2 from "../../assets/images/userdash/layout (5).svg";
import img3 from "../../assets/images/userdash/log-in.svg";
import { AlertContext } from "../common/Alert";

import { userLogout } from "../users/login/server/LoginServer";
let timeoutLogoutLoading;
const drawerWidth = 184;
// const drawerWidth = 300;

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
  width: `calc(${theme.spacing(6)} + 1px)`,

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 3px)`
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

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)"
    }
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff"
      }
    }
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200
    })
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box"
  }
}));

export default function Sidebar(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState("dashboard");
  const [activeHeader, setActiveHeader] = React.useState("dashboard");
  const history = useHistory();
  const alertContext = useContext(AlertContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [productanchorEl, setProductAnchorEl] = React.useState(null);
  const modelOpen = Boolean(anchorEl);
  const productmodelOpen = Boolean(productanchorEl);

  useEffect(()=>{
    return ()=>{
      clearTimeout(timeoutLogoutLoading);
    }
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProductClick = (event) => {
    setProductAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };

  const handleProductClose = () => {
    setProductAnchorEl(null);
  };
  const OnSubmit = () => {
    // 5 second timeout
    timeoutLogoutLoading = setTimeout(()=>{
      alertContext.showAlert({ type: "success", message: "Logout Timeout!" });
    },5000)
    alertContext.showLoading();
    userLogout(null, history, handleClose);

  };
  return (
    <Fragment>
      <section className="sidebar-section">
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
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="header-title"
            >
              {activeHeader}
            </Typography>
            {props.routePath === "new-user" ? (
              <Dropdown
                align="end"
                drop="bottom-start"
                className="chat_dropdown"
              >
                <Dropdown.Toggle alignRight id="dropdown-basic">
                  Create Chat Interface
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to="/user/create-form-scratch">
                      <img src={img1} />
                      <div>
                        <p className="scratch_title">Create from scratch</p>
                        <p className="scratch_text">
                          {/* Duis aute irure dolor in reprehenderit int */}
                        </p>
                      </div>
                    </Link>
                  </Dropdown.Item>

                  <Dropdown.Item href="#/action-2">
                    <Link to="/user/create-form-scratch">
                      <img src={img2} alt=""/>
                      <div>
                        <p className="scratch_title">Use Template</p>
                        <p className="scratch_text">
                          {/* Duis aute irure dolor in reprehenderit int */}
                        </p>
                      </div>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    <Link to="/user/create-form-scratch">
                      <img src={img3} alt=""/>
                      <div>
                        <p className="scratch_title">Import Chat Interface</p>
                        <p className="scratch_text">
                          {/* Duis aute irure dolor in reprehenderit int */}
                        </p>
                      </div>
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </Toolbar>
        </AppBar>
        <Drawer className="dash_sidebar" variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          {/* <Divider /> */}
          <div className="sidebar-text">
            {props.routePath === "agent" ? (
              <Fragment>
                <div className="block">
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("dashboard");
                        setActiveHeader("dashboard");
                        setTimeout(() => {
                          history.push("/agent/dashboard");
                        }, 100);
                      }}
                      className={active === "dashboard" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "dashboard" ? (
                          <img src={dashSelect} className="icon" alt="" />
                        ) : (
                          <img src={dash} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Dashboard"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("live");
                        setActiveHeader("live conversations");
                        setTimeout(() => {
                          history.push("/agent/live-conversation");
                        }, 100);
                      }}
                      className={active === "live" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "live" ? (
                          <img src={messageSelect} className="icon" alt="" />
                        ) : (
                          <img src={message} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Live conversations"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("offline");
                        setActiveHeader("offline messages");
                        setTimeout(() => {
                          history.push("/agent/offline-messages");
                        }, 100);
                      }}
                      className={active === "offline" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "offline" ? (
                          <img src={message2Select} className="icon" alt="" />
                        ) : (
                          <img src={message2} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Offline messages"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                </div>
              </Fragment>
            ) : props.routePath === "new-user" ? (
              <Fragment>
                <div className="block">
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("dashboard");
                        setActiveHeader("dashboard");
                        setTimeout(() => {
                          history.push("/user/dashboard");
                        }, 100);
                      }}
                      className={active === "dashboard" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "dashboard" ? (
                          <img src={dashSelect} className="icon" alt="" />
                        ) : (
                          <img src={dash} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Dashboard"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("Chatbots");
                        setActiveHeader("Chat Interfaces");
                        setTimeout(() => {
                          history.push("/user/chatbots");
                        }, 100);
                      }}
                      className={active === "Chatbots" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "Chatbots" ? (
                          <img src={chatSelect} className="icon" alt="" />
                        ) : (
                          <img src={chat} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Chat Interfaces"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("Templates");
                        setActiveHeader("Templates");
                        setTimeout(() => {
                          history.push("/user/templates");
                        }, 100);
                      }}
                      className={active === "Templates" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "Templates" ? (
                          <img src={layoutSelect} className="icon" alt="" />
                        ) : (
                          <img src={layout} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Templates"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("Analytics");
                        setActiveHeader("Analytics");
                        setTimeout(() => {
                          history.push("/user/analytics");
                        }, 100);
                      }}
                      className={active === "Analytics" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "Analytics" ? (
                          <img src={analyticsSelect} className="icon" alt="" />
                        ) : (
                          <img src={analytics} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Analytics"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("User");
                        setActiveHeader("User");
                        setTimeout(() => {
                          history.push("/user/users");
                        }, 100);
                      }}
                      className={active === "User" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "User" ? (
                          <img src={userSelect} className="icon" alt="" />
                        ) : (
                          <img src={user} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="User"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5
                      }}
                      onClick={() => {
                        setActive("Knowledge");
                        setActiveHeader("Knowledge Base");
                        setTimeout(() => {
                          history.push("/user/knowledge-base");
                        }, 100);
                      }}
                      className={active === "Knowledge" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center"
                        }}
                      >
                        {active === "Knowledge" ? (
                          <img src={knowledgeSelect} className="icon" alt="" />
                        ) : (
                          <img src={message} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Knowledge Base"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                </div>
              </Fragment>
            ) : null}

            <div className="block">
              <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                  onClick={(e) => {
                    setActive("product");
                    setActiveHeader("");
                    handleProductClick(e);
                  }}
                  id="product-button"
                  aria-controls={productmodelOpen ? "product-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={productmodelOpen ? "true" : undefined}
                  className={active === "product" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {active === "product" ? (
                      <img src={productSelect} className="icon" alt="" />
                    ) : (
                      <img src={product} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Products"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>

              <Divider />
              <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                  onClick={() => {
                    setActive("userdashboard");
                    setActiveHeader("Dashbaord");
                    setTimeout(() => {
                      history.push("/user/settings");
                    }, 100);
                  }}
                  className={active === "settings" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {active === "settings" ? (
                      <img src={settingSelect} className="icon" alt="" />
                    ) : (
                      <img src={setting} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
              {/* <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => {
                    setActive("search");
                    setActiveHeader("search");
                  }}
                  className={active === "search" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {active === "search" ? (
                      <img src={searchSelect} className="icon" alt="" />
                    ) : (
                      <img src={search} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Search"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List> */}
              <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                  onClick={() => {
                    setActive("Active Call");
                    setActiveHeader("Active Call");
                  }}
                  className={active === "search" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {active === "Active Call" ? (
                      <img src={searchSelect} className="icon" alt="" />
                    ) : (
                      <img src={search} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Active Call"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
              <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                  onClick={() => {
                    setActive("notification");
                    setActiveHeader("notification");
                  }}
                  className={active === "notification" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {active === "notification" ? (
                      <img src={notificationSelect} className="icon" alt="" />
                    ) : (
                      <img src={notification} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Notification"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </List>
              <List>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                  onClick={() => {
                    setActive("help");
                    setActiveHeader("help");
                  }}
                  className={active === "help" ? "active" : null}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {active === "help" ? (
                      <img src={helpSelect} className="icon" alt="" />
                    ) : (
                      <img src={helpIcon} className="icon" alt="" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Help" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </List>
              <Divider />
              <List className="user-block">
                <ListItemButton
                  onClick={handleClick}
                  id="basic-button"
                  aria-controls={modelOpen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={modelOpen ? "true" : undefined}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {localStorage.getItem("profile_picture") !== undefined ? (
                      <img
                        src={localStorage.getItem("profile_picture")}
                        className="icon"
                        alt=""
                      />
                    ) : (
                      <span className="user-icon">H</span>
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={localStorage.getItem("name")}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                <Menu
                  id="basic-menu"
                  className="user-model-block"
                  anchorEl={anchorEl}
                  open={modelOpen}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "right",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "right",
                    horizontal: "right"
                  }}
                  MenuListProps={{
                    "aria-labelledby": "basic-button"
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={agent} alt="" />
                        </span>
                        <span className="text">Agent status</span>
                      </div>
                      <div className="side-text">
                        <span>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AntSwitch
                              defaultChecked
                              inputProps={{ "aria-label": "ant design" }}
                            />
                          </Stack>
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={refer} alt="" />
                        </span>
                        <span className="text">Refer a Friend</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src="#" alt="" />
                        </span>
                        <span className="text">Subscription</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={feedback} alt="" />
                        </span>
                        <span className="text">Feedback</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={lang} alt="" />
                        </span>
                        <span className="text">Language</span>
                      </div>
                      <div className="side-text">
                        <span>(English)</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={feature} alt="" />
                        </span>
                        <span className="text">New Features</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/agent/edit-profile">
                      <div className="block">
                        <div>
                          <span>
                            <img src={editProfile} alt="" />
                          </span>
                          <span className="text">Edit Profile</span>
                        </div>
                        <div className="side-text">
                          <span></span>
                        </div>
                      </div>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div className="block">
                      <div>
                        <span>
                          <img src={support} alt="" />
                        </span>
                        <span className="text">Support</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      OnSubmit();
                      handleClose();
                    }}
                  >
                    <div className="block">
                      <div>
                        <span>
                          <img src={signout} alt="" />
                        </span>
                        <span className="text">SignOut</span>
                      </div>
                      <div className="side-text">
                        <span></span>
                      </div>
                    </div>
                  </MenuItem>
                </Menu>

                <Menu
                  id="product-menu"
                  className="user-model-block product-model-block"
                  anchorEl={productanchorEl}
                  open={productmodelOpen}
                  onClose={handleProductClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "bottom"
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "bottom"
                  }}
                  MenuListProps={{
                    "aria-labelledby": "product-button"
                  }}
                >
                  <div>
                    <p className="title">Switch Platforms</p>
                    {/* <MenuItem onClick={handleProductClose}>
                      <div className="block product-block">
                        <div className="home-block">
                          <span className="check-icon">
                            <img src={check} alt="" />
                          </span>
                          <div>
                            <span className="home-icon">
                              <img src={homeProuduct} alt="" />
                            </span>
                            <span className="home-text">Home</span>
                          </div>
                        </div>
                      </div>
                    </MenuItem> */}
                    <Divider />
                    <MenuItem onClick={handleProductClose}>
                      <Link to="/agent/dashboard">
                        <div className="block product-block">
                          <div>
                            <span className="check-icon">
                              <img src={check} alt="" />
                            </span>
                            <div>
                              <span className="text">Raibu</span>
                              <span className="text-sub">
                              Agent Dashboard
                              </span>
                            </div>
                          </div>
                          <span className="arrow-icon">
                            <ChevronRightIcon />
                          </span>
                        </div>
                      </Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleProductClose}>
                      <Link to="/user/dashboard">
                        <div className="block product-block">
                          <div>
                            <span className="check-icon">
                              <img src={check} alt="" />
                            </span>
                            <div>
                              <span className="text">Kaiwa</span>
                              <span className="text-sub">
                              Conversational Marketing Platform
                              </span>
                            </div>
                          </div>
                          <span className="arrow-icon">
                            <ChevronRightIcon />
                          </span>
                        </div>
                      </Link>
                    </MenuItem>
                  </div>
                </Menu>
              </List>
            </div>
          </div>
        </Drawer>
      </section>
    </Fragment>
  );
}
