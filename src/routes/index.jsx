import AppLayout from "../layout/AppLayout.jsx";
import AgentLayoutComponent from "../layout/AgentLayoutComponent.jsx";
import NewUserLayoutComponent from "../layout/NewUserLayoutComponent.jsx";
import { useEffect } from "react";

const autoLoginCheck = () => {
  let Logincheck = localStorage.getItem("expiry")
    ? localStorage.getItem("expiry")
    : "";
  if (new Date(Logincheck)?.getTime() - new Date().getTime() <= 0) {
    localStorage.clear();
    localStorage.setItem("loginStatus", false);
  }
  return [
    { path: "/agent", name: "Agent", component: AgentLayoutComponent },
    { path: "/user", name: "Agent", component: NewUserLayoutComponent },
    { path: "/", name: "App", component: AppLayout },
  ];
};

var indexRoutes = autoLoginCheck();
export default indexRoutes;
