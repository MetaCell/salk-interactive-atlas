import React from 'react';
import { useLocation } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Typography,
  Button
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { headerBg, headerBorderColor, switchActiveColor, secondaryColor, headerButtonBorderColor, sidebarBadgeBg, sidebarTextColor } from "../theme";
import SEARCH from "../assets/images/icons/search.svg";
import EXP from "../assets/images/icons/experiments.svg";
import SHARED from "../assets/images/icons/shared.svg";
import TEAMS from "../assets/images/icons/teams.svg";
import COMMUNITY from "../assets/images/icons/community.svg";
import HELP from "../assets/images/icons/help.svg";
import UP_ICON from "../assets/images/icons/up.svg";
import {EXPERIMENTS_HASH, SALK_TEAM, ACME_TEAM, COMMUNITY_HASH, SHARED_HASH, COMING_SOON} from "../utilities/constants";
import {AboutDialog} from "./AboutDialog";

const useStyles = makeStyles({
  sidebar: {
    height: 'calc(100vh - 3rem)',
    width: '15rem',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    borderRight: `0.0625rem solid ${headerBorderColor}`,
    background: headerBg,
    overflow: 'auto',

    '& .sidebar-header': {
      padding: '0 0.875rem',
      height: '3rem',
      background: headerBorderColor,
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 9,

      '& .MuiInputAdornment-root': {
        height: 'auto',
        marginRight: '0.875rem',
      },

      '& .MuiInputBase-input': {
        height: '3rem',
        padding: '0',
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        color: secondaryColor,
        '&::placeholder': {
          color: headerButtonBorderColor,
        },
      },

      '& .MuiInputBase-root': {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
    },

    '& .MuiCollapse-root': {
      borderBottom: `0.0625rem solid ${headerBorderColor}`,
      borderTop: 'none',
      '& .MuiListItem-root': {
        paddingLeft: '3rem',
        '& .MuiTypography-root': {fontWeight: 'normal',},
      },
    },

    '& .MuiBadge-root': {
      '& .MuiBadge-badge': {
        position: 'static',
        transform: 'none',
        height: '1.0625rem',
        background: sidebarBadgeBg,
        fontWeight: '600',
        minWidth: '1.375rem',
        fontSize: '0.625rem',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        color: headerButtonBorderColor,
      },
    },

    '& > .MuiList-root': {
      flexGrow: 1,
      '& + .MuiList-root': {
        flexGrow: 0,
        borderTop: `0.0625rem solid ${headerBorderColor}`,
      },
      '& > .MuiListItem-root': {
        borderBottom: `0.0625rem solid ${headerBorderColor}`,
      },
    },

    '& .MuiListItem-root': {
      padding: '0 0.875rem',
      height: '3rem',
      '&.Mui-selected': {
        backgroundColor: switchActiveColor,
      },
      '&:not(.Mui-selected):hover': {
        backgroundColor: 'transparent',
      },

      '& .MuiTypography-root': {
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        color: headerButtonBorderColor,
      },
    },

    '& .MuiListItemIcon-root': {
      minWidth: '2.215rem',
    },
  },

  rotate: {
    transform: 'rotate(180deg)',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'space-between',
    height: '3rem',
    padding: '0 0.875rem',

    '& p': {
      fontSize: '0.75rem',
      lineHeight: '0.9375rem',
      color: sidebarTextColor,
    },
    '& button': {
      fontWeight: '500',
      fontSize: '0.75rem',
      lineHeight: '0.9375rem',
      padding: 0,
      color: switchActiveColor,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const Sidebar = (props) => {
  const classes = useStyles();
  const { experiments, searchText, setSearchText } = props;
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);


  const handleClick = () => {
    setOpen(!open);
  };

  const hash = useLocation()?.hash;

  return (
    <Box className={classes.sidebar}>
      <Box className="sidebar-header">
        <TextField
          placeholder='Search'
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <img src={SEARCH} alt="search" />
            </InputAdornment>,
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      <List
        component="nav"
        disablePadding
      >
        <ListItemLink href="#experiments" onClick={() => props.executeScroll(EXPERIMENTS_HASH)} selected={hash === `#${EXPERIMENTS_HASH}` || hash === ''}>
          <ListItemIcon>
            <img src={EXP} alt="experiments" />
          </ListItemIcon>
          <ListItemText primary="My experiments" />
          <Badge badgeContent={experiments.length} />
        </ListItemLink>

        <ListItemLink disabled href="#shared" onClick={() => props.executeScroll(SHARED_HASH)} selected={hash === `#${SHARED_HASH}`}>
          <ListItemIcon>
            <img src={SHARED} alt="Shared" />
          </ListItemIcon>
          <ListItemText primary={`Shared with me`} />
        </ListItemLink>

        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <img src={TEAMS} alt="Teams" />
          </ListItemIcon>
          <ListItemText primary={`Teams`}/>
          <img src={UP_ICON} className={open ? classes.rotate : ''} alt="arrow" />
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemLink disabled href="#salkteam" onClick={() => props.executeScroll(SALK_TEAM)} selected={hash === `#${SALK_TEAM}`}>
              <ListItemText primary="Salk Institute Team" />
            </ListItemLink>

            <ListItemLink disabled href="#acmeteam" onClick={() => props.executeScroll(ACME_TEAM)} selected={hash === `#${ACME_TEAM}`}>
              <ListItemText primary="Acme Team" />
            </ListItemLink>
          </List>
        </Collapse>
      </List>

      <List
        component="nav"
        disablePadding
      >
        <ListItemLink disabled href="#community" onClick={() => props.executeScroll(COMMUNITY_HASH)} selected={hash ===  `#${COMMUNITY_HASH}`}>
          <ListItemIcon>
            <img src={COMMUNITY} alt="Community" />
          </ListItemIcon>
          <ListItemText primary={`Community`}/>
        </ListItemLink>
        {/* <ListItemLink disabled href="#simple-list">
          <ListItemIcon>
            <img src={HELP} alt="help" />
          </ListItemIcon>
          <ListItemText primary={`Help Center`} />
        </ListItemLink> */}
      </List>

      <Box className={classes.footer}>
        <Typography>Funded by NIH</Typography>
        <Button disableRipple variant="text" onClick={()=>setDialogOpen(!dialogOpen)}>Learn More</Button>
      </Box>

      <AboutDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
    </Box>
  )
};

export default Sidebar;
