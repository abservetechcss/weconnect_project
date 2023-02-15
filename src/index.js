import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import indexRoutes from "./routes/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { SocketProvider } from "./modules/common/WebSocketComponent.jsx";
import { AlertProvider } from "./modules/common/Alert";

ReactDOM.render(
  <div>
    <Router>
      <Provider store={store}>
        <SocketProvider>
          <AlertProvider>
            <Switch>
              {indexRoutes.map((prop, key) => {
                return (
                  <Route
                    path={prop.path}
                    component={prop.component}
                    name={prop.name}
                    key={key}
                  />
                );
              })}
            </Switch>
          </AlertProvider>
        </SocketProvider>
      </Provider>
    </Router>
  </div>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
console.disableYellowBox = true;
// console.clear();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
