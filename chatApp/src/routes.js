// import NotFound from "./actions/not-found";
// import Thanks from "./actions/thanks";
// const TransferAgent = () => import('./actions/transfer-agent');

// ------ Bot Components ------------------- //
const Message = () => import('./actions/message');
const MultiChoice = () => import('./actions/multi_choice');
const KnowldgeTransfer = () => import('./actions/knowlege_transfer');
const TextQuestion = () => import('./actions/text_question');
const WelcomCard = () => import('./actions/welcome_card');
const Number = () => import('./actions/number');
const ConnectAgent = () => import('./actions/connect_agent');
const HumanHandoff = () => import('./actions/human_handoff');
const OfflineForm = () => import('./actions/offline_form');
const FormSent = () => import('./actions/form_sent');
const Connected = () => import('./actions/connected');
const VideoChatinit = () => import('./actions/videoChatinit');
const RestartChat = () => import('./actions/restartChat');
const Date = () => import('./actions/date');
const Email = () => import('./actions/email');
const PhoneNumber = () => import('./actions/phone_number');
const MultiSelect = () => import('./actions/multi_select');
const Rating = () => import('./actions/rating');
const Range = () => import('./actions/range');
const OpinionScale = () => import('./actions/opinion_scale');
const Appointment = () => import('./actions/appointment');
const AppointmentConfirmed = () => import('./actions/appointment_confirmed');
const Upload = () => import('./actions/upload');
const Carousel = () => import('./actions/carousel');
const Links = () => import('./actions/links');
const RatingSelected = () => import('./actions/rating_selected');
const NotFound = () => import("./actions/not-found");

const routeMap = {
  "message": Message,
  "date": Date,
  "multi_choice": MultiChoice,
  "knowledge_transfer": KnowldgeTransfer,
  "text_question": TextQuestion,
  "welcome_card": WelcomCard,
  "multi_select": MultiSelect,
  "rating": Rating,
  "rating_selected": RatingSelected,
  "range": Range,
  "opinion_scale": OpinionScale,
  "appointment": Appointment,
  "appointment_confirmed": AppointmentConfirmed,
  "file_upload": Upload,
  "carousal": Carousel,
  "number": Number,
  "email": Email,
  "phone_number": PhoneNumber,
  "links": Links,
  "connect_agent": ConnectAgent,
  "human_handoff": HumanHandoff,
  "offline_form": OfflineForm,
  "form_sent": FormSent,
  "connected": Connected,
  "assign_to_me": Connected,
  "videoChatinit": VideoChatinit,
  "videochatlink": VideoChatinit,
  "human_takeover": Message,
  "restartChat": RestartChat,
  "endchat": Message,

};

export const routes = async (args) => {
  let obj;

  const payload = args.input.payload;
  if (payload && routeMap[payload]) {
    const component = await routeMap[payload]();
    obj = {
      path: payload,
      payload: payload,
      action: component.default
    };
  } else {
    const component = await NotFound();
    obj = {
      path: "404",
      payload: "404",
      action: component.default
    };

  }

  return [obj];
};