import RegistrationPageComponent from "../modules/users/registration/RegistrationPageComponent.jsx";
import LoginPage from "../modules/users/login/LoginPage.jsx";
import DashboardLayout from "../modules/dashboard/DashboardLayout.jsx";
import DashboardComponent from "../modules/dashboard/home-dashboard/DashboardComponent.jsx";
import LiveConversationPage from "../modules/dashboard/live-conversation/LiveConversationPage.jsx";
import InputFields from "../custome_fields/InputFields.js";

var dashboardRoute = [
  { path: "/dashboard", component: DashboardComponent },
  { path: "/dashboard/live-conversation", component: LiveConversationPage },
  { path: "/dashboard/custome-field", component: InputFields },

  
  { path: "/ ", component: DashboardComponent },
  { redirect: true, path: "/", pathTo: "/ " },
];
export default dashboardRoute;
