import React from 'react';
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
  Link
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { headerBg, headerBorderColor, switchActiveColor, secondaryColor, headerButtonBorderColor, sidebarBadgeBg, sidebarTextColor } from "../theme";
import SEARCH from "../assets/images/icons/search.svg";
import EXP from "../assets/images/icons/experiments.svg";
import SHARED from "../assets/images/icons/shared.svg";
import TEAMS from "../assets/images/icons/teams.svg";
import COMMUNITY from "../assets/images/icons/community.svg";
import HELP from "../assets/images/icons/help.svg";


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
        '&:placeholder': {
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
        paddingLeft: '3rem'
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
    '& a': {
      fontWeight: '500',
      fontSize: '0.75rem',
      lineHeight: '0.9375rem',
      color: switchActiveColor,
    },
  },
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const Sidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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
        />
      </Box>

      <List
        component="nav"
        disablePadding
      >
        <ListItemLink href="#simple-list">
          <ListItemIcon>
            <img src={EXP} alt="experiments" />
          </ListItemIcon>
          <ListItemText primary="My experiments" />
          <Badge badgeContent={4} />
        </ListItemLink>

        <ListItemLink href="#simple-list" selected={true}>
          <ListItemIcon>
            <img src={SHARED} alt="Shared" />
          </ListItemIcon>
          <ListItemText primary="Shared with me" />
          <Badge badgeContent={4} />
        </ListItemLink>

        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <img src={TEAMS} alt="Teams" />
          </ListItemIcon>
          <ListItemText primary="Teams" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemLink href="#simple-list">
              <ListItemText primary="Salk Institute Team" />
              <Badge badgeContent={4} />
            </ListItemLink>

            <ListItemLink href="#simple-list">
              <ListItemText primary="Acme Team" />
              <Badge badgeContent={4} />
            </ListItemLink>
          </List>
        </Collapse>

        <ListItemLink href="#simple-list">
          <ListItemIcon>
            <img src={COMMUNITY} alt="Community" />
          </ListItemIcon>
          <ListItemText primary="Community" />
          <Badge badgeContent={4} />
        </ListItemLink>
      </List>

      <List
        component="nav"
        disablePadding
      >
        <ListItemLink href="#simple-list">
          <ListItemIcon>
            <img src={HELP} alt="help" />
          </ListItemIcon>
          <ListItemText primary="Help Center" />
        </ListItemLink>
      </List>

      <Box className={classes.footer}>
        <Typography>Funded by NIH</Typography>
        <Link>Learn More</Link>
      </Box>

    </Box>
  )
};

export default Sidebar;
