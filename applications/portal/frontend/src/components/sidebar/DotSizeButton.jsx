import React from "react";
import { IconButton } from "@material-ui/core";
import { SliderIcon } from "../icons";


export const DotSizeButton = ({ dotSizeId, onClickFunc}) => {
  return (
    <IconButton
      edge="end"
      color="inherit"
      aria-describedby={dotSizeId}
      onClick={onClickFunc}
      className='slider-icon'
    >
      <SliderIcon style={{ height: '0.90rem' }} />
    </IconButton>
  );
};