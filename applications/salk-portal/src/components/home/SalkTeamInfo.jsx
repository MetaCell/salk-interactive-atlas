import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Divider } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { headerBorderColor, headerButtonBorderColor, secondaryColor, inputFocusShadow, switchActiveColor, logoHoverbg, textDisabled, sidebarTextColor } from "../../theme";
import EDIT from "../../assets/images/icons/edit.svg";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import LOGO from "../../assets/images/icons/salk-logo.svg";
import USER from "../../assets/images/icons/user.svg";
import ADD from "../../assets/images/icons/add_primary.svg";
import ADD_WHITE from "../../assets/images/icons/add_white.svg";

const useStyles = makeStyles(() => ({
  members: {
    '& h3': {
      fontWeight: '500',
      marginBottom: '1.25rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.01em',
      color: headerButtonBorderColor,
    },

    '& .MuiTypography-root': {
      fontWeight: 400,
      fontSize: '0.8125rem',
      lineHeight: '1.5rem',
      letterSpacing: '-0.0025em',
      color: headerButtonBorderColor,

      '&.MuiTypography-body2': {
        color: textDisabled,
        marginLeft: '0.3125rem'
      },
    },

    '& .MuiListItem-container': {
      display: 'flex',
      alignItems: 'center',
    },

    '& .MuiListItemSecondaryAction-root': {
      position: 'static',
      transform: 'none',
      flexShrink: 0,
      paddingLeft: '0.5rem',
    },

    '& .MuiButton-text': {
      padding: 0,
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      textTransform: 'none',
      letterSpacing: '0.01em',
      color: switchActiveColor,

      '&:hover': {
        backgroundColor: 'transparent',
      },
    },

    '& .MuiList-padding': {
      padding: 0,
      marginBottom: '1.25rem',
      '& li + li': {
        marginTop: '0.5rem',
      }
    },

    '& .MuiListItem-gutters': {
      padding: 0,
    },

    '& .MuiListItem-secondaryAction': {
      padding: 0,
    },

    '& .MuiListItemText-root': {
      margin: 0,
      display: 'flex',
      alignItems: 'center',

      '& + .MuiListItemText-root': {
        flex: 'none'
      },
    },

    '& .MuiListItemAvatar-root': {
      minWidth: '0.0625rem',
      paddingRight: '0.5rem',
    },

    '& .MuiListItem-root.Mui-disabled': {
      opacity: 0.4,
    },

    '& .MuiAvatar-root': {
      width: '1.5rem',
      height: '1.5rem',
    },
  },

  addIcon: {
    marginRight: '0.5rem',
  },

  drawer: {
    '& .MuiDivider-root': {
      backgroundColor: headerBorderColor,
      margin: '1.25rem 0',
    }
  },

  header: {
    '& .MuiTextField-root': {
      marginBottom: '1.25rem',

      '& .MuiInputBase-root:not(.MuiOutlinedInput-multiline)': {
        borderRadius: 0,
        '& .MuiOutlinedInput-input': {
          fontWeight: 500,
          fontSize: '1.25rem',
          height: 'auto',
          lineHeight: '2rem',
          padding: 0,
          color: headerButtonBorderColor,
        },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          boxShadow: `0 0.125rem 0 0 ${inputFocusShadow}`,
        },

        '& .MuiOutlinedInput-notchedOutline': {
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        },
      },
    },

    '& .MuiButton-root': {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.01em',
      color: headerButtonBorderColor,

      '&.MuiButton-contained': {
        color: secondaryColor
      }
    },
    '& h3': {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: '2rem',
      color: headerButtonBorderColor,
    },

    '& label': {
      height: '100%',
    },

    '& .MuiTypography-root': {
      marginBottom: '1.25rem',
      display: 'block',
    },

    '& .MuiTypography-body2': {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      color: headerButtonBorderColor,
    },

    '& span.MuiTypography-body2': {color: sidebarTextColor,},
  },

  logo: {
    marginBottom: '1.25rem',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    '& .MuiBox-root': {
      background: `linear-gradient(0deg, ${logoHoverbg}, ${logoHoverbg})`,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'center',
      height: '100%',
    },

    "& input": {
      display: 'none',
    },
  },

  sendInvite: {
    '& .MuiButton-root': {
      flexShrink: 0,
    },
    '& .MuiFormControl-root': {
      margin: '0 0.5rem 0 0'
    },
  },
}));

export const SalkTeamInfo = (props) => {
  const { infoDrawer, closeDrawer } = props;
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [inviteMembers, setInviteMembers] = useState(false);
  const toggleEditMode = () => {
    setEditMode((prevEdit) => !prevEdit);
  }
  const dummyTeamInfo = {
    team: 'Salk Institute',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis.',
    totalMembers: '154 members, 236 experiments'
  };
  return (
    <Drawer anchor="right" className={classes.drawer} open={infoDrawer} onClose={closeDrawer}>
      { !editMode ? (
        <Box className={classes.header}>
          <Box className={classes.logo} style={{ backgroundImage: `url(${LOGO})` }} />

          <Typography component="h3">{dummyTeamInfo?.team}</Typography>

          <Typography component={"p"} variant="body2">{dummyTeamInfo?.description}</Typography>

          <Typography component={"span"} variant="body2">{dummyTeamInfo?.totalMembers}</Typography>

          <Button fullWidth variant="outlined" onClick={toggleEditMode}>Edit team</Button>
        </Box>
      ) : (
        <Box className={classes.header}>
          <Box className={classes.logo} style={{ backgroundImage: `url(${LOGO})` }}>
            <Typography component={"label"}>
              <input type={"file"} />
              <Box>
                <img src={EDIT} alt="edit" />
              </Box>
            </Typography>
          </Box>

          <TextField
            fullWidth
            defaultValue={dummyTeamInfo?.team}
            variant="outlined"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            defaultValue={dummyTeamInfo?.description}
            variant="outlined"
          />

          <Typography component={"span"} variant="body2">{dummyTeamInfo?.totalMembers}</Typography>

          <Button fullWidth variant="contained" disableElevation onClick={toggleEditMode}>Save changes</Button>
        </Box>
      )}
      <Divider />
      <Box className={classes.members}>
        <Typography component="h3">Members</Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={USER} />
            </ListItemAvatar>
            <ListItemText primary="Ben Stern" secondary="(You)" />
            <ListItemSecondaryAction>
              <Button disableRipple>
                Leave team
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <Avatar src={USER} />
            </ListItemAvatar>
            <ListItemText primary="Ben Stern" />
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <Avatar src={USER} />
            </ListItemAvatar>
            <ListItemText primary="Ben Stern" />
          </ListItem>

          <ListItem disabled>
            <ListItemAvatar>
              <Avatar src={USER} />
            </ListItemAvatar>
            <ListItemText primary="Ben Stern" />
            <ListItemText primary="Pending" />
          </ListItem>
        </List>

        {!inviteMembers ? (
          <Button disableRipple onClick={() => setInviteMembers(true)}>
            <img className={classes.addIcon} src={ADD} alt="add" />
            Invite Members
          </Button>
        ) : (
            <Box className={classes.sendInvite} display={'flex'} alignItems="center">
              <img className={classes.addIcon} src={ADD_WHITE} alt="add" />
              <TextField variant="outlined" placeholder="Email address" />
              <Button variant="contained" onClick={() => setInviteMembers(false)}>
                Send Invite
              </Button>
            </Box>
        )}

      </Box>
    </Drawer>
  );
};