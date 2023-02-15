import React, { useEffect } from "react";

const Location = (props) => {
  const location = JSON.parse(props.location); 
  const lat = parseFloat(location.lat);
  const long = parseFloat(location.long);
    const key = "AIzaSyCt2u_2h3LYoYZXvD-65Fccueaxo7ag234";
    return (
      <div className="location_pinned_section">
          <div className="location_pinned_block">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${key}&center=${lat},${long}&q=${lat},${long}&zoom=12`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
            <div
              style={{
                background: "white",
                color: "black",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "700",
                padding: "0 0 5px 10px",
              }}
            >
              Pinned Location
            </div>
          </div>
      </div>
    );
};

export default Location;