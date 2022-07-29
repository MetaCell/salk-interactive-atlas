import React, {useState} from 'react';
import {Box, FormControl, Popover} from "@material-ui/core";
import {LaminaImageTypes} from "../../../utilities/constants";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {makeStyles} from "@material-ui/core/styles";
import {getRGBAFromHexAlpha, getRGBAString} from "../../../utilities/functions";
import ColorPicker from "../../common/ColorPicker";
import LaminaStyleSelect from "./LaminaStyleSelect";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import IconButtonTooltip from "../../common/IconButtonTooltip";
import { DARK_GREY_SHADE } from '../../../models/Atlas';

const useStyles = makeStyles(t => ({
    inlineContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    menuItem: {
        padding: t.spacing(1)
    },
    menuText: {
        display: 'flex',
        paddingLeft: t.spacing(1)
    },
    colorPickerBackground: {
        backgroundColor: 'rgb(60, 62, 64)'
    },
    square: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '0.1rem',
    },
}));

export default function LaminaPicker(props: {
    onLaminaStyleChange: (value: string) => void,
    onLaminaBaseColorChange: (value: string) => void
    baseColor: string
}) {
    const {onLaminaStyleChange, onLaminaBaseColorChange, baseColor} = props
    const options = Object.values(LaminaImageTypes)
    const [indexSelected, setIndexSelected] = useState<number>(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    const handleLaminaStyleChange = (index: number) => {
        setIndexSelected(index)
        onLaminaStyleChange(options[index])
    };

    const handleLaminaBaseColorChange = (color: string) => {
        onLaminaBaseColorChange(color)
    }

    const isOpen = Boolean(anchorEl);
    const rgbaColor = getRGBAFromHexAlpha(baseColor, 1)
    return (
        <div>
            <FormControl>
                <span className={classes.inlineContainer} onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <Box
                        style={{backgroundColor: getRGBAString(rgbaColor)}}
                        component="span"
                        className={classes.square}/>
                    <ArrowDropDownIcon fontSize='small'/>
                </span>
                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={(event) => setAnchorEl(null)}
                >
                    <ColorPicker selectedColor={rgbaColor}
                                 disableAlpha={ true }
                                 handleColorChange={(color: string) =>
                                     handleLaminaBaseColorChange(color)
                                 }/>
                    <Box className={`${classes.colorPickerBackground} ${classes.inlineContainer}`}>
                        <LaminaStyleSelect options={options} onClick={(o: number) => handleLaminaStyleChange(o)}
                                           selected={indexSelected}/>
                        <IconButtonTooltip icon={<SettingsBackupRestoreIcon/>} tooltip={"Reset colors"}
                                           onClick={() => handleLaminaBaseColorChange(DARK_GREY_SHADE)}/>
                    </Box>
                </Popover>
            </FormControl>
        </div>
    );
}