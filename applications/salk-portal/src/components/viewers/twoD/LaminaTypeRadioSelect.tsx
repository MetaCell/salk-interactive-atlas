import * as React from 'react';
import {FormControl, ListItemText, MenuItem, Popover, Radio} from "@material-ui/core";
import {LaminaImageTypes} from "../../../utilities/constants";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {makeStyles} from "@material-ui/core/styles";
import {capitalize} from "../../../utilities/functions";
import {bgLighter} from "../../../theme";

const useStyles = makeStyles(t => ({
    iconsContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: "space-between",
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
    menuItem: {
        padding: t.spacing(1)
    },
    menuText: {
        display: 'flex',
        paddingLeft: t.spacing(1)
    },
}));

export default function LaminaTypeRadioSelect(props: {
    onChange: (value: string) => void
}) {
    const {onChange} = props
    const options = Object.values(LaminaImageTypes)
    const [optionSelected, setOptionSelected] = React.useState<string>(options[0]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();

    const handleChange = (value: string) => {
        setOptionSelected(value)
        onChange(value)
        setAnchorEl(null)
    };

    const icon = optionSelected === LaminaImageTypes.FILLED ? <span className={`${classes.icon} ${classes.filled}`}/> :
        optionSelected === LaminaImageTypes.CONTOUR ? <span className={`${classes.icon} ${classes.contour}`}/> :
            <span className={`${classes.icon} ${classes.dashed}`}/>

    const isOpen = Boolean(anchorEl);

    return (
        <div>
            <FormControl>
                <span className={classes.iconsContainer} onClick={(event) => setAnchorEl(event.currentTarget)}>
                    {icon}
                    <ArrowDropDownIcon fontSize='small'/>
                </span>
                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={(event) => setAnchorEl(null)}
                >
                    {options.map((option) => (
                        <MenuItem className={classes.menuItem}  key={option} value={option} onClick={(e) => handleChange(option)}>
                            <Radio checked={optionSelected.indexOf(option) > -1}/>
                            <ListItemText primaryTypographyProps={{ style: {
                                    lineHeight: '0.938rem',
                                    fontWeight: 400,
                                    fontSize: '0.75rem',
                                }}} className={classes.menuText} primary={capitalize(option)}/>
                        </MenuItem>
                    ))}
                </Popover>
            </FormControl>
        </div>
    );
}
