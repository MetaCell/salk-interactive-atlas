import * as React from "react";
import { useLocation } from 'react-router-dom'
import {
  Toolbar,
  Box,
  Button,
  makeStyles,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, headerBg } from "../../theme";
import LOGO from "../../assets/images/logo.svg";
import USER from "../../assets/images/icons/user.svg";
import { UserAccountDialog } from "./UserAccountDialog";
import { CreateExperimentDialog } from "./CreateExperimentDialog";

const title = "Salk Mouse Cord Atlas";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: headerBg,
    paddingRight: "0.5rem",
    paddingLeft: "0.875rem",
    justifyContent: "space-between",
    borderBottom: `0.0625rem solid ${headerBorderColor}`,
    height: '3rem',
    flexShrink: 0,

    '& .MuiAvatar-root': {
      width: '1.5rem',
      height: '1.5rem',
    },

    '& img': {
      display: 'block',
    },
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
  button: {
    textTransform: "none",
    padding: "0 0.75rem",
    height: '2rem',
    fontWeight: 500,
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.01em',
    color: headerButtonBorderColor,
    borderRadius: '0.375rem',

    '&:not(:first-child)': {
      marginLeft: '0.5rem',
    },
  },

  logo: {
    minWidth: '10.9375rem',
  },

}));

export const Header = (props: any) => {
  const classes = useStyles();
  const location = useLocation();
  const onExperimentsPage = location.pathname === '/experiments';
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const menuAnchorRef = React.useRef(null);
  const [experimentDialogOpen, setExperimentDialogOpen] = React.useState(false);

  const handleExperimentDialogToggle = () => {
    setExperimentDialogOpen((prevOpen) => !prevOpen);
  };


  const handleDialogToggle = () => {
    setDialogOpen((prevOpen) => !prevOpen);
  };

  const user = props.user;

  const handleUserLogin = () => {
    props.login();
  };
  const handleUserLogout = () => {
    props.logout();
  };

  const headerText =
    user === null ? (
      <Button onClick={handleUserLogin} className={classes.button}>
        Sign in
      </Button>
    ) : (
        <Box alignItems="center" display="flex">
          {!onExperimentsPage ? (
            <>
              <Button
                size="large"
                className={classes.button}
                variant="contained"
                disableElevation={true}
                aria-controls={experimentDialogOpen && "user-menu"}
                aria-haspopup="true"
                onClick={handleExperimentDialogToggle}
              >
                Create a new experiment
              </Button>

              <Button
                size="large"
                ref={menuAnchorRef}
                aria-controls={dialogOpen && "user-menu"}
                aria-haspopup="true"
                onClick={handleDialogToggle}
                className={classes.button}
                variant="outlined"
              >
                My account
                </Button>

              <Avatar alt={user.username} title={user.username} src={user.avatarUrl ? user.avatarUrl : USER} />
            </>
          ) : (
            <>
              <Button
                size="large"
                className={classes.button}
                variant="contained"
                disableElevation={true}
              >
                Save in My Experiments
              </Button>

              <Button
                size="large"
                className={classes.button}
                variant="outlined"
              >
                Share
              </Button>
            </>
          )}
      </Box>
    );

  const handleToggleDrawer = (e: any) => {
    if (props.drawerEnabled) {
      e.preventDefault();
      props.onToggleDrawer();
    }
  };

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <Box display="flex" className={classes.logo}>
          <a href="/" onClick={handleToggleDrawer}>
            <img
              src={LOGO}
              alt={title}
              title={title}
            />
          </a>
        </Box>
        { onExperimentsPage && (<Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              My experiments
            </Link>
            <Typography color="textPrimary">Exploration of the spinal cord</Typography>
          </Breadcrumbs>
        </Box>) }
        <Box>
          {headerText}
        </Box>
      </Toolbar>

      <UserAccountDialog open={dialogOpen} handleClose={handleDialogToggle} user={user} />
      <CreateExperimentDialog open={experimentDialogOpen} handleClose={handleExperimentDialogToggle} user={user}/>
    </>
  );
};
