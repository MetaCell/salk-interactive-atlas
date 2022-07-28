import React from "react";
import {IconButton, Tooltip} from "@material-ui/core";

// @ts-ignore
export default function IconButtonTooltip({icon, tooltip, onClick}) {
    return (
        <Tooltip title={tooltip}>
            <IconButton onClick={(event) => onClick(event)}>
                {icon}
            </IconButton>
        </Tooltip>
    );
}