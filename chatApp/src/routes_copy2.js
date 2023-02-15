import NotFound from "./actions/not-found";

// ------ Bot Components ------------------- //
import Message from "./actions/message";
import MultiChoice from "./actions/multi_choice";
import KnowldgeTransfer from "./actions/knowlege_transfer";
import TextQuestion from "./actions/text_question";
import WelcomCard from "./actions/welcome_card";
import Number from "./actions/number";
import ConnectAgent from "./actions/connect_agent";
import HumanHandoff from "./actions/human_handoff";
import OfflineForm from "./actions/offline_form";
import FormSent from "./actions/form_sent";
import Connected from "./actions/connected";
import VideoChatinit from "./actions/videoChatinit";
import RestartChat from "./actions/restartChat";
import Date from "./actions/date";
import Email from "./actions/email";
import PhoneNumber from "./actions/phone_number";
import MultiSelect from "./actions/multi_select";
import Rating from "./actions/rating";
import Range from "./actions/range";
import OpinionScale from "./actions/opinion_scale";
import Appointment from "./actions/appointment";
import AppointmentConfirmed from "./actions/appointment_confirmed";
import Upload from "./actions/upload";
import Carousel from "./actions/carousel";
import Links from "./actions/links";
import RatingSelected from "./actions/rating_selected";

export const routes = [
  // ------------------ Bot Components ------------------------ //
  { path: "message", payload: "message", action: Message },
  { path: "multi_choice", payload: "multi_choice", action: MultiChoice },
  {
    path: "knowledge_transfer",
    payload: "knowledge_transfer",
    action: KnowldgeTransfer,
  },
  { path: "text_question", payload: "text_question", action: TextQuestion },
  { path: "welcome_card", payload: "welcome_card", action: WelcomCard },
  { path: "date", payload: "date", action: Date },
  { path: "multi_select", payload: "multi_select", action: MultiSelect },
  { path: "rating", payload: "rating", action: Rating },
  {
    path: "rating_selected",
    payload: "rating_selected",
    action: RatingSelected,
  },
  { path: "range", payload: "range", action: Range },
  { path: "opinion_scale", payload: "opinion_scale", action: OpinionScale },
  { path: "appointment", payload: "appointment", action: Appointment },
  {
    path: "appointment_confirmed",
    payload: "appointment_confirmed",
    action: AppointmentConfirmed,
  },
  { path: "file_upload", payload: "file_upload", action: Upload },
  { path: "carousal", payload: "carousal", action: Carousel },
  // I think those three components number, email, phone_number,
  // can be made with same component, but with different route
  { path: "number", payload: "number", action: Number },
  { path: "email", payload: "email", action: Email },
  { path: "phone_number", payload: "phone_number", action: PhoneNumber },
  { path: "links", payload: "links", action: Links },

  { path: "connect_agent", payload: "connect_agent", action: ConnectAgent },
  { path: "human_handoff", payload: "human_handoff", action: HumanHandoff },
  { path: "offline_form", payload: "offline_form", action: OfflineForm },
  { path: "form_sent", payload: "form_sent", action: FormSent },
  { path: "connected", payload: "connected", action: Connected },
  { path: "assign_to_me", payload: "assign_to_me", action: Connected },
  { path: "videoChatinit", payload: "videoChatinit", action: VideoChatinit },
  { path: "videochatlink", payload: "videochatlink", action: VideoChatinit },
  { path: "human_takeover", payload: "human_takeover", action: Message },
  { path: "restartChat", payload: "restartChat", action: RestartChat },
  { path: "endchat", payload: "endchat", action: Message },
  { path: "404", text: /.*/, action: NotFound },
];
