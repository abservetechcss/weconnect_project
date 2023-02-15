import React, {useCallback} from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import LoadingButton from "react-bootstrap-button-loader";

const CaptchaButton = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
          console.log('Execute recaptcha not yet available');
          return;
        }
    
        const token = await executeRecaptcha('yourAction');
        // Do whatever you want with the token
        props.onSubmit(token);

      }, [executeRecaptcha]);

    return (<LoadingButton
        type="button"
        loading={props.loading}
        onClick={handleReCaptchaVerify}
        variant="contained"
        className="green_btn registration_btn"
        style={{ color: "#ffff" }}
      >
        Start using WeConnect.chat
      </LoadingButton>);

}

export default CaptchaButton;