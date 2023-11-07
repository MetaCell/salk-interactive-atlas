import React from "react";
import { IconButton } from "@material-ui/core";
import { SliderIcon } from "../icons";


export const DotSizeButton = ({ onClickFunc, setPopulationRefPosition }) => {
  const myRef = React.useRef(null);
  return (
    <IconButton
      edge="end"
      color="inherit"
      onClick={() => {
        onClickFunc()
        setPopulationRefPosition(myRef.current.getBoundingClientRect())
      }}
      className='slider-icon'
      ref={myRef}
    >
      <SliderIcon style={{ height: '0.90rem' }} />
    </IconButton>
  );
};