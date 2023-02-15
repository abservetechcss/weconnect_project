import React, { Fragment, useEffect, useState, useContext } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import crossX from "../../assets/images/x.svg";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import { MdOutlineAddCircleOutline } from "react-icons/md";

import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import FormGroup from "@mui/material/FormGroup";
import { useHistory, Link, useLocation } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import dashSelect from "../../assets/images/sidebar/home.svg";
import GrTest from "../../assets/images/sidebar/test.svg";
import dash from "../../assets/images/sidebar/home (1).svg";
import message from "../../assets/images/sidebar/message-circle (1).svg";
import messageSelect from "../../assets/images/sidebar/message-circle (1) (1).svg";
import video from "../../assets/images/video (2).svg";
import messageIcon from "../../assets/images/message-square (1).svg";
// import shield from "../../assets/images/shield (1).svg";
import zap from "../../assets/images/zap.svg";
import search1 from "../../assets/images/search.svg";
import search2 from "../../assets/images/search (1).svg";
import { FiCreditCard } from "react-icons/fi";

import message2 from "../../assets/images/sidebar/message2.svg";
import message2Select from "../../assets/images/sidebar/email.png";

import product from "../../assets/images/sidebar/dots.svg";
import productSelect from "../../assets/images/sidebar/dots.svg";

import setting from "../../assets/images/sidebar/settings.svg";
import settingSelect from "../../assets/images/sidebar/settings.svg";

import call from "../../assets/images/sidebar/video (2).svg";
import selectcall from "../../assets/images/sidebar/video (21).svg";

import notificationSideIcon from "../../assets/images/sidebar/bell.svg";
import notificationSelect from "../../assets/images/sidebar/bell selected.svg";

import chat from "../../assets/images/userdash/message-square (1).svg";
import chatSelect from "../../assets/images/userdash/message-square.svg";

import layout from "../../assets/images/userdash/layout.svg";
import layoutSelect from "../../assets/images/userdash/layout1.svg";

import helpLayout from "../../assets/images/userdash/layout (5).svg";

import analytics from "../../assets/images/userdash/trending-up.svg";
import analyticsSelect from "../../assets/images/userdash/trending-up1.svg";

import user from "../../assets/images/userdash/user.svg";
import userSelect from "../../assets/images/userdash/user1.svg";

import knowledge from "../../assets/images/sidebar/book-open.svg";
import knowledgeSelect from "../../assets/images/userdash/book-open1.svg";
import copyIcon from "../../assets/images/userdash/copy-1.svg";
import helpIcon from "../../assets/images/sidebar/help-circle.svg";
import helpSelect from "../../assets/images/sidebar/help-circle selected.svg";
import published from "../../assets/images/Group 20402.png";
import { languageFlagList } from "../../variables/appVariables.jsx";
import { encryptBot, decryptBot, encryptBase64 } from "../../js/encrypt";
import ReactCountryFlag from "react-country-flag";
import moment from "moment";
import { MittContext } from "../common/WebSocketComponent";
import arrowright from "../../assets/images/userdash/Path 48371.png";
import cal1 from "../../assets/images/userdash/calendar.svg";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import {
  createAndUpdateArticle,
  listArticle,
} from "../new-users/knowledge-base/server/knowledgebaseServer";

import {
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  DialogContentText,
  Button,
  DialogTitle,
  DialogActions,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExternalLink } from "react-icons/hi";
import agent from "../../assets/images/sidebar/check-circle.svg";
import refer from "../../assets/images/sidebar/user-plus.svg";
// import help from "../../assets/images/sidebar/1234567890";
import feedback from "../../assets/images/sidebar/thumbs-up (2).svg";
import lang from "../../assets/images/sidebar/Path 48633.svg";
import feature from "../../assets/images/sidebar/cast.svg";
import editProfile from "../../assets/images/sidebar/edit.svg";
import support from "../../assets/images/sidebar/headphones (2).svg";
import signout from "../../assets/images/sidebar/log-out (1).svg";
// import homeProuduct from "../../assets/images/sidebar/home.svg";
import check from "../../assets/images/green_check.svg";
import { Dropdown, Badge } from "react-bootstrap";
import img2 from "../../assets/images/userdash/layout (5).svg";
import industry1 from "../../assets/images/industry.svg";
import layer from "../../assets/images/Icon material-layers.svg";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { GrTemplate } from "react-icons/gr";
import { BiImport } from "react-icons/bi";
import logo from "../../assets/images/logo.png";
import downArrow from "../../assets/images/down-arrow.svg";
import downArrowShort from "../../assets/images/userdash/chevron-left (1).svg";
import previewIcon from "../../assets/images/external-link (1).svg";
import { userLogout } from "../users/login/server/LoginServer";
import { AlertContext } from "../common/Alert";
import AddEditCategoryPageComponent from "../new-users/templates/components/categories/AddEditCategoryPageComponent.jsx";
import AddEditIndustryPageComponent from "../new-users/templates/components/Industry/AddEditIndustryPageComponent.jsx";
import AddEditTemplatePageComponent from "../new-users/templates/components/templateManager/AddEditTemplatePageComponent.jsx";
import arrow from "../../assets/images/userdash/chevron-left (1).svg";

import {
  getActiveCalls,
  getServerAgentStatus,
  setServerAgentStatus,
  getDeskopSettings,
  importBot,
  getUserLoginStatus,
  getServerNotifications,
  setServerTestMode,
  getServerTestMode,
  getNewFeatures,
} from "../users/edit-profile/server/EditProfileServer.js";
import {
  setAgentStatus,
  setActiveCalls,
  setSettings,
  setTestMode,
  setActiveRaibuNotify,
  setLeadsTestMode,
  setActiveNotify,
  setNewFeatures,
  setKnowledgeArticle,
} from "../../redux/actions/ReduxActionPage.jsx";
let timeoutLogoutLoading;

