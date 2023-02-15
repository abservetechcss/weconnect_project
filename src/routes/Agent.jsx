import AgentDashboardComponent from "../modules/agent/dashboard/AgentDashboardComponent.jsx";
import AgentEditProfileComponent from "../modules/agent/edit-profile/AgentEditProfileComponent.jsx";
import LiveConversationComponent from "../modules/agent/live-conversations/LiveConversationComponent.jsx";
import OfflineMessageComponent from "../modules/agent/offline-messages/OfflineMessageComponent.jsx";
import UserWithOutBotLeadsComponent from "../modules/new-users/users/UserWithOutBotLeadsComponent.jsx";

var appRoutes = [
  {
    path: "/agent/dashboard",
    name: "Dashboard",
    component: AgentDashboardComponent
  },
  {
    path: "/agent/live-conversation",
    name: "Live conversations",
    component: LiveConversationComponent
  },
  {
    path: "/agent/offline-messages",
    name: "Offline Messages",
    component: OfflineMessageComponent
  },
  {
    path: "/agent/leads",
    name: "Leads",
    component: UserWithOutBotLeadsComponent
  },
  {
    path: "/agent/edit-profile",
    name: "Edit Profile",
    component: AgentEditProfileComponent
  },
  { redirect: true, path: "/", pathTo: "/agent/dashboard", name: "Dashboard" }
];
export default appRoutes;
