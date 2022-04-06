import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import PropTypes from 'prop-types';
import { canvasIconColor, cardTextColor, headerBorderColor, headerButtonBorderColor, sidebarBadgeBg, switchActiveColor, textDisabled } from "../../../theme";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import USER from "../../../assets/images/icons/user.svg";
import DOWN from "../../../assets/images/icons/down.svg";

const userRoles = ['Viewer', 'Editor'];

const styles = {
  fontWeight: 500,
  fontSize: '0.75rem',
  lineHeight: '1rem',
  letterSpacing: '0.01em',
}

const useStyles = makeStyles(() => ({
  tabs: {
    padding: '0.125rem 0.25rem 0.125rem 1rem',
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    height: '2.75rem',
    alignItems: 'center',
  },

  tabContent: {
    minHeight: '19.0625rem',
    '& .MuiTypography-root': {
      marginBottom: '0.5rem',
      color: cardTextColor,
      ...styles,

      '&.MuiTypography-body2': {
        fontWeight: 600,
        letterSpacing: '0.005em',
        color: canvasIconColor,
      },
    },

    '& .MuiButton-text': {
      padding: 0,
      color: switchActiveColor,
      ...styles,

      '&:hover': {
        backgroundColor: 'transparent'
      },
    },
  },

  formGroup: {},

  copyLink: {
    marginBottom: '0.5rem',
    '& .MuiButton-root': {
      width: '5.75rem',
      marginLeft: '0.8rem',
      flexShrink: 0,
    },

    '& .MuiTypography-root': {
      '&.MuiTypography-caption': {
        ...styles,
        background: sidebarBadgeBg,
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
        flexGrow: 1,
        marginBottom: 0,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }
    },
  },

  collaborators: {
    borderTop: `0.0625rem solid ${headerBorderColor}`,
    paddingTop: '1.5rem',
    marginTop: '1.5rem',

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
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none',
        boxShadow: 'none',
      },

      '& .MuiOutlinedInput-root .MuiSelect-customIcon': {
        right: 0,
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      },

      '& .MuiSelect-selectMenu': {
        padding: '0 1.25rem 0 0',
        height: 'auto',
      },
    },

    '& .MuiListItem-secondaryAction': {
      padding: 0,
    },

    '& .MuiListItemText-root': {
      margin: 0,
      display: 'flex',
      alignItems: 'center',

      '& .MuiTypography-root': {
        fontWeight: 400,
        fontSize: '0.8125rem',
        lineHeight: '1.5rem',
        letterSpacing: '-0.0025em',
        margin: 0,
        color: headerButtonBorderColor,

        '&.MuiTypography-body2': {
          color: textDisabled,
          marginLeft: '0.3125rem'
        },
      },

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

  wrap: {
    gap: '0.5rem',
    '& .MuiButton-root': {
      width: '5.625rem',
      flexShrink: 0,
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{props.children}</>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const ShareExperimentTabs = (props) => {
  const classes = useStyles();
  const { value, handleChange } = props;
  const [userRole, setUserRole] = React.useState(userRoles[0]);

  const handleSelect = (event) => {
    setUserRole(event.target.value);
  };

  const userRoleSelection = (props) => {
    return (
      <FormControl variant="outlined" {...props}>
        <Select
          IconComponent={() => <img
            className="MuiSelect-icon MuiSelect-customIcon"
            src={DOWN}
            alt="down"
          />}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={userRole}
          onChange={handleSelect}
        >
          {
            userRoles.map((role) => <MenuItem value={role}>{role}</MenuItem>)
          }
        </Select>
      </FormControl>
    )
  }

  return (
    <>
      <Tabs className={classes.tabs} value={value} onChange={handleChange}>
        <Tab disableRipple label="Add collaborators" {...a11yProps(0)} />
        <Tab disableRipple label="Publish in a team" {...a11yProps(1)} />
        <Tab disableRipple label="Publish in Community" {...a11yProps(2)} />
      </Tabs>

      <Box px={2} py={3} className={classes.tabContent}>
        <TabPanel value={props?.value} index={0}>
          <Typography variant="body2">Experiment link</Typography>
          <Box className={classes.copyLink} display="flex">
            <Typography variant="caption">
              app.salk-cord-atlas.com/experiment/122896674
            </Typography>
            <Button variant="contained" disableElevation>
              Copy link
            </Button>
          </Box>

          <Typography>
            Only allowed collaborators will be able to open the experiment using the link.
          </Typography>

          <Box className={classes.collaborators}>
            <Typography variant="body2">Collaborators</Typography>
            <Box mb={3} display={'flex'} className={classes.wrap}>
              <TextField
                placeholder="Add an user with email address"
                variant="outlined"
              />
              {userRoleSelection()}
              <Button variant="contained" disableElevation>
                Send Invite
              </Button>
            </Box>

            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={USER} />
                </ListItemAvatar>
                <ListItemText primary="Ben Stern" secondary="(You)" />
                <ListItemText primary="Owner" />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar src={USER} />
                </ListItemAvatar>
                <ListItemText primary="Ben Stern" />
                {userRoleSelection()}
              </ListItem>
            </List>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box className={classes.formGroup} mb={1}>
            <Typography variant="body2">Team</Typography>
            {userRoleSelection({fullWidth: true})}
          </Box>
          <Typography>
            All members from this team will automatically have view-only access to this experiment. This experiment will be displayed in Teams section, and will be clonable by members of the team.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="body2">License</Typography>
          <Typography>Creative Commons BY 4.0</Typography>
          <Typography>
            All members on the application, including ones outside your teams, will automatically have view-only access to this experiment. This experiment will be displayed in the Community, and will be clonable by all users.
          </Typography>

          <Button disableRipple>Learn More</Button>
        </TabPanel>
      </Box>
    </>
  );
};