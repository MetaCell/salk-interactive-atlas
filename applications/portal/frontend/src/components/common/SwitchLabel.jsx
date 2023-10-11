import { MAX_STR_LENGTH_SIDEBAR, POPULATION_FINISHED_STATE } from "../../utilities/constants";
import { Tooltip, Typography, Box } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavigationControlIcon from "../../assets/images/icons/navigation_control_icon.svg"


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
                <Typography className={`${classes.label} ellipsis`}>
                    {label.substr(0, MAX_STR_LENGTH_SIDEBAR)}
                    {
                        isParentLabel && <span style={{ color: 'rgba(255, 255, 255, 0.40)', fontWeight: 400 }}> - parent</span>
                    }
                </Typography>
                <img src={NavigationControlIcon} className="nav_control" alt='' style={{ marginRight: '0.5rem' }} />
            </Box>
        </Tooltip>
    )
}

export default SwitchLabel;