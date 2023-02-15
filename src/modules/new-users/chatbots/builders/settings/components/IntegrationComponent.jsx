import React, {
  Component,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import img1 from "../../../../../../assets/images/userdash/Image 33.png";
import img2 from "../../../../../../assets/images/userdash/Mask Group 464.png";
import img3 from "../../../../../../assets/images/userdash/Image 35.png";
import img4 from "../../../../../../assets/images/hubspot.png";
import img5 from "../../../../../../assets/images/google-calendar.png";
import apps from "../../../../../../assets/images/userdash/appdots.svg";
import { Form } from "react-bootstrap";
import crossX from "../../../../../../assets/images/x.svg";

import { AlertContext } from "../../../../../common/Alert";
import { zapierLink as zapierLinkfn } from "../server/IntegrationServer";
import { useIntegrationApp } from "@integration-app/react";
import IntegrationPage from "./integrationfile/IntegrationPage";
import IntegrationsList from "./integrationfile/IntegrationList";

function IntegrationComponent() {
  const integrationApp = useIntegrationApp();

  const [open, setOpen] = useState(false);
  const [zapieropen, setZapieropen] = useState(false);
  const [zapierLink, setzapierLink] = useState("");
  const [hubsopen, setHubsopen] = useState(false);
  const [self, setSelf] = useState(null);
  const [showAppS, setShowAppS] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [integrationKey, setIntegrationKey] = useState("");

  const context = useContext(AlertContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  const handleClickZapier = () => {
    context.showLoading();
    zapierLinkfn(
      (res) => {
        setZapieropen(true);
        setzapierLink(res.zapier_url);
      },
      (err) => {
        context.showAlert({
          type: "error",
          message: "Zapier Integration Failed",
        });
      }
    );
  };

  const handleCloseZapier = () => {
    setZapieropen(false);
  };

  const handleClickHubs = () => {
    setHubsopen(true);
  };

  async function loadSelf() {
    const self = await integrationApp.self.get();
    setSelf(self);
  }

  const handleCloseHubs = () => {
    setHubsopen(false);
  };

  const HandleappView = () => {
    setShowAppS(!showAppS);
  };

  const HandleIntegration = (key) => {
    setIntegrationKey(key);
    setConfigure(!configure);
  };

  useEffect(() => {
    if (zapieropen == true) {
      context.showLoading(false);
    }
  }, [zapieropen]);

  return (
    <Fragment>
      <div className="right-block">
        <div className="header">
          <p className="heading">Integrations</p>
          <p className="desc">Integrate with your favourite applications</p>
        </div>
        <div className="main-block chatbot_integration_block">
          {!configure ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div onClick={handleClickZapier} className="integration_box">
                    <p className="integration_title">
                      <img src={img1} />
                      Zapier
                    </p>
                    {/* <p className="integration_text">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut ali
                  </p> */}
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div onClick={handleClickOpen} className="integration_box">
                    <p className="integration_title">
                      <img src={img2} />
                      Mailchimp
                    </p>
                    {/* <p className="integration_text">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut ali
                  </p> */}
                  </div>
                </Grid>
                {/* <Grid
              item
              xs={4}
              onClick={() => {
                loadSelf();
              }}
            >
              <div className="integration_box">
                <p className="integration_title">
                  <img src={img3} />
                  Webhook
                </p>
              </div>
              {self && <pre>{JSON.stringify(self, null, 4)}</pre>}
            </Grid> */}
                {/* <Grid item xs={4}>
              <div onClick={handleClickHubs} className="integration_box">
                <p className="integration_title">
                  <img src={img4} />
                  Hubspot
                </p>
              </div>
            </Grid> */}
                <Grid item xs={4}>
                  <div className="integration_box" onClick={handleClickOpen}>
                    <p className="integration_title">
                      <img src={img5} />
                      Google Calendar
                    </p>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className="integration_box" onClick={HandleappView}>
                    <p className="integration_title">
                      <img src={apps} />
                      More Apps
                    </p>
                  </div>
                  {/* {self && <pre>{JSON.stringify(self, null, 4)}</pre>} */}
                </Grid>
              </Grid>
              {showAppS ? (
                <IntegrationsList HandleIntegration={HandleIntegration} />
              ) : (
                <></>
              )}
            </>
          ) : (
            <IntegrationPage
              integrationKey={integrationKey}
              HandleIntegration={HandleIntegration}
            />
          )}
        </div>
        <div className="footer">
          <Button variant="outlined" className="cancel-btn">
            Cancel
          </Button>
          <Button variant="outlined" className="save-btn">
            Save
          </Button>
        </div>
      </div>
      <Dialog
        open={hubsopen}
        onClose={handleCloseHubs}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-folder-model-popup-block"
      >
        <span className="cross-icon-block">
          <IconButton onClick={handleCloseHubs}>
            <img src={crossX} alt="" />
          </IconButton>
        </span>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">Connect to Hubspot</p>
              <div className="input-field-block hubspot_block">
                <Button variant="contained" className="zapier_btn hubspot_btn">
                  Install
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={zapieropen}
        onClose={handleCloseZapier}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-folder-model-popup-block"
      >
        <span className="cross-icon-block">
          <IconButton onClick={handleCloseZapier}>
            <img src={crossX} alt="" />
          </IconButton>
        </span>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">Zapier</p>
              <div className="input-field-block">
                <Button
                  variant="contained"
                  className="zapier_btn"
                  component="a"
                  href={zapierLink}
                  target="_blank"
                >
                  Click here to Integrate
                </Button>
                <p className="download_text">
                  Click here to download excel file (for google sheets zap)
                </p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => {
          handlePopupClose();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="knowdledge-base-folder-model-popup-block"
      >
        <span className="cross-icon-block">
          <IconButton
            onClick={() => {
              handlePopupClose();
            }}
          >
            <img src={crossX} alt="" />
          </IconButton>
        </span>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="desc-block">
              <p className="title">Mailchimp</p>
              <div className="input-field-block">
                <Form.Group className="" controlId="exampleForm.ControlInput1">
                  <Form.Control
                    type="text"
                    className="input-field"
                    placeholder="Enter Mailchimp API key"
                  />
                </Form.Group>

                <div className="btn-block">
                  <Button className="submit-btn" variant="contained">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default IntegrationComponent;
