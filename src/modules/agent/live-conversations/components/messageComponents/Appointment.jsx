
import { FiUser, FiMail, FiCalendar, FiLink, FiGlobe } from "react-icons/fi";
const Appointment = (props) => {
      return (
        <div className='liveConv_appointment'>
                <div><p className="appointment_title_form">Appointment Details</p></div>
                <div className="appointment_text_form">
          <FiUser />
          <span>{props.message.name}</span>
          </div>
          <div className="appointment_text_form">
          <FiMail />
          <span>{props.message.email}</span>
          </div>
          <div className="appointment_text_form">
          <FiCalendar />
          <span>
            {props.message.time_slot} {props.message.answer_id}
          </span>
          </div>
          <div className="appointment_text_form">
          <FiGlobe />
          <span>{props.message.time_zone}</span>
          </div>
          <div className="appointment_text_form">
          <FiLink />
          <span><a href={props.message.meeting_link} target="_blank">{props.message.meeting_link}</a></span>
          </div>
            </div>
      );
  };

  export default Appointment;