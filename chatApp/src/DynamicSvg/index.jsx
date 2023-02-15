import React, { useEffect, useState, useRef, useContext } from 'react';
import Controller from './controller';

const controller = new Controller();

export const ExternalSVG = (props) => {
    
    const { applyStyles, applyProps, src, onError } = props;


    const [svg, setSVG] = useState(null);
    const [render, setRender] = useState(null);

    //Fetch and set the svg
    useEffect(() => {

        
            try {
                let url = src;
                if(src && typeof src==='string' && src.toString().substring(0,4)!=='http') {
                    url = process.env.REACT_APP_ICONS+src+".svg";
                }

                controller.fetchSVG(url).then((data) => setSVG(data))
            }
            catch (err) {
                if (onError) {
                    onError(err)
                }
                else {
                    console.error(err)
                }
            }
        // for now we don't use this feature
        // if (src.includes('<svg')) {
        //     setSVG(src)
        // }

    }, [src]);

    //Object equality check prev & current props
    const prevApplyProps = useRef(applyProps);
    const prevApplyStyles = useRef(applyStyles);
    const shouldRedraw = JSON.stringify(prevApplyProps.current) !== JSON.stringify(applyProps) || JSON.stringify(prevApplyStyles.current) !== JSON.stringify(applyStyles);

    useEffect(() => {
        prevApplyProps.current = applyProps;
        prevApplyStyles.current = applyStyles;
    }, [applyProps, applyStyles])

    //Create render
    useEffect(() => {

        if (svg && svg.length && svg.includes('<svg') || shouldRedraw) {
            try {
                const newSvg = svg.replace(/<style.*?>.*?<\/style>/ig,'');
                const converted = controller.convert(newSvg, { applyProps, applyStyles });
                setRender(converted)
            }
            catch (err) {
                if (onError) {
                    onError(err)
                }
                else {
                    console.error(err)
                }
            }
        }
    }, [svg, applyProps, applyStyles]);



    return (<>{render}</>)
}

export default ExternalSVG;