import DashboardLayout from "../modules/new-users/dashboard/DashboardLayout.jsx";
import CreateFromScratchComponent from "../modules/new-users/create-conversational-experience/CreateFromScratchComponent.jsx";
import AnalyticsComponent from "../modules/new-users/analytics/AnalyticsComponent.jsx";
import KnowledgeBaseComponent from "../modules/new-users/knowledge-base/KnowledgeBaseComponent.jsx";
import KnowledgeBaseSettingComponent from "../modules/new-users/knowledge-base/KnowledgeBaseSettingComponent.jsx";
import OverviewComponent from "../modules/new-users/chatbots/overview/OverviewComponent.jsx";
import TemplatesComponent from "../modules/new-users/templates/TemplatesComponent.jsx";
import ReferAFriendComponent from "../modules/refer-a-friend/ReferAFriendComponent.jsx";
import EditProfileComponent from "../modules/users/edit-profile/EditProfileComponent.jsx";
import AppointmentComponent from "../modules/new-users/chatbots/appointment/AppointmentComponent.jsx";
import SubscriptionModule from "../modules/subscription/SubscriptionModule.jsx";
// import LandingLayoutComponent from "../modules/new-users/chatbots/components/design_component/landing/LandingLayoutComponent.jsx";
// import GeneralComponent from "../modules/new-users/chatbots/components/design_component/general/GeneralComponent.jsx";
// import { DesignHeaderComponent } from "../modules/new-users/chatbots/components/design_component/header/DesignHeaderComponent.jsx";
// import DesignMessageComponent from "../modules/new-users/chatbots/components/design_component/message/DesignMessageComponent.jsx";
import InsightsComponent from "../modules/analytics/insights/InsightsComponent.jsx";
import AgentPerformanceComponent from "../modules/analytics/agentperformance/AgentPerformanceComponent.jsx";
import IndicatorsComponent from "../modules/analytics/indicators/IndicatorsComponent.jsx";
import FunnelComponentPage from "../modules/analytics/funnel/FunnelComponentPage.jsx";
import AnalyticsConversationPageComponent from "../modules/analytics/conversation/AnalyticsConversationPageComponent.jsx";
import UserLeadsComponent from "../modules/new-users/users/UserLeadsComponent.jsx";
import UserWithOutBotLeadsComponent from "../modules/new-users/users/UserWithOutBotLeadsComponent.jsx";
import UserChatBotComponent from "../modules/new-users/chatbots/UserChatBotComponent.jsx";
import ChatBotBuildPageComponent from "../modules/new-users/chatbots/builders/ChatBotBuildPageComponent.jsx";
import TemplateManagerListPage from "../modules/new-users/templates/components/templateManager/TemplateManagerListPage.jsx";
import SettingsComponent from "../modules/settings/SettingsComponent.jsx";

var appRoutes = [
  {
    path: "/user/dashboard",
    name: "Dashboard",
    component: DashboardLayout
  },
  {
    path: "/user/create-form-scratch",
    name: "Create Form Scratch",
    component: CreateFromScratchComponent
  },

  {
    path: "/user/templates",
    name: "Templates",
    component: TemplatesComponent
  },

  {
    path: "/user/chatbots/overview",
    name: "Overview",
    component: OverviewComponent
  },
  {
    path: "/user/knowledge-base/new-article-creation/:id",
    name: "Knowledge Base",
    component: KnowledgeBaseSettingComponent
  },
  {
    path: "/user/knowledge-base/new-article-creation",
    name: "Knowledge Base",
    component: KnowledgeBaseSettingComponent
  },
  {
    path: "/user/knowledge-base",
    name: "Knowledge Base",
    component: KnowledgeBaseComponent
  },
  {
    path: "/user/leads",
    name: "Leads",
    component: UserWithOutBotLeadsComponent
  },
  {
    path: "/user/refer",
    name: "Refer a friend",
    component: ReferAFriendComponent
  },
  {
    path: "/user/edit-profile",
    name: "Edit Profile",
    component: EditProfileComponent
  },
  {
    path: "/user/analytics/leads",
    name: "Analytics",
    component: UserLeadsComponent
  },
  {
    path: "/user/analytics/agent-performance",
    name: "Analytics",
    component: AgentPerformanceComponent
  },
  
  {
    path: "/user/template-manager",
    name: "Template Manager",
    component: TemplateManagerListPage
  },
  {
    path: "/user/chatbots/appointment",
    name: "Appointment",
    component: AppointmentComponent
  },

  {
    path: "/user/analytics/funnel",
    name: "Analytics",
    component: FunnelComponentPage
  },
  {
    path: "/user/subscription/:id",
    name: "Subscription",
    component: SubscriptionModule
  },
  {
    path: "/user/subscription",
    name: "Subscription",
    component: SubscriptionModule
  },
  {
    path: "/user/chatbots/builder",
    name: "Builder",
    component: ChatBotBuildPageComponent
  },
  {
    path: "/user/analytics/conversation",
    name: "Analytics",
    component: AnalyticsConversationPageComponent
  },
  {
    path: "/user/chatbots",
    name: "Chat Interfaces",
    component: UserChatBotComponent
  },
  // {
  //   path: "/user/landing-layouts",
  //   name: "CreateFormScratch",
  //   component: LandingLayoutComponent
  // },
  // {
  //   path: "/user/general",
  //   name: "CreateFormScratch",
  //   component: GeneralComponent
  // },
  // {
  //   path: "/user/design-header",
  //   name: "CreateFormScratch",
  //   component: DesignHeaderComponent
  // },
  // {
  //   path: "/user/design-message",
  //   name: "CreateFormScratch",
  //   component: DesignMessageComponent
  // },
  {
    path: "/user/analytics/insights",
    name: "Analytics",
    component: InsightsComponent
  },
  {
    path: "/user/analytics/indicators",
    name: "Analytics",
    component: IndicatorsComponent
  },
  {
    path: "/user/analytics",
    name: "Analytics",
    component: AnalyticsComponent
  },
  {
    path: "/user/settings",
    name: "Settings",
    component: SettingsComponent
  },
  {
    redirect: true,
    path: "/",
    pathTo: "/user/dashboard",
    name: "Dashboard"
  },
];
export default appRoutes;
