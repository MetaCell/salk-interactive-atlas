import React, {useState} from 'react';
import {Box} from "@material-ui/core";
import {ChromePicker, ColorResult} from 'react-color';

// @ts-ignore
const ColorPicker = ({selectedColor, handleColorChange, ...other}) => {
    const [background, setBackground] = useState(selectedColor);

    const onChangeCompleteHandler = async (color: ColorResult) => {
        await handleColorChange(color.hex, color.rgb.a)
        setBackground(color.rgb)
    }

    return (
        <Box className="picker">
            <ChromePicker
                color={background}
                onChangeComplete={(color: any, event: any) => onChangeCompleteHandler(color)}
                {...other}
            />
        </Box>
    );
}

export default ColorPicker;