const drawerWidth = 184;
// const drawerWidth = 300;
const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

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
  // width: `calc(${theme.spacing(6)} + 1px)`,

  [theme.breakpoints.up("sm")]: {
    // width: `calc(${theme.spacing(8)} + 3px)`,
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

export default function InnerSidebar(props) {
  const theme = useTheme();
  const [active, setActive] = useState("dashboard");
  const [subActive, setSubActive] = useState("overview");
  const [activeHeader, setActiveHeader] = useState("dashboard");
  const history = useHistory();
  const dispatch = useDispatch();
  const alertContext = useContext(AlertContext);
  const emitterContext = useContext(MittContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [productanchorEl, setProductAnchorEl] = useState(null);
  const modelOpen = Boolean(anchorEl);
  const productmodelOpen = Boolean(productanchorEl);
  const [open, setOpen] = useState(false);
  const [botIdURL, setBotIdURL] = useState(null);
  const [botId, setBotId] = useState(null);
  const [widgetScript, setWidgetScript] = useState(null);
  const [landingScript, setLandingScript] = useState(null);
  const [embedScript, setEmbedScript] = useState(null);
  const [activecall, setActivecallAnchorEl] = useState(null);
  const activecallOpen = Boolean(activecall);
  // const [select_language, setSelect_language] = React.useState("English");
  const [select_language, setSelect_language] = React.useState("null");

  const activeBotList = useSelector(
    (state) => state.getSelectBotIdDetails.selectBotList
  );
  const [selectBotList, setSelectBotList] = useState({});
  const [language, setLanguage] = useState(false);
  const [selectlanguage, setSelectLanguage] = useState("");
  const [notification, setNotificationAnchorEl] = useState(null);
  const notificationmodelOpen = Boolean(notification);

  const [help, setHelpAnchorEl] = useState(null);
  const helpmodelOpen = Boolean(help);

  const [searchopen, setSearchOpen] = useState(false);
  const [copyAnchorEl, setCopyAnchorEl] = useState(null);

  const copyOpen = Boolean(copyAnchorEl);

  const [knowledgeCancel, setKnowledgeCancel] = useState(false);

  const [knowledgePublish, setKnowledgePublish] = useState(false);
  const [knowledgeDrafted, setKnowledgeDrafted] = useState(false);

  const [headerLanguage, setHeaderLanguage] = useState(false);

  const [selecting_language, setSelecting_language] = useState("");
  const [notFound, setNotFound] = useState({
    notification: "",
    activecell: "",
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [selectedFeature, setselectedFeature] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [openFeature, setOpenFeature] = useState(false);
  // const userInfo = useSelector((state) => state.getUserProfile.userData);
  const agentStatus = useSelector((state) => state.getUserProfile.agentStatus);
  const testMode = useSelector((state) => state.getUserProfile.testMode);
  const activeCalls = useSelector((state) => state.getUserProfile.activeCall);
  const notifications = useSelector((state) => state.getUserProfile.notify);
  const features = useSelector((state) => state.getUserProfile.features);
  const leadsMode = useSelector((state) => state.modes.leads);
  const articleForm = useSelector((state) => state.knowledgeBase.articleForm);
  const categoryForm = useSelector((state) => state.knowledgeBase.categoryForm);

  useEffect(() => {
    emitterContext.emitter.emit("pingActive", activeCalls);
  }, [activeCalls]);

  useEffect(() => {
    emitterContext.emitter.emit("pingNotify", notifications);
    setNotificationsList(GroupBy(notifications, "type"));
  }, [notifications]);

  const clearCallNotification = () => {
    dispatch(setActiveCalls([]));
  };

  const clearMsgNotification = () => {
    dispatch(setActiveNotify([]));
  };

  const getCallNotification = () => {
    getActiveCalls(
      (res) => {
        if (res.status === "True") {
          dispatch(setActiveCalls(res.activechatlist));
        } else {
          dispatch(setActiveCalls([]));
        }
        // console.log(res);
      },
      (err) => {}
    );
  };
  const getNotifications = () => {
    getServerNotifications(
      (res) => {
        if (res.status === "True") {
          let Notification = [];
          setNotificationsList(GroupBy(res.notificationlist, "type"));
          // debugger;
          if (res.notificationlist) {
            const currentAgentId = parseInt(localStorage.getItem("id"));
            Notification = res.notificationlist
              .filter((item) => {
                if (
                  item.agent_id_reject &&
                  item.agent_id_reject
                    .split(",")
                    .includes(currentAgentId.toString())
                )
                  return false;
                return true;
              })
              .map((item) => {
                if (item.type === "active_chat") {
                  item.message = "Chat Initiated";
                  item.accept = "assign_to_me";
                  item.status = "assign_to_me";
                } else {
                  item.accept = "ongoing";
                  item.status = "to_accept";
                  if (item.type === "video_chat") {
                    item.message = "VideoChat Initiated";
                  } else if (item.type === "live_chat") {
                    item.message = "LiveChat Initiated";
                  }
                }
                return item;
              });
          } else {
            setNotFound({
              notification: res.message,
            });
          }
          // dispatch(setActiveRaibuNotify(Notification));
          dispatch(setActiveNotify(Notification));
        } else {
          // dispatch(setActiveRaibuNotify([]));
          dispatch(setActiveNotify([]));
        }
        // console.log(res);
      },
      (err) => {}
    );
  };

  const fetchKnowledgeArticle = (categoryId) => {
    const params = "?category_id=" + categoryId;
    listArticle(
      params,
      (res) => {
        if (res.status === "True") {
          dispatch(setKnowledgeArticle(res.articlelist));
        } else {
          dispatch(setKnowledgeArticle([]));
        }
      },
      (err) => {}
    );
  };

  const knowledgeArticleCreate = (e) => {
    if (!(articleForm.category_id > 0)) {
      alertContext.showAlert({
        type: "error",
        message: "Category is required",
      });
      return;
    }
    console.log("articleForm", articleForm);
    if (articleForm.title.trim() === "") {
      alertContext.showAlert({ type: "error", message: "Title is required" });
      return;
    }
   
    if (!articleForm.tags.length) {
        alertContext.showAlert({ type: "error", message: "Tags is required" });
        return;
      }
      if(!articleForm.messageText.length && !articleForm.slug.length){
        alertContext.showAlert({ type: "error", message: "Decription or url is required " });
        return
      }
      
    let tags = "";
    if (Array.isArray(articleForm.tags)) {
      tags = articleForm.tags.join(",");
    }
    alertContext.showLoading(true);
    
    const sendData = {
      type: articleForm.type,
      slug: articleForm.slug,
      subtype: articleForm.subtype,
      newtab:articleForm.newtab ? 1 : 0, 
      category_id: articleForm.category_id,
      title: articleForm.title,
      tags: tags,
      articlestatus: e, //Draft
      description: articleForm.messageText
        ? articleForm.messageText
        : articleForm.description,
    };
    if (articleForm.id) sendData.id = articleForm.id;
    createAndUpdateArticle(
      sendData,
      (res) => {
        // setKnowledgePublish(true);
        if (res.status === "True") {
          alertContext.showAlert({ type: "success", message: res.message });
          fetchKnowledgeArticle(sendData.category_id);
          history.push(`/user/knowledge-base`);
        } else {
          alertContext.showAlert({ type: "error", message: res.message });
        }
      },
      (err) => {
        alertContext.showAlert({ type: "error", message: err.message });
      }
    );
  };

  const navigateToConversation = (clientId) => {
    emitterContext.emitter.emit("activeVisitor", clientId);
    setActivecallAnchorEl(null);
  };

  const navigateToConversationNotify = (clientId) => {
    emitterContext.emitter.emit("activeVisitor", clientId);
    setNotificationAnchorEl(null);
  };

  const getEncryptedKey = (client_id, client_type) => {
    const encData = encryptBase64(client_id);
    if (client_type?.toLowerCase() == "offlinemessage") {
      return `/agent/offline-messages?id=${encData}`;
    } else {
      return `/agent/live-conversation?id=${encData}`;
    }
  };

  const getAgentStatus = () => {
    getServerAgentStatus(
      (res) => {
        dispatch(setAgentStatus(res.Message === "online" ? true : false));
      },
      (err) => {}
    );
  };

  const getTestMode = (botId) => {
    const params = "?bot_id=" + botId;
    getServerTestMode(
      params,
      (res) => {
        dispatch(setTestMode(res.modetype));
      },
      (err) => {}
    );
  };

  const changeTestMode = () => {
    const value = testMode === "live" ? "test" : "live";
    alertContext.showLoading(true);
    const data = {
      modetype: value,
      bot_id: botId,
    };
    setServerTestMode(
      data,
      (res) => {
        if (res.Message)
          alertContext.showAlert({ type: "success", message: res.Message });
        else alertContext.showLoading(false);
        dispatch(setTestMode(value));
        emitterContext.emitter.emit("applayoutForceUpdate");
      },
      (err) => {
        alertContext.showAlert({
          type: "error",
          message: err.message || "test Mode update Failed!",
        });
      }
    );
  };

  const changeLeadsTestMode = () => {
    const value = leadsMode === "live" ? "test" : "live";
    dispatch(setLeadsTestMode(value));
  };

  const setDesktopSettings = () => {
    getDeskopSettings(
      (res) => {
        dispatch(setSettings(res));
      },
      (err) => {}
    );
  };

  const hanldeImportBot = (e) => {
    if (e.target.files && e.target.files[0]) {
      var formData = new FormData();
      formData.append("file", e.target.files[0]);
      e.target.value = "";
      alertContext.showLoading(true);
      importBot(
        formData,
        (res) => {
          const encData = encryptBot(res.bot_id, res.bot_name);
          alertContext.showAlert({ type: "success", message: res.message });
          history.push(`/user/chatbots/builder?botId=${encData}`);
        },
        (err) => {
          alertContext.showAlert({
            type: "error",
            message: err.message || "Import Bot Failed",
          });
        }
      );
    }
  };

  const changeAgentStatus = (e) => {
    alertContext.showLoading(true);
    const checked = e.target.checked;
    setServerAgentStatus(
      checked,
      (res) => {
        alertContext.showAlert({ type: "success", message: res.Message });
        dispatch(setAgentStatus(checked));
      },
      (err) => {
        alertContext.showAlert({
          type: "error",
          message: err.message || "Status update Failed!",
        });
      }
    );
  };

  const getFeatures = () => {
    getNewFeatures(
      (res) => {
        if (res.status === "True") {
          dispatch(setNewFeatures(res.list || []));
        }
      },
      (err) => {
        this.setState({
          loadingFeatures: false,
        });
      }
    );
  };

  useEffect(() => {
    getUserLoginStatus(history, (res) => {
      props.setLoading(false);
    });
    // getUserBasicInfoList(
    //   history,
    //   (res) => {
    //     let temp = res.basicaccount;
    //     dispatch(setUserProfile(res.basicaccount));
    //   },
    //   () => {}
    // );
    getCallNotification();
    getNotifications();
    getAgentStatus();
    getFeatures();
    emitterContext.emitter.on("changeDesktopSettings", () => {
      setDesktopSettings();
    });
    emitterContext.emitter.on("changebotUrl", (data) => {
      const encData = encryptBot(data.botId, data.botName);
      history.push(data.url + `?botId=${encData}`);
    });

    emitterContext.emitter.emit("changeDesktopSettings");
    return () => {
      clearTimeout(timeoutLogoutLoading);
      emitterContext.emitter.off("changeDesktopSettings");
      emitterContext.emitter.off("changebotUrl");
    };
  }, []);

  useEffect(() => {
    if (
      window.location.href.includes("?botId=") ||
      window.location.href.includes("/builder")
    ) {
      if (window.location.href.includes("?botId=")) {
        let data = window.location.href.split("?botId=")[1];
        var decryptedData = decryptBot(data);
        setLandingScript(
          process.env.REACT_APP_SCRIPT_BASE_URL +
            "landing?botId=" +
            window.btoa(decryptedData.botId)
        );
        setWidgetScript(
          '<script async>!function(e,a){var d=a.head||a.getElementsByTagName("head")[0],b=a.createElement("script");b.async=true,b.setAttribute("type","text/javascript"),b.setAttribute("src","' +
            process.env.REACT_APP_SCRIPT_BASE_URL +
            'webchat.WeConnect.js"),d.appendChild(b);b.onload=function(){WeConnect.render(null,{mode:"widget",botId:"' +
            window.btoa(decryptedData.botId) +
            '"})}}(window,document)</script>'
        );

        setEmbedScript(
          '<iframe style="border: none" width="1120px" height="600px" src="' +
            process.env.REACT_APP_SCRIPT_BASE_URL +
            "embed/?botId=" +
            window.btoa(decryptedData.botId) +
            '"></iframe>'
        );

        setSelectBotList(decryptedData);
        setBotIdURL(data);
        setBotId(decryptedData && decryptedData.botId);
        getTestMode(decryptedData && decryptedData.botId);
      }
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [window.location.href]);

  const handleHeaderLanguageOpen = () => {
    setHeaderLanguage(true);
  };

  const handleHeaderLanguageClose = () => {
    setHeaderLanguage(false);
  };

  const handleKnowledgeCancelOpen = () => {
    setKnowledgeCancel(true);
  };

  const handleKnowledgeCancelClose = () => {
    setKnowledgeCancel(false);
  };

  const handleCopyOpen = (event) => {
    setCopyAnchorEl(event.currentTarget);
  };
  const handleCopyClose = () => {
    setCopyAnchorEl(null);
  };

  const handleLanguageOpen = () => {
    setLanguage(true);
  };

  const handleLanguageClose = () => {
    setLanguage(false);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleClick = (event) => {
    getAgentStatus();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {};

  const handleProductClick = (event) => {
    setProductAnchorEl(event.currentTarget);
  };

  const handleActivecallClick = (event) => {
    setActivecallAnchorEl(event.currentTarget);
  };

  const handleActivecallClose = () => {
    setActivecallAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  const handleHelpClick = (event) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };
  const handleProductClose = () => {
    setProductAnchorEl(null);
  };
  const OnSubmit = () => {
    timeoutLogoutLoading = setTimeout(() => {
      alertContext.showAlert({ type: "success", message: "Logout Timeout!" });
    }, 5000);
    alertContext.showLoading();
    userLogout(null, history, handleClose);
  };
  const options = {
    filterType: "dropdown",
    print: false,
    download: false,
    filter: false,
    viewColumns: false,
    search: false,
    pagination: false,
    selectableRows: false,
    responsive: "scrollMaxHeight",
  };
  const data = [
    ["Manufacturing", , "true"],
    ["Insurance", "false"],
  ];

  const GroupBy = (data, ky) => {
    let res = {};
    data.map((item) => {
      if (!res[item[ky]]) {
        res[item[ky]] = [];
      }
      res[item[ky]].push(item);
    });
    return res;
  };

  const testModeComponent = (
    <label className="testModeToggle" htmlFor="test_mode_toggle">
      Test Data
      <div className="side-text">
        <span className="switch-btn-cust">
          <input
            type="checkbox"
            id="test_mode_toggle"
            checked={testMode === "test"}
            onChange={changeTestMode}
          />
          <label htmlFor="test_mode_toggle">Toggle</label>
        </span>
      </div>
    </label>
  );

  const testLeadsModeComponent = (
    <label className="testModeToggle" htmlFor="test_mode_toggle">
      Test Data
      <div className="side-text">
        <span className="switch-btn-cust">
          <input
            type="checkbox"
            id="test_mode_toggle"
            checked={leadsMode === "test"}
            onChange={changeLeadsTestMode}
          />
          <label htmlFor="test_mode_toggle">Toggle</label>
        </span>
      </div>
    </label>
  );

  return (
    <Fragment>
      <section className="sidebar-section inner-sidebar-section">
        <AppBar className="dash_nav" position="fixed" open={open}>
          <Toolbar>
            <Typography
              onClick={handleDrawerOpen}
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
              className="logo_weconnect"
            >
              <img src={logo} alt="" />
            </Typography>
            <div className="d-flex justify-content-between align-items-center w-100">
              <Typography
                variant="h6"
                noWrap
                component="div"
                className="header-title"
              >
                {props.landingRoutes &&
                  props.landingRoutes
                    .filter((x) => {
                      return x.path === props.location.pathname;
                    })
                    .map((prop) => {
                      return prop.name;
                    })}
              </Typography>
              {window.location.href.includes("user/settings") ? (
                <div style={{ color: "#333" }} className="setting_search_box">
                  <input type="text" placeholder="Search..." />
                  <img src={search2} alt="" />
                </div>
              ) : null}

              {props.routePath === "agent" &&
                window.location.href.includes("agent/leads") && (
                  <div className="overview_header_block">
                    {testLeadsModeComponent}{" "}
                  </div>
                )}
              {props.routePath === "new-user" ? (
                <div>
                  {window.location.href.includes("user/chatbots/overview") ||
                  window.location.href.includes("user/chatbots/appointment") ||
                  window.location.href.includes("user/analytics/") ? (
                    <div className="overview_header_block">
                      {/* <p>
                        <img src={link} />
                        Preview Bot
                      </p>
                      <Button className="share_btn">Share</Button> */}
                      {testModeComponent}
                    </div>
                  ) : window.location.href.includes("user/leads") ? (
                    <div className="overview_header_block">
                      {testLeadsModeComponent}{" "}
                    </div>
                  ) : window.location.href.includes(
                      "user/analytics/indicators"
                    ) ? (
                    <div className="overview_header_block indicator_header_block">
                      {/* <p className="agent_text">Agent Status</p>
                      <Form.Select
                        className="analytics_selector"
                        aria-label="Default select example"
                      >
                        <option>Online</option>
                        <option value="1">Offline</option>
                      </Form.Select> */}
                      {testModeComponent}
                    </div>
                  ) : window.location.href.includes("user/chatbots/builder") ? (
                    <div style={{ color: "#333" }}>
                      <div className="builder-header-block">
                        <FormControl
                          fullWidth
                          className="language_selector language_header_selector"
                        >
                          <Select
                            value={select_language}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            onChange={(e) => {
                              handleHeaderLanguageOpen();
                              setSelecting_language(e.target.value);
                            }}
                            id="language_header_selector_model"
                            MenuProps={MenuProps}
                          >
                            <MenuItem value="null" disabled>
                              <p>Select language</p>
                            </MenuItem>
                            {languageFlagList &&
                              languageFlagList.length > 0 &&
                              languageFlagList.map((prop, i) => {
                                return (
                                  <MenuItem key={i} value={prop.value}>
                                    <ReactCountryFlag
                                      countryCode={prop.countryCode}
                                      svg
                                      style={{ marginRight: "10px" }}
                                    />
                                    {/* {` ${prop.label}`} */}
                                    {/* {` ${prop.label.substring(0, 3)}`} */}
                                    {` ${prop.label}`}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>

                        <span className="vh"></span>
                        <a
                          target="_blank"
                          href={
                            process.env.REACT_APP_SCRIPT_BASE_URL +
                            "landing?botId=" +
                            window.btoa(botId)
                          }
                          className="preview-content-block"
                          rel="noreferrer"
                        >
                          <img src={previewIcon} alt="" />
                          <p>Preview Chat</p>
                        </a>
                        <Button
                          className="copy-btn"
                          variant="text"
                          id="basic-button"
                          aria-controls={copyOpen ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={copyOpen ? "true" : undefined}
                          onClick={handleCopyOpen}
                        >
                          Deploy
                          <img
                            src={downArrowShort}
                            alt=""
                            style={
                              copyOpen
                                ? { transform: "rotate(180deg)" }
                                : { transform: "rotate(0deg)" }
                            }
                          />
                        </Button>
                        {testModeComponent}
                      </div>
                    </div>
                  ) : window.location.href.includes("user/template-manager") ? (
                    <Dropdown
                      align="end"
                      drop="bottom-start"
                      className="chat_dropdown"
                    >
                      <Dropdown.Toggle alignRight id="dropdown-basic">
                        Create New Template
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Link
                            role="button"
                            to="#"
                            onClick={() => {
                              setShowTemplateModal(true);
                            }}
                          >
                            <img src={img2} alt="" />
                            <div>
                              <p className="scratch_title">
                                Create new Template
                              </p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </Link>
                        </Dropdown.Item>

                        <Dropdown.Item href="#/action-2">
                          <Link
                            role="button"
                            to="#"
                            onClick={() => {
                              setShowIndustryModal(true);
                            }}
                          >
                            <img src={industry1} alt="" />
                            <div>
                              <p className="scratch_title">
                                Create New Industry
                              </p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          <Link
                            role="button"
                            to="#"
                            onClick={() => {
                              setShowCategoryModal(true);
                            }}
                          >
                            <img src={layer} alt="" />
                            <div>
                              <p className="scratch_title">
                                Create New Category
                              </p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>

                      <Dialog
                        open={showTemplateModal}
                        onClose={() => {
                          setShowTemplateModal(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        scroll={"paper"}
                        className="expand-flow-chart-model-block new-template-modal-block"
                      >
                        <DialogTitle
                          id="alert-dialog-title"
                          className="knowledge_subheader"
                        >
                          <p>Create New Template</p>
                        </DialogTitle>
                        <AddEditTemplatePageComponent
                          showTemplateModal={showTemplateModal}
                          setShowTemplateModal={setShowTemplateModal}
                          {...props}
                        />
                      </Dialog>

                      <Dialog
                        open={showIndustryModal}
                        onClose={() => {
                          setShowIndustryModal(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        scroll={"paper"}
                        className="expand-flow-chart-model-block new-industry-modal-block"
                      >
                        <DialogTitle
                          id="alert-dialog-title"
                          className="knowledge_subheader"
                        >
                          <p>Create New Industry</p>
                        </DialogTitle>
                        <AddEditIndustryPageComponent
                          showIndustryModal={showIndustryModal}
                          setShowIndustryModal={setShowIndustryModal}
                          {...props}
                        />
                      </Dialog>

                      <Dialog
                        open={showCategoryModal}
                        onClose={() => {
                          setShowCategoryModal(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        scroll={"paper"}
                        className="expand-flow-chart-model-block new-industry-modal-block"
                      >
                        <DialogTitle
                          id="alert-dialog-title"
                          className="knowledge_subheader"
                        >
                          <p>Create New Category</p>
                        </DialogTitle>
                        <AddEditCategoryPageComponent
                          showCategoryModal={showCategoryModal}
                          setShowCategoryModal={setShowCategoryModal}
                          {...props}
                        />
                      </Dialog>
                    </Dropdown>
                  ) : window.location.href.includes(
                      "user/subscription"
                    ) ? null : window.location.href.includes(
                      "user/edit-profile"
                    ) ? null : window.location.href.includes(
                      "knowledge-base/new-article-creation"
                    ) ? (
                    <div className="builder-header-block">
                      {/* <a
                        target="_blank"
                        href={
                          process.env.REACT_APP_SCRIPT_BASE_URL +
                          "landing?botId=" +
                          window.btoa(botId)
                        }
                        className="preview-content-block preview-knowledge"
                        rel="noreferrer"
                      >
                        <img src={previewIcon} alt="" />
                        <p>Preview Chat</p>
                      </a> */}
                      <span className="vh"></span>
                      <p
                        className="cancel_text"
                        onClick={handleKnowledgeCancelOpen}
                      >
                        Cancel
                      </p>
                      {/* {testModeComponent} */}

                      {/* {knowledgeDrafted ? (
                        <>
                          <Button
                            className="published-btn"
                            variant="text"
                            onClick={() => {
                              setKnowledgeDrafted(false);
                            }}
                          >
                            <img src={published} alt="" />
                            Drafted
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="draft_btn"
                            variant="text"
                            onClick={() => {
                              setKnowledgeDrafted(true);
                              knowledgeArticleCreate("Draft");
                            }}
                          >
                            Make as draft
                          </Button>
                        </>
                      )} */}
                      {articleForm.status?.toLowerCase() == "published" &&
                      articleForm.showButton ? (
                        <>
                          <Button
                            className="draft_btn"
                            variant="text"
                            onClick={() => {
                              setKnowledgeDrafted(true);
                              knowledgeArticleCreate("Draft");
                            }}
                          >
                            Make as draft
                          </Button>
                          <Button
                            data-value={articleForm?.status}
                            className="published-btn"
                            variant="text"
                            // onClick={() => {
                            //   knowledgeArticleCreate("Published");
                            // }}
                          >
                            <img src={published} alt="" />
                            Published
                          </Button>
                        </>
                      ) : articleForm.status?.toLowerCase() == "draft" &&
                        articleForm.showButton ? (
                        <>
                          <Button
                            className="published-btn"
                            variant="text"
                            // onClick={() => {
                            //   setKnowledgeDrafted(false);
                            // }}
                          >
                            <img src={published} alt="" />
                            Drafted
                          </Button>
                          <Button
                            className="publish-btn"
                            variant="text"
                            onClick={() => {
                              knowledgeArticleCreate("Published");
                            }}
                          >
                            Publish
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="draft_btn"
                            variant="text"
                            onClick={() => {
                              setKnowledgeDrafted(true);
                              knowledgeArticleCreate("Draft");
                            }}
                          >
                            Make as draft
                          </Button>
                          <Button
                            className="publish-btn"
                            variant="text"
                            onClick={() => {
                              knowledgeArticleCreate("Published");
                            }}
                          >
                            Publish
                          </Button>
                        </>
                      )}
                    </div>
                  ) : window.location.href.includes(
                      "user/chatbots/appointment"
                    ) ||
                    window.location.href.includes("user/analytics") ||
                    window.location.href.includes("user/leads") ||
                    window.location.href.includes(
                      "user/knowledge-base"
                    ) ? null : window.location.href.includes(
                      "user/templates"
                    ) ? (
                    <div className="template_header_block">
                      {localStorage.getItem("id") == 1 ? (
                        <Button
                          variant="contained"
                          onClick={() => history.push("/user/template-manager")}
                          className="manager-btn"
                          rel="noreferrer"
                        >
                          Template Manager
                        </Button>
                      ) : null}

                      <Button
                        onClick={() =>
                          history.push("/user/create-form-scratch")
                        }
                        variant="contained"
                        className="create-scratch-btn"
                      >
                        Create from scratch
                      </Button>
                    </div>
                  ) : (
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
                            <MdOutlineAddCircleOutline />
                            <div>
                              <p className="scratch_title">
                                Create from scratch
                              </p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </Link>
                        </Dropdown.Item>

                        <Dropdown.Item href="#/action-2">
                          <Link to="/user/templates">
                            <GrTemplate />
                            <div>
                              <p className="scratch_title">Use Template</p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item as="label" htmlFor={"import-file-bot"}>
                          <input
                            accept="application/json"
                            id={"import-file-bot"}
                            style={{ display: "none" }}
                            // multiple
                            type="file"
                            onChange={hanldeImportBot}
                          />
                          <div>
                            <BiImport />
                            <div>
                              <p className="scratch_title">
                                Import Chat Interface
                              </p>
                              <p className="scratch_text">
                                {/* Duis aute irure dolor in reprehenderit int */}
                              </p>
                            </div>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              ) : null}
            </div>
          </Toolbar>
        </AppBar>
        <Drawer className="dash_sidebar" variant="permanent" open={open}>
          <DrawerHeader>
            <div className="logo_box">
              <img src={logo} alt="" />
            </div>
          </DrawerHeader>
          {/* <Divider /> */}
          <div className="sidebar-devider">
            <div
              className="sidebar-text"
              style={open ? { maxWidth: "184px" } : { maxWidth: "44px" }}
            >
              {props.routePath === "agent" ? (
                <Fragment>
                  <div className="block">
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/agent/dashboard"
                        // onClick={() => {
                        //   setOpen(false);
                        //   setTimeout(() => {
                        //     history.push("/agent/dashboard");
                        //   }, 100);
                        // }}
                        className={
                          window.location.href.includes("agent/dashboard")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("agent/dashboard") ? (
                            <img src={dashSelect} className="icon" alt="" />
                          ) : (
                            <img src={dash} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Dashboard"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/agent/live-conversation"
                        // onClick={() => {
                        //   // setOpen(false);
                        //   setTimeout(() => {
                        //     history.push("/agent/live-conversation");
                        //   }, 100);
                        // }}
                        className={
                          window.location.href.includes(
                            "agent/live-conversation"
                          )
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes(
                            "agent/live-conversation"
                          ) ? (
                            <img src={messageSelect} className="icon" alt="" />
                          ) : (
                            <img src={message} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Live conversations"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/agent/offline-messages"
                        // onClick={() => {
                        //   // setOpen(false);
                        //   setTimeout(() => {
                        //     history.push("/agent/offline-messages");
                        //   }, 100);
                        // }}
                        className={
                          window.location.href.includes(
                            "agent/offline-messages"
                          )
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes(
                            "agent/offline-messages"
                          ) ? (
                            <img src={message2Select} className="icon" alt="" />
                          ) : (
                            <img src={message2} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Offline messages"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/agent/leads"
                        className={
                          window.location.href.includes("/agent/leads")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("/agent/leads") ? (
                            <img src={userSelect} className="icon" alt="" />
                          ) : (
                            <img src={user} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Leads"
                          sx={{ display: open ? "" : "none" }}
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
                          px: 2.5,
                        }}
                        component={Link}
                        to="/user/dashboard"
                        className={
                          window.location.href.includes("user/dashboard2")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("agent/dashboard") ? (
                            <img src={dashSelect} className="icon" alt="" />
                          ) : (
                            <img src={dash} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Dashboard"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        className={
                          window.location.href.includes("user/chatbots") ||
                          window.location.href.includes("/user/chatbots/")
                            ? "active"
                            : null
                        }
                        component={Link}
                        to="/user/chatbots"
                        // onClick={() => {
                        //   setOpen(true);
                        //   setTimeout(() => {
                        //     history.push("/user/chatbots");
                        //   }, 100);
                        // }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("user/chatbots") ? (
                            <img src={chatSelect} className="icon" alt="" />
                          ) : (
                            <img src={chat} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Chat Interfaces"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/user/templates"
                        // onClick={() => {
                        //   setOpen(true);
                        //   setTimeout(() => {
                        //     history.push("/user/templates");
                        //   }, 100);
                        // }}
                        className={
                          window.location.href.includes("user/templates")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("user/templates") ? (
                            <img src={layoutSelect} className="icon" alt="" />
                          ) : (
                            <img src={layout} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Templates"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/user/analytics"
                        // onClick={() => {
                        //   setOpen(true);
                        //   setTimeout(() => {
                        //     history.push("/user/analytics");
                        //   }, 1000);
                        // }}
                        className={
                          window.location.href.includes("/user/analytics")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("/user/analytics") ? (
                            <img
                              src={analyticsSelect}
                              className="icon"
                              alt=""
                            />
                          ) : (
                            <img src={analytics} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Analytics"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/user/leads"
                        className={
                          window.location.href.includes("/user/leads")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes("/user/leads") ? (
                            <img src={userSelect} className="icon" alt="" />
                          ) : (
                            <img src={user} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Leads"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                    <List>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        component={Link}
                        to="/user/knowledge-base"
                        className={
                          window.location.href.includes("/user/knowledge-base")
                            ? "active"
                            : null
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {window.location.href.includes(
                            "/user/knowledge-base"
                          ) ? (
                            <img
                              src={knowledgeSelect}
                              className="icon"
                              alt=""
                            />
                          ) : (
                            <img src={knowledge} className="icon" alt="" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary="Knowledge Base"
                          sx={{ display: open ? "" : "none" }}
                        />
                      </ListItemButton>
                    </List>
                  </div>
                </Fragment>
              ) : null}

              <div className="block">
                {localStorage.getItem("admin_type") !== "agent" && (
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      onClick={(e) => {
                        // setOpen(true);
                        handleProductClick(e);
                      }}
                      id="product-button"
                      aria-controls={
                        productmodelOpen ? "product-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={productmodelOpen ? "true" : undefined}
                      className={active === "product" ? "active" : null}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
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
                        sx={{ display: open ? "" : "none" }}
                      />
                    </ListItemButton>
                  </List>
                )}

                <Divider />

                {/* {localStorage.getItem("admin_type") !== "agent" &&
                    <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        changeTestMode()
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
                          <img src={GrTest} className="icon" alt="" />
                      </ListItemIcon>
                      <ListItemText
                      primary={<>Test Mode <div className="side-text">
                      <span className="switch-btn-cust">
                        <input type="checkbox" id="switch_test_mode" checked={testMode==='test'} />
                        <label htmlFor="switch_test_mode">Toggle</label>
                      </span>
                    </div></>}                        
                        sx={{ 
                          "&>.MuiListItemText-primary": {
                            flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              display: "flex"
                          },
                          display: open ? "" : "none" }}
                      />
                    </ListItemButton>
                  </List>} */}
                {localStorage.getItem("admin_type") !== "agent" && (
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to="/user/settings"
                      className={
                        window.location.href.includes("/user/settings")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {window.location.href.includes("/user/settings") ? (
                          <img src={settingSelect} className="icon" alt="" />
                        ) : (
                          <img src={setting} className="icon" alt="" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Settings"
                        sx={{ display: open ? "" : "none" }}
                      />
                    </ListItemButton>
                  </List>
                )}
                <List>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    onClick={(e) => {
                      setActive("Active Call");
                      setActiveHeader("Active Call");
                      handleActivecallClick(e);
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
                      {active === "Active Call" ? (
                        <img src={selectcall} className="icon" alt="" />
                      ) : (
                        <img src={call} className="icon" alt="" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <>
                          Active Call{" "}
                          {activeCalls.length > 0 && (
                            <Badge pill bg="danger" text="light">
                              {activeCalls.length}
                            </Badge>
                          )}
                        </>
                      }
                      sx={{
                        "&>.MuiListItemText-primary": {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          display: "flex",
                        },
                        display: open ? "" : "none",
                      }}
                    />
                  </ListItemButton>
                </List>
                <List>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    onClick={(e) => {
                      setActive("notification");
                      setActiveHeader("notification");
                      handleNotificationClick(e);
                    }}
                    // className={active === "notification" ? "active" : null}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {active === "notification" ? (
                        <img src={notificationSelect} className="icon" alt="" />
                      ) : (
                        <img
                          src={notificationSideIcon}
                          className="icon"
                          alt=""
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <>
                          Notification{" "}
                          {notifications.length > 0 && (
                            <Badge pill bg="danger" text="light">
                              {notifications.length}
                            </Badge>
                          )}
                        </>
                      }
                      sx={{
                        "&>.MuiListItemText-primary": {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          display: "flex",
                        },
                        display: open ? "" : "none",
                      }}
                    />
                  </ListItemButton>
                </List>
                <List>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    // onClick={(e) => {
                    //   setActive("help");
                    //   setActiveHeader("help");
                    //   handleHelpClick(e);
                    // }}
                    component={"a"}
                    target="_blank"
                    href="https://weconnect.chat/help-center/"
                    className={active === "help" ? "active" : null}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {active === "help" ? (
                        <img src={helpSelect} className="icon" alt="" />
                      ) : (
                        <img src={helpIcon} className="icon" alt="" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Help"
                      sx={{ display: open ? "" : "none" }}
                    />
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
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {localStorage.getItem("picture") &&
                      localStorage.getItem("picture") !== "null" ? (
                        <img
                          src={localStorage.getItem("picture")}
                          className="icon"
                          style={{
                            borderRadius: "50px",
                            objectFit: "cover",
                            width: "15px",
                            height: "15px",
                            maxWidth: "unset",
                          }}
                          alt=""
                        />
                      ) : (
                        <span
                          className={
                            window.location.href.includes("/user/chatbots/") &&
                            window.location.href.includes("/user/analytics")
                              ? "user-icon"
                              : "user-icon user-icon-margin"
                          }
                        >
                          {localStorage.getItem("name") &&
                            localStorage
                              .getItem("name")
                              .charAt(0)
                              .toUpperCase()}
                        </span>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={localStorage.getItem("name")}
                      sx={{ display: open ? "" : "none" }}
                    />
                  </ListItemButton>
                  <Menu
                    id="basic-menu"
                    className="user-model-block"
                    anchorEl={anchorEl}
                    open={modelOpen}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem key="agent_status">
                      <div className="block">
                        <div>
                          <span>
                            <img src={agent} alt="" />
                          </span>
                          <span className="text">Agent status</span>
                        </div>
                        <div className="side-text">
                          <span className="switch-btn-cust">
                            <input
                              type="checkbox"
                              id="switch_agent_active"
                              checked={agentStatus}
                              onChange={changeAgentStatus}
                            />
                            <label htmlFor="switch_agent_active">Toggle</label>
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                    <MenuItem onClick={handleClose} key="refer_friend">
                      <Link to="/user/refer">
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
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose} key="subscription">
                      <Link to="/user/subscription">
                        <div className="block">
                          <div>
                            <span>
                              <FiCreditCard className="card_icon" />
                            </span>
                            <span className="text">Subscription</span>
                          </div>
                          <div className="side-text">
                            <span></span>
                          </div>
                        </div>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose} key="feedback">
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
                    <MenuItem onClick={handleLanguageOpen} key="language">
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
                    <MenuItem
                      onClick={() => {
                        setOpenFeature(true);
                        handleClose();
                      }}
                      key="new_features"
                    >
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
                    <MenuItem onClick={handleClose} key="edit_profile">
                      <Link
                        to={
                          props.routePath === "agent"
                            ? "/agent/edit-profile"
                            : "/user/edit-profile"
                        }
                      >
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
                    <MenuItem key="support">
                      <a
                        className="block"
                        href="https://app.weconnect.chat/chat/landing/?botId=NjYx"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div>
                          <span>
                            <img src={support} alt="" />
                          </span>
                          <span className="text">Support</span>
                        </div>
                        <div className="side-text">
                          <span></span>
                        </div>
                      </a>
                    </MenuItem>
                    <MenuItem
                      key="signout"
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
                    // anchorOrigin={{
                    //   vertical: "bottom",
                    //   horizontal: "bottom"
                    // }}
                    // transformOrigin={{
                    //   vertical: "bottom",
                    //   horizontal: "bottom"
                    // }}

                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    MenuListProps={{
                      "aria-labelledby": "product-button",
                    }}
                  >
                    <div>
                      <p className="title">Switch Platforms</p>
                      {/* <MenuItem onClick={handleProductClose} key="home">
                        <Link
                          role="button"
                          to={
                            localStorage.getItem("admin_type") === "agent"
                              ? "/agent/dashboard"
                              : "/user/dashboard"
                          }
                        >
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
                        </Link>
                      </MenuItem> */}
                      <Divider />
                      <MenuItem onClick={handleProductClose} key="raibu">
                        <Link role="button" to={"/agent/dashboard"}>
                          <div
                            // onClick={(e) => {
                            //   console.log(e.key);
                            // }}
                            className="block product-block"
                          >
                            <div>
                              <span
                                className="check-icon"
                                style={{
                                  opacity:
                                    window.location.pathname.substring(0, 7) ===
                                    "/agent/"
                                      ? 1
                                      : 0,
                                }}
                              >
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
                      <MenuItem onClick={handleProductClose} key="kaiwa">
                        <Link
                          role="button"
                          onClick={() => {
                            // setOpen(true);
                            // history.push("/user/dashboard");
                          }}
                          to="/user/dashboard"
                        >
                          <div className="block product-block">
                            <div>
                              <span
                                className="check-icon"
                                style={{
                                  opacity:
                                    window.location.pathname.substring(0, 7) !==
                                    "/agent/"
                                      ? 1
                                      : 0,
                                }}
                              >
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
            {window.location.href.includes("/user/chatbots/") ? (
              <div
                className="inner-sidebar-block"
                // style={open ? { display: "none" } : { display: "block" }}
              >
                <Link to="/user/chatbots">
                  <div className="back-block">
                    <p>
                      <ChevronLeftIcon />
                      Chat Interfaces
                    </p>
                  </div>
                </Link>
                <div className="inner-text">
                  <List>
                    <ListItemButton
                      role="button"
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/chatbots`}
                      className={active === "live" ? "active" : null}
                    >
                      <ListItemText
                        className="bot_name"
                        primary={selectBotList && selectBotList.botName}
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/chatbots/overview?botId=${botIdURL}`}
                      className={
                        window.location.href.includes("user/chatbots/overview")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Overview"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/chatbots/builder?botId=${botIdURL}`}
                      onClick={() => {
                        localStorage.setItem("builderMainMenu", 0);
                        localStorage.setItem("builderSubMenu", 0);
                        setOpen(false);
                        setTimeout(() => {
                          history.push(
                            `/user/chatbots/builder?botId=${botIdURL}`
                          );
                        }, 100);
                      }}
                      className={
                        window.location.href.includes("user/chatbots/builder")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Builder"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/chatbots/appointment?botId=${botIdURL}`}
                      onClick={() => {
                        setOpen(false);
                        setTimeout(() => {
                          history.push(
                            `/user/chatbots/appointment?botId=${botIdURL}`
                          );
                        }, 100);
                      }}
                      className={
                        window.location.href.includes(
                          "/user/chatbots/appointment"
                        )
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Appointment"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/indicators?botId=${botIdURL}`}
                      className={
                        window.location.href.includes("/user/analytics")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Analytics"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to="/user/dashboard"
                      className={
                        window.location.href.includes("/user/dashboard")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Agent Dashboard"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                </div>
              </div>
            ) : window.location.href.includes("/user/analytics/") ? (
              <div
                className="inner-sidebar-block"
                style={open ? { display: "none" } : { display: "block" }}
              >
                <Link
                  role="button"
                  to={`/user/chatbots/overview?botId=${botIdURL}`}
                >
                  <div className="back-block">
                    <p>
                      <ChevronLeftIcon />
                      Analytics
                    </p>
                  </div>
                </Link>
                <div className="inner-text">
                  <List>
                    <ListItemButton
                      role="button"
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to="/user/chatbots"
                      className={active === "live" ? "active" : null}
                    >
                      <ListItemText
                        className="bot_name"
                        primary={selectBotList && selectBotList.botName}
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/indicators?botId=${botIdURL}`}
                      className={
                        window.location.href.includes(
                          "user/analytics/indicators"
                        )
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Indicators"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>

                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/conversation?botId=${botIdURL}`}
                      className={
                        window.location.href.includes(
                          "/user/analytics/conversation"
                        )
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Conversations"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/insights?botId=${botIdURL}`}
                      className={
                        window.location.href.includes(
                          "/user/analytics/insights"
                        )
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Insights"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>

                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/funnel?botId=${botIdURL}`}
                      className={
                        window.location.href.includes("/user/analytics/funnel")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Funnel"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>

                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/leads?botId=${botIdURL}`}
                      className={
                        window.location.href.includes("/user/analytics/leads")
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Leads"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>

                  <List>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      component={Link}
                      to={`/user/analytics/agent-performance?botId=${botIdURL}`}
                      className={
                        window.location.href.includes(
                          "/user/analytics/agent-performance"
                        )
                          ? "active"
                          : null
                      }
                    >
                      <ListItemText
                        primary="Agent Performance"
                        sx={{ opacity: !open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </List>
                </div>
              </div>
            ) : null}
          </div>
        </Drawer>
      </section>

      {window.location.href.includes("?botId=") && (
        <Snackbar
          sx={{
            top: "5px !important",
          }}
          TransitionComponent={"left"}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={testMode === "test"}
          autoHideDuration={chat.duration}
          onClose={() => {}}
        >
          <Alert
            severity="warning"
            sx={{
              alignItems: "center",
              padding: "0px 10px !important",
            }}
          >
            Collecting data for Test Mode, your Chat Interface is still live (
            <Button variant="text" onClick={changeTestMode}>
              Disable
            </Button>
            )
          </Alert>
        </Snackbar>
      )}

      <Dialog
        open={searchopen}
        onClose={handleSearchClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="search_popup"
      >
        <DialogContent>
          <input type="Search" placeholder="Spotlight Search" />
          <img src={search1} alt="" />
        </DialogContent>
        <p className="search_text">You can search anything from here…</p>
      </Dialog>

      <Dialog
        open={language}
        onClose={handleLanguageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-folder-model-popup-block"
      >
        <span className="cross-icon-block">
          <IconButton onClick={handleLanguageClose}>
            <img src={crossX} alt="" />
          </IconButton>
        </span>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">Select language</p>
              <div className="input-field-block">
                <FormControl fullWidth className="language_selector">
                  <Select
                    value={selectlanguage}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => {
                      setSelectLanguage(e.target.value);
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="" key="select_language">
                      <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                        Select language
                      </p>
                    </MenuItem>
                    {languageFlagList &&
                      languageFlagList.length > 0 &&
                      languageFlagList.map((prop) => {
                        return (
                          <MenuItem value={prop.value} key={prop.countryCode}>
                            <ReactCountryFlag
                              countryCode={prop.countryCode}
                              svg
                              style={{ marginRight: "10px" }}
                            />
                            {` ${prop.label}`}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <p className="language_text">
                  Once you change the language the entire application language
                  will be changed
                </p>
                <div className="btn-block">
                  <Button
                    className="cancel-btn"
                    variant="contained"
                    onClick={handleLanguageClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="submit-btn"
                    variant="contained"
                    onClick={handleLanguageClose}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Menu
        id="notification-menu"
        className="user-model-block product-model-block notification-model-block"
        anchorEl={activecall}
        open={activecallOpen}
        onClose={handleActivecallClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        MenuListProps={{
          "aria-labelledby": "product-button",
        }}
      >
        <div>
          <p className="top-title">
            <span>Notifications</span>
            <span
              className="clear"
              onClick={() => {
                clearCallNotification();
              }}
            >
              Clear all
            </span>
          </p>
          {activeCalls.map((item, i) => {
            return (
              <MenuItem
                key={i}
                onClick={() => navigateToConversation(item.client_id)}
                component={Link}
                to={getEncryptedKey(item.client_id)}
              >
                <div className="active-call-block">
                  <div className="block ">
                    <div className="icon-block">
                      {item.type === "video_chat" ? (
                        <img src={video} alt="" />
                      ) : (
                        <img src={messageIcon} alt="" />
                      )}
                    </div>
                    <div className="text-block">
                      <p className="title">
                        {item.bot_name} <br /> {item.visitor_name}
                      </p>
                      <p className="date-time">
                        {moment(item.datetime).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="active_call_icon">
                    <HiOutlineExternalLink />
                  </div>
                </div>
              </MenuItem>
            );
          })}
          {/* <MenuItem onClick={handleProductClose}>
            <div className="active-call-block">
              <div className="block ">
                <div className="icon-block">
                  <img src={video} alt="" />
                </div>
                <div className="text-block">
                  <p className="title">
                    Bot name 1 <br /> Visitor-10-170522
                  </p>
                  <p className="date-time">41 minutes ago</p>
                </div>
              </div>
              <div className="active_call_icon">
                <HiOutlineExternalLink />
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="active-call-block">
              <div className="block ">
                <div className="icon-block">
                  <img src={video} alt="" />
                </div>
                <div className="text-block">
                  <p className="title">
                    Bot name 2 <br /> Visitor-10-170522
                  </p>
                  <p className="date-time">2h ago</p>
                </div>
              </div>
              <div className="active_call_icon">
                <HiOutlineExternalLink />
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="active-call-block">
              <div className="block ">
                <div className="icon-block">
                  <img src={video} alt="" />
                </div>
                <div className="text-block">
                  <p className="title">
                    Bot name <br /> Visitor-10-170522
                  </p>
                  <p className="date-time">Feb 14, 2022 at 5:31 PM</p>
                </div>
              </div>
              <div className="active_call_icon">
                <HiOutlineExternalLink />
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="active-call-block">
              <div className="block ">
                <div className="icon-block">
                  <img src={video} alt="" />
                </div>
                <div className="text-block">
                  <p className="title">
                    Bot name <br /> Visitor-10-170522
                  </p>
                  <p className="date-time">Feb 14, 2022 at 5:31 PM</p>
                </div>
              </div>
              <div className="active_call_icon">
                <HiOutlineExternalLink />
              </div>
            </div>
          </MenuItem> */}
        </div>
      </Menu>

      <Menu
        id="notification-menu"
        className="user-model-block product-model-block notification-model-block"
        anchorEl={notification}
        open={notificationmodelOpen}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        MenuListProps={{
          "aria-labelledby": "product-button",
        }}
      >
        <div>
          <p className="top-title">
            <span>Notifications</span>
            <span
              className="clear"
              onClick={() => {
                clearMsgNotification();
              }}
            >
              Clear all
            </span>
          </p>
          <div className="sidescrollbar">
            {notifications.length !== 0 ? (
              Object.keys(notificationsList).map((item, i) => {
                // console.log("notify", item);
                return (
                  <>
                    <p className="mb-2 text-muted">
                      {item == "offlineMessage"
                        ? "Offline Message"
                        : "Live conversation"}
                    </p>
                    {notificationsList[item].map((notif, j) => {
                      return (
                        <MenuItem
                          key={i}
                          onClick={() =>
                            navigateToConversationNotify(notif.client_id)
                          }
                          component={Link}
                          to={getEncryptedKey(notif.client_id, notif.type)}
                        >
                          <div className="block">
                            <div className="icon-block">
                              {notif.type === "active_chat" && (
                                <img src={messageIcon} alt="" />
                              )}
                              {notif.type === "live_chat" && (
                                <img src={messageIcon} alt="" />
                              )}
                              {notif.type === "video_chat" && (
                                <img src={video} alt="" />
                              )}
                            </div>
                            <div className="text-block">
                              <p className="title">
                                {/* {notif.type==='active_chat' && "New Chat"}
                          {notif.type==='live_chat' && "New Live Chat"}
                          {notif.type==='video_chat' && "New Video Chat"}
                            {" "} */}
                                {notif.client_name} <br /> {notif.bot_name}
                              </p>
                              <p className="date-time">
                                {moment(notif.datetime).fromNow()}
                              </p>
                            </div>
                          </div>
                        </MenuItem>
                      );
                    })}
                  </>
                );
              })
            ) : (
              <>
                <div className="text-center text-muted">
                  {notFound.notification
                    ? notFound.notification
                    : "No notification found!"}
                </div>
              </>
            )}
          </div>
          {/* <MenuItem onClick={handleProductClose}>
            <div className="block">
              <div className="icon-block">
                <img src={video} alt="" />
              </div>
              <div className="text-block">
                <p className="title">
                  You have a video conference at <br /> 6:30 PM.
                </p>
                <p className="date-time">41 minutes ago</p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="block">
              <div className="icon-block">
                <img src={messageIcon} alt="" />
              </div>
              <div className="text-block">
                <p className="title">
                  You have a message #support by
                  <br /> Visitor-19806
                </p>
                <p className="date-time">2h ago</p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="block">
              <div className="icon-block">
                <img src={shield} alt="" />
              </div>
              <div className="text-block">
                <p className="title">
                  Suspicious login attempt from <br />
                  Yogesh has been blocked.
                </p>
                <p className="date-time">Feb 14, 2022 at 5:31 PM</p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProductClose}>
            <div className="block">
              <div className="icon-block">
                <img src={zap} alt="" />
              </div>
              <div className="text-block">
                <p className="title">
                  You app is ready to install a new <br />
                  update (v3.12).
                </p>
                <p className="date-time">Feb 15, 2022 at 5:31 PM</p>
              </div>
            </div>
          </MenuItem> */}
        </div>
      </Menu>

      <Menu
        id="help-menu"
        className="user-model-block product-model-block help-model-block"
        anchorEl={help}
        open={helpmodelOpen}
        onClose={handleHelpClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        MenuListProps={{
          "aria-labelledby": "product-button",
        }}
      >
        <div>
          <p className="title">Resource Center</p>
          <p className="description">
            {/* Duis aute irure dolor in reprehend erit in voluptate velit */}
          </p>
          <div className="icon-text-block">
            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Occaecat</p>
            </div>

            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Mollit</p>
            </div>

            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Proiden</p>
            </div>

            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Occaecat</p>
            </div>

            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Mollit</p>
            </div>

            <div className="icon-text">
              <img src={helpLayout} alt="" />
              <p>Proiden</p>
            </div>
          </div>
          <Divider />

          <div className="keyboard-block">
            <p className="title">Keyboard Shortcut</p>
            <p className="descrip">
              {/* Duis aute irure dolor in reprehend erit in voluptate velit */}
            </p>
            <div className="shortcut-keys">
              <div className="block">
                <div className="shortcut">alt</div>
                <div className="shortcut up">
                  <img src={downArrow} alt="" />
                </div>
                <p>Occaecat</p>
              </div>
              <div className="block">
                <div className="shortcut">alt</div>
                <div className="shortcut">
                  <img src={downArrow} alt="" />
                </div>
                <p>Occaecat</p>
              </div>
              <Link to="#">View more</Link>
            </div>
          </div>

          <Divider />
        </div>
      </Menu>

      <Menu
        id="basic-menu"
        anchorEl={copyAnchorEl}
        open={copyOpen}
        onClose={handleCopyClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        className="builder-copy-model-block"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="copy-box">
          <div className="copy-block">
            <span>Landing Page</span>
            <CopyToClipboard
              text={landingScript}
              onCopy={() => {
                alertContext.showAlert({
                  type: "success",
                  message: "Copied successfully",
                });
              }}
            >
              <Button className="copy-icon">
                <img src={copyIcon} alt="" />
                Copy
              </Button>
            </CopyToClipboard>
          </div>
          <hr />
          <div className="copy-block">
            <span className="mb-0">Widget</span>
            <CopyToClipboard
              text={widgetScript}
              onCopy={() => {
                alertContext.showAlert({
                  type: "success",
                  message: "Copied successfully",
                });
              }}
            >
              <Button className="copy-icon">
                <img src={copyIcon} alt="" />
                Copy
              </Button>
            </CopyToClipboard>
          </div>
          {/* <small>WIDGET</small>
          <div className="copy-block">
            <span>Website</span>
            <CopyToClipboard text={widgetScript}>
              <Button className="copy-icon">
                <img src={copyIcon} alt="" />
                Copy
              </Button>
            </CopyToClipboard>
          </div>
          <div className="copy-block">
            <span>WordPress Website</span>
            <CopyToClipboard text={widgetScript}>
              <Button className="copy-icon">
                <img src={copyIcon} alt="" />
                Copy
              </Button>
            </CopyToClipboard>
          </div> */}
          <hr />
          <div className="copy-block">
            <span className="mb-0">Embed</span>
            <CopyToClipboard
              text={embedScript}
              onCopy={() => {
                alertContext.showAlert({
                  type: "success",
                  message: "Copied successfully",
                });
              }}
            >
              <Button className="copy-icon">
                <img src={copyIcon} alt="" />
                Copy
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </Menu>

      <Dialog
        open={knowledgeCancel}
        onClose={handleKnowledgeCancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-edit-model-popup-block"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">
                You have unsaved changes and your data will be lost. Are you
                sure you want to leave?
              </p>
              <div className="info-btn-block">
                <img src={helpIcon} alt="" />
                <div className="btn-block">
                  <Button
                    className="cancel-btn"
                    variant="contained"
                    onClick={handleKnowledgeCancelClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="leave-btn"
                    variant="contained"
                    onClick={() => {
                      setKnowledgeCancel(false);
                      history.push(`/user/knowledge-base`);
                    }}
                  >
                    Leave without saving
                  </Button>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      {/* header language model start */}
      <Dialog
        open={headerLanguage}
        onClose={handleHeaderLanguageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-edit-model-popup-block header-language-model-popup-block"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">
                Do you want to switch your chatbot language?
                <small>
                  Please update your questions in new language to update the
                  chatbot script.
                </small>
              </p>
              <div className="info-btn-block">
                <img src={helpIcon} alt="" />
                <div className="btn-block">
                  <Button
                    className="cancel-btn"
                    variant="contained"
                    onClick={handleHeaderLanguageClose}
                  >
                    No
                  </Button>
                  <Button
                    className="leave-btn"
                    variant="contained"
                    // onClick={handleHeaderLanguageClose}
                    onClick={() => {
                      setSelect_language(selecting_language);
                      handleHeaderLanguageClose();
                      setSnackbar(true);
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      {/* header language model end */}

      <Snackbar
        // anchorOrigin={['bottom', 'center']}
        className="snackbar-block-popup"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbar}
        onClose={() => {
          setSnackbar(false);
        }}
        message={
          <div className="text-block">
            <p>
              {" "}
              You are now building chatbot in {selecting_language} language.
            </p>
            <p>Update all chat components & verify the preview.</p>
          </div>
        }
        key={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />

      <MuiDrawer
        anchor={"right"}
        open={openFeature}
        onClose={() => {
          setOpenFeature(false);
        }}
      >
        <Box
          sx={{
            width: 512,
          }}
          role="presentation"
          // onClick={toggleDrawer(anchor, false)}
          // onKeyDown={toggleDrawer(anchor, false)}
        >
          {selectedFeature === false ? (
            <div className="edit_question_drawer">
              <div className="edit_question_header">
                <p className="created_heading">New Features</p>
                <p
                  role="button"
                  onClick={() => {
                    setOpenFeature(false);
                  }}
                  className="back_text"
                >
                  <img src={arrow} alt="" />
                  Back
                </p>
              </div>
              <FormGroup>
                <div className="new_feature_block">
                  {features.length > 0 ? (
                    features.map((item, i) => (
                      <div
                        className="feature_box"
                        key={i}
                        onClick={() => {
                          setselectedFeature(item);
                        }}
                      >
                        <div>
                          <div>
                            <img src={cal1} alt="" />
                          </div>
                          <p>{item.title}</p>
                        </div>
                        <img src={arrowright} alt="" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center alert alert-danger">
                      No Data Found!
                    </div>
                  )}

                  {/* <div className="text-center alert alert-danger">
                     No Data Found!
                  </div> */}
                </div>
              </FormGroup>
              <p>&nbsp;</p>
              <div className="funnel_btn_block">
                <Button
                  variant="contained"
                  className="fupdate_btn"
                  type="button"
                  onClick={() => {
                    setOpenFeature(false);
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          ) : (
            <div className="edit_question_drawer">
              <div className="edit_question_header">
                <p className="created_heading">{selectedFeature.title}</p>
                <p
                  role="button"
                  onClick={() => {
                    setselectedFeature(false);
                  }}
                  className="back_text"
                >
                  <img src={arrow} alt="" />
                  Back
                </p>
              </div>
              <FormGroup>{selectedFeature.description}</FormGroup>
              <p>&nbsp;</p>
              <div className="funnel_btn_block">
                <Button
                  variant="contained"
                  className="fupdate_btn"
                  type="button"
                  onClick={() => {
                    setselectedFeature(false);
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </Box>
      </MuiDrawer>
    </Fragment>
  );
}
