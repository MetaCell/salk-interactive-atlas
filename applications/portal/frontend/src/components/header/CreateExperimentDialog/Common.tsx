import {makeStyles} from "@material-ui/core";
import {filesBg, headerButtonBorderColor, switchActiveColor} from "../../../theme";
// @ts-ignore
import UPLOAD from "../../../assets/images/icons/upload.svg";
import React from "react";

export const common = makeStyles(() => ({
    fileLabel: {
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        color: headerButtonBorderColor,
        marginBottom: '.25rem',
    },
    errorBorder: {
        borderColor: "#f44336",
        '&:focus-within': {
            borderColor: '#7b61ff'
        },
    },
    progress: {
        width: '100%',
        padding: '0.75rem',
        background: filesBg,
        borderRadius: '0.375rem',

        '& .MuiButton-text': {
            padding: 0,
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.01em',
            color: switchActiveColor,
            display: 'block',
            margin: '0 auto',
            '&:hover': {
                backgroundColor: 'transparent'
            },
        },

        '& .MuiTypography-root': {
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.01em',
            color: headerButtonBorderColor,
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '& img': {
                marginRight: '0.25rem'
            },
        },
    },
}));

export function UploadIcon() {
    return <img src={UPLOAD} alt="upload"/>
}
