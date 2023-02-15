import React, { Component, Fragment } from "react";
import SimpleMessageComponent from "./components/logical-jump/SimpleMessageComponent.jsx";
import RaibuLiveAssistantComponent from "./components/logical-jump/RaibuLiveAssistantComponent.jsx";
import PhoneNumberComponent from "./components/logical-jump/PhoneNumberComponent.jsx";
import WelcomeCardComponent from "./components/logical-jump/WelcomeCardComponent.jsx";
import JumpNumberComponent from "./components/logical-jump/JumpNumberComponent.jsx";
import OpenQuestionComponent from "./components/logical-jump/OpenQuestionComponent.jsx";
import EmailRequestComponent from "./components/logical-jump/EmailRequestComponent.jsx";
import MultiChoiceComponent from "./components/logical-jump/MultiChoiceComponent.jsx";
import CalendarDateComponent from "./components/logical-jump/CalendarDateComponent.jsx";
import MultiSelectComponent from "./components/logical-jump/MultiSelectComponent.jsx";
import ShareALinkComponent from "./components/logical-jump/ShareALinkComponent.jsx";
import FileUploadComponent from "./components/logical-jump/FileUploadComponent.jsx";
import RatingJumpComponent from "./components/logical-jump/RatingJumpComponent.jsx";
import NumberRangeComponent from "./components/logical-jump/NumberRangeComponent.jsx";
import ScheduleMeetingComponent from "./components/logical-jump/ScheduleMeetingComponent.jsx";
import CarousalJumpComponent from "./components/logical-jump/CarousalJumpComponent.jsx";
import OpinionScaleComponent from "./components/logical-jump/OpinionScaleComponent.jsx";

export class BuilderLogicalJumpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      componentType: [],
      question_lists: [],
      logical_jump: [],
      logical_jumpList: [],
      jump_to: null,
      question_id: null
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="knowledge_section">
          {_this.props.logicalJumpComType === "message" ? (
            <SimpleMessageComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "connect_agent" ? (
            <RaibuLiveAssistantComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "phone_number" ? (
            <PhoneNumberComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "welcome_card" ? (
            <WelcomeCardComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "number" ? (
            <JumpNumberComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "text_question" ? (
            <OpenQuestionComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "email" ? (
            <EmailRequestComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "multi_choice" ? (
            <MultiChoiceComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "date" ? (
            <CalendarDateComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "multi_select" ? (
            <MultiSelectComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "links" ? (
            <ShareALinkComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "file_upload" ? (
            <FileUploadComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "rating" ? (
            <RatingJumpComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "range" ? (
            <NumberRangeComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "appointment" ? (
            <ScheduleMeetingComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "carousal" ? (
            <CarousalJumpComponent child_this={_this} {..._this.props} />
          ) : _this.props.logicalJumpComType === "opinion_scale" ? (
            <OpinionScaleComponent child_this={_this} {..._this.props} />
          ) : (
            <SimpleMessageComponent
              question_lists={_this.state.question_lists}
              child_this={_this}
              {..._this.props}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default BuilderLogicalJumpComponent;
