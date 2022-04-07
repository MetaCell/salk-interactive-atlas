import React, {useState} from 'react';
import {Box} from "@material-ui/core";
import {ChromePicker, ColorResult} from 'react-color';

// @ts-ignore
const ColorPicker = ({selectedColor, handleColorChange}) => {
    const [background, setBackground] = useState(selectedColor);

    const onChangeCompleteHandler = async (color: ColorResult) => {
        await handleColorChange(color, color.rgb.a)
        setBackground(color.rgb)
    }

    return (
        <Box className="picker">
            <ChromePicker
                color={background}
                onChangeComplete={(color, event) => onChangeCompleteHandler(color)}
            />
        </Box>
    );
}

export default ColorPicker;