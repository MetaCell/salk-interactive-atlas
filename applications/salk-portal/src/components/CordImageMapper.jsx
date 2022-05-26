import React, {useCallback, useEffect, useRef} from 'react';
// @ts-ignore
import CORD from "../assets/images/cord.png";
import {ImageMap} from "@qiuz/react-image-map";
import {makeStyles} from "@material-ui/core/styles";

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
    const {segments, selected, onChange, onWheel} = props
    const widthPercentage = 100 / (segments.length)
    const generateArea = (index) => {
        return {
            left: `${index * widthPercentage}%`,
            height: '100%',
            width: `${widthPercentage}%`,
            style: index === selected ?
                {
                    background: "linear-gradient(to bottom, rgba(123,97,255,0) 0%, rgba(123,97,255,0) 85%, rgba(123,97,255,0.8) 85%, rgba(123,97,255,0.8) 100%)"
                } : null
        }
    }

    const onMapClick = (area, index) => {
        onChange(index)
    }

    const mapArea = segments.map((s, i) => generateArea(i));

    useEffect(() => {
        // @ts-ignore
        ref.current.addEventListener("wheel", (e) => onWheel(e))
    }, [ref])


    return (
        <div className={classes.imageMap} ref={ref}>
            <ImageMap src={CORD} map={mapArea} onMapClick={onMapClick}/>
        </div>

    )
}

export default CordImageMapper;