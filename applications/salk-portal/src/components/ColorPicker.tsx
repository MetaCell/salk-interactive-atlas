import React, {useState} from 'react';
import {Box} from "@material-ui/core";
import {ChromePicker} from 'react-color';

// @ts-ignore
const ColorPicker = ({selectedColor, handleColorChange}) => {
    const [background, setBackground] = useState(selectedColor);

    const onChangeCompleteHandler = async (color: string) => {
        await handleColorChange(color)
        setBackground(color)
    }

    return (
        <Box className="picker">
            <ChromePicker
                color={background}
                onChangeComplete={(color, event) => onChangeCompleteHandler(color.hex)}
            />
        </Box>
    );
}

export default ColorPicker;