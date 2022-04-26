import React from 'react';
// @ts-ignore
import CORD from "../assets/images/cord.png";
import { ImageMap} from "@qiuz/react-image-map";

const CordImageMapper = (props) => {
    const {segments, selected, onChange} = props
    const widthPercentage = 100 / (segments.length)
    const generateArea = (index) => {
        return {
                left: `${index * widthPercentage}%`,
                height: '100%',
                width: `${widthPercentage}%`,
                style: segments[index] === selected ? {background: "rgba(123,97,255,0.8)"} : null
            }

    }
    const onMapClick = (area, index) => {
        onChange(segments[index])
    }
    const mapArea = segments.map((s, i) => generateArea(i));

    return (
        <ImageMap src={CORD} map={mapArea} onMapClick={onMapClick}/>
    )
}

export default CordImageMapper;