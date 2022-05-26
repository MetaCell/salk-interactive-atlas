import React from 'react';
// @ts-ignore
import CORD from "../assets/images/cord.png";
import { ImageMap} from "@qiuz/react-image-map";
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
    const {segments, selected, onChange} = props
    const widthPercentage = 100 / (segments.length)
    const generateArea = (index) => {
        return {
                left: `${index * widthPercentage}%`,
                height: '15%',
                width: `${widthPercentage}%`,
                top: "100%",
                style: segments[index] === selected ? {background: "rgba(123,97,255,0.8)"} : null
            }

    }
    const onMapClick = (area, index) => {
        onChange(segments[index])
    }
    const mapArea = segments.map((s, i) => generateArea(i));

    return (
        <ImageMap className={classes.imageMap} src={CORD} map={mapArea} onMapClick={onMapClick}/>
    )
}

export default CordImageMapper;