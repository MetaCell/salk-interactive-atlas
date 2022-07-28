import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {Box, Popover} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {LaminaImageTypes} from "../../../utilities/constants";
import {bgLighter} from "../../../theme";
import IconButtonTooltip from "../../common/IconButtonTooltip";


const useStyles = makeStyles(t => ({
    iconsContainer: {
        display: 'flex',
        flex: 1,
        alignItems: "center"
    },
    icon: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: "50%"
    },
    filled: {
        background: bgLighter
    },
    contour: {
        border: "1px solid"
    },
    dashed: {
        border: "1px dashed"
    },
}));

// @ts-ignore
export default function LaminaStyleSelect({options, onClick, selected}) {
    const [selectedIndex, setSelectedIndex] = React.useState(selected);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();


    const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        setSelectedIndex(index);
        onClick(index);
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl);
    const optionSelected = options[selectedIndex]
    const icon = optionSelected === LaminaImageTypes.FILLED ? <span className={`${classes.icon} ${classes.filled}`}/> :
        optionSelected === LaminaImageTypes.CONTOUR ? <span className={`${classes.icon} ${classes.contour}`}/> :
            <span className={`${classes.icon} ${classes.dashed}`}/>
    return (
        <Box sx={{minWidth: 120}}>
            <IconButtonTooltip icon={icon} tooltip={"Lamina style"}
                               onClick={(event: { currentTarget: any; }) => setAnchorEl(event.currentTarget)}/>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={(event) => setAnchorEl(null)}
            >
                <MenuList>
                    {options.map((option: {}, index: number) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>
        </Box>
    );
}