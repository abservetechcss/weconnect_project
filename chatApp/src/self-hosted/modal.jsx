import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import React, { useState } from "react";
import Backdrop from "./BackDrop";
import RatingComponent from "./../actions/ratingComponent";
import TextField from "@mui/material/TextField";
import { GDPR_COOKIE } from "../constants";
import { createCookie } from "./lib";

const dropIn = {
  hidden: {
    x: "-50%",
    y: "-285%",
    opacity: 0,
  },
  visible: {
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "285%",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const ModalContainer = ({ children, label }) => (
  // Enables the animation of components that have been removed from the tree
  <AnimatePresence
    // Disable any initial animations on children that
    // are present when the component is first rendered
    initial={false}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
    exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
  >
    {children}
  </AnimatePresence>
);

const ModalComponent = styled(motion.div)`
  width: clamp(50%, 700px, 83%);
  height: min(75%, 300px);
  margin: auto;
  padding: 0 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
`;

const RatingContainer = styled.div`
  max-width: 265px;
  border: 1px solid #00424f;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 8px;
`;

const TextAreaContainer = styled.div`
  // max-width: 265px;
  max-width: 100%;
  width: 100%;
  border-radius: 10px;
  // margin: 0 auto;
  margin: 7px auto 27px;
`;

const ModalButton = styled(motion.button)`
  // background: green;
  background: #15424f;
  color: #fff;
  border: none;
  outline: 0;
  padding: 10px 20px;
  border-radius: 50px;
  margin: 0 5px;
`;
const ModalButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 10px;
`;
const ModalContent = styled.div`
  background: #fff;
  padding: 30px 15px;
  border-radius: 10px;
  font: normal normal normal 14px/20px Nunito;
  letter-spacing: 0.07px;
  color: #000000;
`;

const Modal = (props) => {
  const [feedBack, setFeedBack] = useState({
    rating: {},
    feedback_question: {},
  });

  const handlefeedbackChange = (e, modaltype) => {
    const feedbackData = { ...feedBack };
    if (modaltype == "feedback2") {
      console.log(e.target.value);
      feedbackData.feedback_question[e.target.name] = e.target.value;
      setFeedBack(feedbackData);
    } else {
      feedbackData.rating["rate"] = e;
      setFeedBack(feedbackData);
    }
  };

  const onFeedbackSubmit = (type) => {
    const feedback = { ...feedBack };
    let obj = {
      bot_id: props.webchatState.session.bot.id,
      agent_id: props.modal.params ? props.modal.params : 0,
      client_id: props.webchatState.session.bot.client_id,
    };
    if (type === "feedback2") {
      obj.feedback_question_title =
        feedback.feedback_question.feedback_question_title;
    } else {
      obj.rate = feedback.rating.rate;
    }
    console.log(obj);

    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    abortableFetch(
      `${process.env.REACT_APP_ENV_API_URL}websocket/feedbackChat`,
      {
        method: "post",
        body: JSON.stringify(obj),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("error...", err);
      });
  };

  return (
    <ModalContainer>
      {props.modal.open && (
        <Backdrop>
          <ModalComponent
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            className="modal orange-gradient"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ModalContent>
              {props.modal.type === "feedback" && (
                <>
                  <div style={{}}>
                    How would you rate your conversation with an Agent?
                    <RatingContainer>
                      <RatingComponent
                        options={{
                          rating_type: "star",
                          rate_1: "",
                          rate_2: "",
                          rate_3: "",
                          rate_4: "",
                          rate_5: "",
                        }}
                        name="rate"
                        saveRating={(e) => {
                          console.log(props);
                          handlefeedbackChange(e, "feedback");
                        }}
                      />
                    </RatingContainer>
                    <ModalButtonContainer>
                      <ModalButton
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          props.updateChatSettings({
                            modal: {
                              open: false,
                              type: props.modal.type,
                            },
                          });
                          onFeedbackSubmit("feedback");
                        }}
                      >
                        Yes
                      </ModalButton>
                      <ModalButton
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          props.updateChatSettings({
                            modal: {
                              open: false,
                              type: props.modal.type,
                            },
                          });
                        }}
                      >
                        No
                      </ModalButton>
                    </ModalButtonContainer>
                  </div>
                </>
              )}

              {props.modal.type === "feedback2" && (
                <>
                  Your feedback helps us in delivering best chat experience!
                  <TextAreaContainer>
                    <TextField
                      required={true}
                      label=""
                      name="feedback_question_title"
                      className="weconnect_feedback2"
                      placeholder={"Write your feedback here..."}
                      multiline
                      rows={4}
                      style={{ width: "100%" }}
                      // inputProps={{ "data-index": i }}
                      onChange={(e) => {
                        handlefeedbackChange(e, "feedback2");
                      }}
                      // value={item.value}
                      // error={item.error}
                    />
                  </TextAreaContainer>
                  <ModalButtonContainer>
                    <ModalButton
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // props.updateChatSettings({
                        //   modal: {
                        //     open: false,
                        //     type: props.modal.type,
                        //   },
                        // });
                        onFeedbackSubmit("feedback2");
                      }}
                    >
                      Submit
                    </ModalButton>
                    <ModalButton
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        props.updateChatSettings({
                          modal: {
                            open: false,
                            type: props.modal.type,
                          },
                        });
                      }}
                    >
                      Cancel
                    </ModalButton>
                  </ModalButtonContainer>
                </>
              )}

              {props.modal.type === "gdpr" && (
                <>
                  {props.modal.text}
                  <ModalButtonContainer>
                    <ModalButton
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        createCookie(GDPR_COOKIE + props.botId, 1, 30);
                        props.updateChatSettings({
                          modal: {
                            open: false,
                            type: props.modal.type,
                          },
                        });
                      }}
                    >
                      Accept
                    </ModalButton>
                    <ModalButton
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // props.updateChatSettings({
                        //   modal: {
                        //     open: false,
                        //     type: props.modal.type,
                        //   },
                        // });
                        props.toggleWebchat(false);
                      }}
                    >
                      Reject
                    </ModalButton>
                  </ModalButtonContainer>
                </>
              )}

              {props.modal.type === "continue" && (
                <>
                  Hi, are you still there? Would you like to continue
                  conversation!
                  <ModalButtonContainer>
                    <ModalButton
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        props.updateChatSettings({
                          modal: {
                            open: false,
                            type: props.modal.type,
                          },
                        });
                      }}
                    >
                      Submit
                    </ModalButton>
                  </ModalButtonContainer>
                </>
              )}
            </ModalContent>
          </ModalComponent>
        </Backdrop>
      )}
    </ModalContainer>
  );
};

export default Modal;
