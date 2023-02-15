

import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const BackDrop = styled(motion.div)`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;
background: rgba(0,0,0,.5);
display: flex;
align-items: center;
justify-content: center;
overflow-y: hidden;
`

const Backdrop = ({ children, onClick }) => {

  return (
    <BackDrop
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </BackDrop>
  );
};

export default Backdrop;