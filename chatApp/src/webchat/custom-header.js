import React from "react";
import Icon from "../assets/r2d2-logo.png";

import { staticAsset } from "../util/environment";

export const CustomHeader = () => {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #184BA5 0%, #5E90C3 100%)",
        borderRadius: "20px 20px 0px 0px",
        // borderRadius: "28px 28px 0px 0px",
        height: 70,
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        style={{ margin: "0px 12px", width: 38, color: "white" }}
        src={staticAsset(Icon)}
      />
      <h1
        style={{
          fontFamily: "Noto Sans JP",
          src: "https://fonts.googleapis.com/css?family=Noto+Sans+JP",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 16,
          lineHeight: 10,
          color: "#ffffff",
          width: "80%",
        }}
      >
        My customized header
      </h1>
      <div
        style={{
          cursor: "pointer",
          fontSize: 16,
          color: "white",
          width: "30%",
          justifyContent: "center",
          display: "flex",
        }}
        onClick={() => {
          Botonic.close();
        }}
      >
        ✕
      </div>
    </div>
  );
};
