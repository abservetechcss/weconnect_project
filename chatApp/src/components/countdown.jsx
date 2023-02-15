import React, { useContext, useState, useEffect } from 'react'
import { WebchatContext } from "../contexts";

export const CountDown = props => {
  const { sendInput, webchatState } = useContext(WebchatContext);
  const [count, setCount] = useState(webchatState.session.counter);
  
  useEffect(() => {
    /*
    counter is provided in localstorage because, on open close of chat counter disconnects
    */
        setCount(webchatState.session.counter);
    }, [webchatState.session.counter])
    
  return (
      <>
        {count}
      </>
  )
}
