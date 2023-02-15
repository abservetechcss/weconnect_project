import RegistrationPageComponent from "../modules/users/registration/RegistrationPageComponent.jsx";
import LoginPage from "../modules/users/login/LoginPage.jsx";
import ForgotPasswordComponent from "../modules/users/forgot-password/ForgotPasswordComponent.jsx";
import ResetPasswordComponent from "../modules/users/reset-password/ResetPasswordComponent.jsx";
import LoginWithVerifyEmailComponent from "../modules/users/login/LoginWithVerifyEmailComponent.jsx";
import TermsConditionComponent from "../modules/users/terms-privacy/TermsConditionComponent.jsx";
import emailMessage from "../modules/users/offlineUserMessage/emailMessage.jsx";

var userRoutes = [
  {
    path: "/verifyemail/",
    name: "Verify Email",
    component: LoginWithVerifyEmailComponent,
  },
  { path: "/login", name: "Login", component: LoginPage },
  {
    path: "/terms-privacy",
    name: "Terms Privacy",
    component: TermsConditionComponent,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForgotPasswordComponent,
  },
  {
    path: "/reset-password/:id",
    name: "Reset Password",
    component: ResetPasswordComponent,
  },
  {
    path: "/registration/:id",
    name: "Regiseteration",
    component: RegistrationPageComponent,
  },
  {
    path: "/referer/:referer",
    name: "Regiseteration",
    component: RegistrationPageComponent,
  },
  {
    path: "/registration",
    name: "Regiseteration",
    component: RegistrationPageComponent,
  },
  { path: "/emailMessage/:id", name: "emailMessage", component: emailMessage },
  { path: "/ ", name: "Login", component: LoginPage },
  { redirect: true, path: "/", pathTo: "/ " },
];
export default userRoutes;
