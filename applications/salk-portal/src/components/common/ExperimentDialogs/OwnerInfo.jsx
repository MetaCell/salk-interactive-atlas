import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  Avatar,
} from "@material-ui/core";
import { headerButtonBorderColor, sidebarTextColor } from "../../../theme";
import USER from "../../../assets/images/icons/user.svg";

const useStyles = makeStyles(() => ({
  ownerInfo: {
    '& .MuiTypography-root': {
      fontWeight: '400',
      fontSize: '0.75rem',
      lineHeight: '0.9375rem',
      color: headerButtonBorderColor,
    },

    '& .MuiAvatar-root': {
      width: '1.5rem',
      height: '1.5rem',
      marginRight: '0.8rem',
    },

    '& span.MuiTypography-root': {color: sidebarTextColor,},
  },
}));

export const OwnerInfo = (props) => {
  const classes = useStyles();
  const { user } = props;

  return (
    <Box display="flex" alignItems={"center"} className={classes.ownerInfo}>
      <Avatar title={user?.username} src={user.avatarUrl ? user.avatarUrl : USER} />
      <Typography>
        {`${user?.firstName} ${user?.lastName}`} <Typography component="span">(You)</Typography>
      </Typography>
    </Box>
  );
};