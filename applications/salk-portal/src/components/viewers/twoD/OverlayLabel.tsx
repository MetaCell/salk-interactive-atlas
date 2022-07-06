import {Typography} from "@material-ui/core";
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
        color: "white"
    },
});
// @ts-ignore
const OverlayLabel = ({label}) => {
    const classes = useStyles();
    return (
            <Typography className={classes.label}>
                {label}
            </Typography>
    )
}

export default OverlayLabel;
