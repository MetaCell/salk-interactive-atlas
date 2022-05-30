import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import CORD from "../assets/images/cord.png";
import {ImageMap} from "@qiuz/react-image-map";
import {makeStyles} from "@material-ui/core/styles";
import {mod} from "../utilities/functions";

const useStyles = makeStyles({
    imageMap: {
        margin: "2rem",
        width: "60%!important",
        cursor: "pointer"
    },
});

const CordImageMapper = (props) => {
    const classes = useStyles();
    const ref = useRef(null);
    const {segments, selected, onChange} = props
    const [cursor, setCursor] = useState(selected)
    // Needed to access react state in event listeners
    const cursorRef = useRef(selected);
    const widthPercentage = 100 / (segments.length)
    const generateArea = (index) => {
        return {
            left: `${index * widthPercentage}%`,
            height: '100%',
            width: `${widthPercentage}%`,
            style: index === cursor ?
                {
                    background: "linear-gradient(to bottom, rgba(123,97,255,0) 0%, rgba(123,97,255,0) 85%, rgba(123,97,255,0.8) 85%, rgba(123,97,255,0.8) 100%)"
                } : null
        }
    }

    const onMapClick = (area, index) => {
        onChange(index)
    }

    const mapArea = segments.map((s, i) => generateArea(i));

    function scrollStop (element, callback, refresh = 300) {

        // Make sure a valid callback was provided
        if (!callback || typeof callback !== 'function') return;

        // Setup scrolling variable
        let isScrolling;

        // Listen for wheel events
        element.addEventListener('wheel', function (event) {
            const direction = Math.sign(event.deltaY) * -1
            const nextCursor = mod(cursorRef.current + direction, segments.length)
            setCursor(nextCursor)
            cursorRef.current = nextCursor

            // Clear our timeout throughout the scroll
            clearTimeout(isScrolling);

            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(() => callback(cursorRef.current), refresh);

        }, false);

    }

    useEffect(() => {
        scrollStop(ref.current,(e) => onChange(e) )
    }, [ref])

    useEffect(() => {
        setCursor(selected)
        cursorRef.current = selected
    }, [selected])


    return (
        <div className={classes.imageMap} ref={ref}>
            <ImageMap src={CORD} map={mapArea} onMapClick={onMapClick}/>
        </div>

    )
}

export default CordImageMapper;