import React, { useContext, useEffect, useState, useMemo } from 'react'

import { Reply, Text } from '../components';
import { RequestContext, WebchatContext } from "../contexts";
import { v4 as uuidv4 } from 'uuid'


export const CustomReply = props => {
    const [isRendered, setRenderStatus] = useState(false)
    const {
        webchatState,
        addMessage,
        updateReplies,
        getThemeProperty,
    } = useContext(WebchatContext);
    let replies = false;
    if(isRendered===false)
    replies = React.Children.toArray(props.children);
    // const currentDateString = () => new Date().toISOString()

    useEffect(() => {
        if (isRendered === false) {
            updateReplies(replies);
            setRenderStatus(true);
        }
        replies = false;
        return () => {
            replies = false;
            updateReplies(replies)
        };
    }, []);
    
    return null;
}
