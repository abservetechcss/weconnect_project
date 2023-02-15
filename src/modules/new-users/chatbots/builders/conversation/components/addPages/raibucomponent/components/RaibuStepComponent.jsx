import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RaibuStep1Component from "./RaibuStep1Component";
import RaibuStep3Component from "./RaibuStep3Component";
import RaibuStep2Component from "./RaibuStep2Component";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

export default function RaibuStepComponent(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const activeRef = React.useRef(null);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleActiveStep = (step) => {
    setActiveStep(step);
  };

  let activeStepComponent;

  return (
    <React.Fragment>
      <section className="raibu-step-section">
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}></StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* <Typography sx={{ mt: 2, mb: 1 }}>Step sldfls {activeStep + 1}</Typography> */}
              {activeStep + 1 == 1 ? (
                <RaibuStep1Component
                  // setActive={click => activeStepComponent = click}
                  ref={activeRef}
                  handleActiveStep={handleActiveStep}
                  {...props}
                />
              ) : activeStep + 1 == 2 ? (
                <RaibuStep2Component
                  // setActive={click => activeStepComponent = click}
                  ref={activeRef}
                  handleActiveStep={handleActiveStep}
                  {...props}
                />
              ) : activeStep + 1 == 3 ? (
                <RaibuStep3Component
                  ref={activeRef}
                  handleFinishSetupLive={props.handleFinishSetupLive}
                  // setActive={click => activeStepComponent = click}
                  handleActiveStep={handleActiveStep}
                  handleSetupLiveClose={props.handleSetupLiveClose}
                  {...props}
                />
              ) : null}
              <Box
                className="next-btn-block"
                sx={{ display: "flex", flexDirection: "row", pt: 2 }}
              >
                {/* <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    {isStepOptional(activeStep) && (
                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                            Skip
                                        </Button>
                                    )} */}

                {activeStep!==0 && <Button
                  // onClick={handleNext}
                  onClick={() => {
                    setActiveStep(activeStep-1)
                  }}
                >Back
                </Button>}

                <Button
                  // onClick={handleNext}
                  onClick={() => {
                    // save component
                    if (activeRef) {
                      activeRef.current.saveStep();
                    }

                    // activeStepComponent();
                    // if(activeStep==2)
                    // {
                    //     props.handleSetupLiveClose();
                    // }
                    // else{
                    //     handleNext();
                    // }
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </section>
    </React.Fragment>
  );
}
