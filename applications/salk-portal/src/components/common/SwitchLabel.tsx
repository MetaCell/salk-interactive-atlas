import {MAX_STR_LENGTH_SIDEBAR, POPULATION_FINISHED_STATE} from "../../utilities/constants";
import {Tooltip, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    label: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
});
// @ts-ignore
const SwitchLabel = ({label}) => {
    const classes = useStyles();
    return (
        <Tooltip title={label} placement="top">
            <Typography className={classes.label}>
                {label.substr(0, MAX_STR_LENGTH_SIDEBAR)}
            </Typography>
        </Tooltip>
    )
}

export default SwitchLabel;
