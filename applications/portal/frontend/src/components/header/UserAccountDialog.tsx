import * as React from "react";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, headerBg, secondaryColor, switchActiveColor } from "../../theme";
import Modal from "../common/BaseDialog";

const useStyles = makeStyles(() => ({
  myAccount: {
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

export const UserAccountDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose, user } = props;
  const notificationOptions = ['A new file is shared with me', 'Invitations to a new team', 'Clones of my experiments', 'News and updates'];
  return (
    <Modal open={Boolean(open)} handleClose={handleClose} title="My account">
      <Box display="flex" className={classes.myAccount}>
        <Avatar title={user?.username} src={user?.avatarUrl ? user.avatarUrl : null} />
        <Box className="details">
          <Box className="detail-block">
            <Typography component="h4">Name</Typography>
            <Typography component={"p"}>{`${user?.firstName} ${user?.lastName}`}</Typography>
            {/* <Button disableRipple="true" variant="text">Edit</Button> */}
          </Box>

          <Box className="detail-block">
            <Typography component="h4">Email</Typography>
            <Typography component={"p"}>{user?.email}</Typography>
            {/* <Button disableRipple="true" variant="text">Edit</Button> */}
          </Box>

          {/* <Box className="detail-block">
            <Typography component="h4">Password</Typography>
            <Typography component={"p"}>●●●●●●●●●●●●●</Typography>
            <Button disableRipple="true" variant="text">Change password</Button>
          </Box> */}

          {/* <Divider />
          <Box className="detail-block">
            <Typography component="h4">Notifications by email</Typography>
            {
              notificationOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={<Switch />}
                  label={option}
                  disabled
                />
              ))
            }
          </Box>
          <Divider />

          <Button variant="outlined" disabled>Delete my account</Button> */}
        </Box>
      </Box>
    </Modal>
  );
};
