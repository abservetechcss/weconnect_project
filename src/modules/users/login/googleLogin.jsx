import React from 'react';
import google from "../../../assets/images/google.png";
import Button from "@mui/material/Button";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { getGoogleLoginInfo } from "../login/server/LoginServer.js";

function LoginHooks(props) {
  const onSuccess = async (res) => {
    console.log("res", res);
    getGoogleLoginInfo(res.access_token, (res)=>{
        console.log("userInfo", res);
        props.onSuccess(res);
    },
    ()=>{
        props.onFailure(res);
    }); 
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    props.onFailure(res);
  };

  const login = useGoogleLogin({
    onSuccess,
    onFailure,
  });

  return (
        <Button
          variant="contained"
          className="google_btn"
          type="button"
          onClick={login}
        >
          {" "}
          <img alt="" src={google} /> Login with Google
        </Button>
  );
}

function GoogleLoginWrapper(props) {
    return ( <GoogleOAuthProvider clientId={props.clientId}>
        <LoginHooks {...props} />
    </GoogleOAuthProvider>)
}


export default GoogleLoginWrapper;