import React, { Component,Fragment } from "react";
import NewUserDashboardComponent from "./NewUserDashboardComponent.jsx";
import UserDashboardComponent from "./UserDashboardComponent.jsx";


class DashboardLayout extends Component {
  
  render() {
      return (
        <Fragment>
              {((parseInt(localStorage.getItem("userBots")) !== 0 && !isNaN(parseInt(localStorage.getItem("userBots")))))
              ?(
               <UserDashboardComponent {...this.props}></UserDashboardComponent>
              ):(
                <NewUserDashboardComponent
            {...this.props}
          ></NewUserDashboardComponent>
              )}
        
         
        </Fragment>
      );
  }
}

export default DashboardLayout;
