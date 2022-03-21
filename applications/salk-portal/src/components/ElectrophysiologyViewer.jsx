import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {canvasBg} from "../theme";
const useStyles = makeStyles({
    placeholder: {
        background: canvasBg,
        height: "100%",
        margin: 0,
    },
});

const ElectrophysiologyViewer = () => {
    const classes = useStyles();
    return <p className={classes.placeholder}>Placeholder</p>;
};

export default ElectrophysiologyViewer