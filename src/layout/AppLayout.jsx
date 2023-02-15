import React, { Component, useEffect, useLayoutEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import landingRoutes from "../routes/App";
import useRouteMatch from "./useRouteMatch";

export default function AppLayout(props) {
  const history = useHistory();
  const routeParams = useRouteMatch(landingRoutes);
  useLayoutEffect(() => {
    let _this = this;
    console.disableYellowBox = true;
    if (
      window.location.href.includes("/forgot-password") ||
      window.location.href.includes("/reset-password/") ||
      window.location.href.includes("/terms-condition") ||
      window.location.href.includes("/privacy-policy") ||
      window.location.href.includes("/verifyemail") ||
      window.location.href.includes("/emailMessage") ||
      window.location.href.includes("/referer")
    ) {
    } else {
      checkValidUser();
    }
  }, []);

  useLayoutEffect(() => {
    if (routeParams && routeParams.name)
      document.title = "WeConnect | " + routeParams.name;
  }, [routeParams]);

  const checkValidUser = () => {
    let _this = this;
    console.log("cookies value", localStorage.getItem("id"));
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("admin_type") &&
      localStorage.getItem("email")
    ) {
      debugger;
      if (localStorage.getItem("loginStatus") === "true") {
        if (localStorage.getItem("admin_type") === "agent") {
          history.push("/agent/dashboard");
        } else {
          history.push("/user/dashboard");
        }
      } else {
        history.push("/login");
      }
    } else {
      if (window.location.pathname.substring(0, 13) !== "/registration")
        history.push("/login");
    }
  };

  return (
    <div>
      <div>
        <Switch>
          {landingRoutes.map((prop, key) => {
            if (prop.redirect)
              return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
            else
              return (
                <Route
                  path={prop.path}
                  // component={prop.component}
                  key={key}
                >
                  <prop.component {...props} />
                </Route>
              );
          })}
        </Switch>
      </div>
    </div>
  );
}
