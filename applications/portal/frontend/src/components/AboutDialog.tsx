import Modal from "./common/BaseDialog";

import * as React from "react";
import {Avatar, Box, Divider, Link, makeStyles, Typography} from "@material-ui/core";
import LOGO from "../assets/images/icons/about-logo.svg";
import METACELL from "../assets/images/powered_by_metacell.svg";
import {headerBorderColor, headerButtonBorderColor, secondaryColor, switchActiveColor} from "../theme";

const useStyles = makeStyles(() => ({
    about: {
        '& .MuiAvatar-root': {
            width: '5rem',
            height: '5rem',
        },
        '& .details': {
            flexGrow: 1,
            paddingLeft: '1rem',

            '& .detail-block + .detail-block': {
                marginTop: '1.5rem',
            },

            '& .MuiButton-text': {
                fontWeight: 400,
                padding: 0,
                fontSize: '0.75rem',
                lineHeight: '0.9375rem',
                minWidth: '0.0625rem',
                color: switchActiveColor,
                textTransform: 'none',

                '&:hover': {
                    background: 'transparent'
                },
            },

            '& .MuiTypography-root': {
                fontSize: '0.75rem',
                lineHeight: '0.9375rem',
                fontWeight: 600,
                color: secondaryColor,
                marginBottom: '0.5rem',
            },

            '& .MuiFormControlLabel-root': {
                margin: '0.5rem 0 0',
                display: 'flex',
            },

            '& .MuiButton-outlined': {
                fontWeight: 500,
                fontSize: '0.75rem',
                lineHeight: '1rem',
                letterSpacing: '0.01em',
                color: headerButtonBorderColor,
                borderColor: headerButtonBorderColor,
                textTransform: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
            },

            '& .MuiFormControlLabel-label': {
                marginBottom: 0,
                marginLeft: '0.5rem',
                color: headerButtonBorderColor,
                fontWeight: 400,
            },

            '& p': {
                '&.MuiTypography-root': {
                    color: headerButtonBorderColor,
                    fontWeight: 400,
                },
            },

            '& .MuiDivider-root': {
                margin: '1.5rem 0',
                borderColor: headerBorderColor
            },
        },
    },

}));

export const AboutDialog = (props: any) => {
    const {open, handleClose} = props;
    const classes = useStyles();

    return (
        <Modal open={Boolean(open)} handleClose={handleClose} title="About Salk Mouse Cord Atlas">
            <Box display="flex" className={classes.about}>
                <Avatar alt="logo" src={LOGO}/>
                <Box className="details">
                    <Box className="detail-block">
                        <Typography component="h4">Investigator</Typography>
                        <Typography>Salk Mouse Cord Atlas was created for the Goulding Lab at Salk Institute in La Jolla
                            (San Diego, CA)</Typography>
                        <Link href={'http://goulding.salk.edu/'} target={'_blank'}>Learn more about the Goulding
                            Lab</Link>
                    </Box>
                    <Box className="detail-block">
                        <Typography component="h4">Funder</Typography>
                        <Typography>Salk Mouse Cord Atlas has been funded by the National Institutes of Health
                            (NIH)</Typography>
                        <Link href={'https://www.nih.gov/'} target={'_blank'}>Learn more about NIH</Link>
                    </Box>
                    <Divider/>
                    <Typography>v1.0.0-beta.1</Typography>
                    <Link href={'https://www.metacell.us/'} target={'_blank'}>
                        <img src={METACELL} alt={"Powered by MetaCell"}/>
                    </Link>
                </Box>

            </Box>
        </Modal>
    );
}