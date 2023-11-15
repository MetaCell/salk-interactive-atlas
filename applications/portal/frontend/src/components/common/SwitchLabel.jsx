import { MAX_STR_LENGTH_SIDEBAR } from "../../utilities/constants";
import { Tooltip, Typography, Box } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
    label: {
        justifyContent: 'space-between',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
        textOverflow: 'ellipsis'
    },
});
// @ts-ignore
const SwitchLabel = ({ label, isParentLabel }) => {
    const classes = useStyles();
    return (
        <Tooltip title={label} placement="top">
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <div style={{ display: 'flex' }}>
                    <Typography className={`${classes.label} ${isParentLabel ? 'ellipsis-parent' : 'ellipsis'}`}>
                        {label.substr(0, MAX_STR_LENGTH_SIDEBAR)}
                    </Typography>
                    {
                        isParentLabel && <span style={{ color: 'rgba(255, 255, 255, 0.40)', fontWeight: 400, fontSize: '0.65rem' }}> -parent</span>
                    }
                </div>
            </Box>
        </Tooltip>
    )
}

export default SwitchLabel;
