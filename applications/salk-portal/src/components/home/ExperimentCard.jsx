import * as React from "react";
import {useHistory} from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { headerBg, headerBorderColor, headerButtonBorderColor, defaultChipBg, secondaryChipBg, primaryChipBg, chipTextColor, cardTextColor, secondaryColor } from "../../theme";
import USER from "../../assets/images/icons/user.svg";
import POPULAR from "../../assets/images/icons/popular.svg";
import CLONE from "../../assets/images/icons/clone.svg";
import PLACEHOLDER from "../../assets/images/placeholder.png";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from '@material-ui/core/MenuItem';
import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


const commonStyle = {
  background: headerBg,
  minWidth: '14.125rem',
  border: `0.0625rem solid ${headerBorderColor}`,
  boxShadow: '0 0.75rem 0.875rem -0.25rem rgba(0, 0, 0, 0.3), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.2)',
  borderRadius: '0.375rem',
};

const useStyles = makeStyles(() => ({
  card: {
    background: headerBg,
    overflow: 'hidden',
    border: `0.03125rem solid ${headerBorderColor}`,
    borderRadius: '0.375rem',

    '&:hover': {
      '& .MuiCardMedia-root': {
        transform: 'scale(1.1)',
        transition: 'all ease-in-out .3s',
      },
      '& .MuiCardContent-root h3': {
        textDecoration: 'underline',
        color: secondaryColor,
      },
    },

    '&.secondary': {
      background: 'transparent',
    },

    '& .MuiCardHeader-root': {
      alignItems: 'flex-start',
      '& .MuiAvatar-root': {
        width: '2.25rem',
        height: '2.25rem',
      },

      '& .MuiTypography-root': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: cardTextColor,
        '&.MuiCardHeader-title': {
          fontWeight: '600',
          marginBottom: '0.25rem',
          color: headerButtonBorderColor,
        },
      },
    },

    '& .MuiCardActionArea-root': {
      overflow: 'hidden',
      '& .MuiCardActionArea-focusHighlight': {
        backgroundColor: 'transparent',
      },

      '& > img:not(.MuiCardMedia-root)': {
        position: 'absolute',
        left: '0.25rem',
        top: '0.25rem',
        zIndex: 1,
      },
    },

    '& .MuiCardMedia-root': {
      height: '10.3125rem',
      transform: 'scale(1)',
      transition: 'all ease-in-out .3s',
    },

    '& .MuiCardContent-root': {
      boxShadow: `inset 0 0.03125rem 0 ${headerBorderColor}`,
      display: 'flex',
      alignItems: 'flex-end',
      '& > .MuiBox-root': {
        paddingRight: '0.75rem',
        flexGrow: 1,
      },

      '& .MuiChip-root': {
        margin: 0,
        height: '1.0625rem',
        background: defaultChipBg,
        marginBottom: '0.5rem',
        borderRadius: '0.25rem',

        '&:not(:last-child)': {
          marginRight: '0.25rem',
        },

        '&.MuiChip-colorPrimary': {background: primaryChipBg,},
        '&.MuiChip-colorSecondary': {background: secondaryChipBg,},

        '& .MuiChip-label': {
          padding: '0 0.375rem',
          fontWeight: '600',
          fontSize: '0.625rem',
          lineHeight: '0.75rem',
          color: chipTextColor,
        },
      },

      '& .MuiAvatar-root': {
        width: '1.5rem',
        height: '1.5rem',
      },

      '& h3': {
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: headerButtonBorderColor,
        marginBottom: '0.5rem',
      },
      '& p': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: cardTextColor,
        display: 'flex',
        alignItems: 'center',

        '& img': {marginRight: '0.5rem'},
      },
    },
  },

  cardMenu: {
    '& .MuiMenu-paper': {
      overflow: 'visible',
      transform: 'translateX(50%) !important',
      ...commonStyle,

      '& li': {
        position: 'relative',
        '&:hover': {
          '& .MuiList-root': {
            display: 'block',
          },
        },
        '& .MuiList-root': {
          position: 'absolute',
          top: 0,
          left: '14rem',
          display: 'none',
          ...commonStyle,
        },
      },

      '& .MuiListItem-button:hover': {
        backgroundColor: 'transparent',
      },

      '& .MuiListItemText-root': {
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0.25rem 1rem',
        justifyContent: 'space-between',
        '& .MuiSvgIcon-root': {
          display: 'block',
          fontSize: '1rem',
        },
        '& span': {
          fontWeight: '500',
          fontSize: '0.75rem',
          lineHeight: '1.0625rem',
          letterSpacing: '0.005em',
          color: secondaryColor,
        },
      },

      '& .MuiDivider-root': {
        margin: '0.5rem 0',
      },

      '& .MuiListItem-root': {
        padding: 0,
      },
    },
  },

}));

const ExperimentCard = (props) => {
  const classes = useStyles();
  const { tags, heading, description, user, i, community, id } = props;
  const history = useHistory()
  const handleClick = () => {
    history.push(`/experiments/${id}`)
  }

  const [experimentMenuEl, setExperimentMenuEl] = React.useState(null);

  const handleCardActions = (event) => {
    setExperimentMenuEl(event.currentTarget);
  };

  const closeFilter = () => {
    setExperimentMenuEl(null);
  };

  return (
    <Grid item xs={12} md={3} key={i}>
      <Card className={classes.card} elevation={0}>
        <CardActionArea disableRipple aria-controls={i} aria-haspopup="true" onClick={handleCardActions}>
          {community && <img src={POPULAR} alt="POPULAR" />}
          <CardMedia
            component="img"
            alt={heading}
            image={PLACEHOLDER}
            title={heading}
          />
        </CardActionArea>
        <Menu
          className={classes.cardMenu}
          id={i}
          anchorEl={experimentMenuEl}
          keepMounted
          open={Boolean(experimentMenuEl)}
          onClose={closeFilter}
        >
          <ListItem button>
            <ListItemText primary="Open experiment" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Edit info and tags" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Copy link" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Share" secondary={<ArrowRightIcon />} />
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem button>
                <ListItemText primary="Share this experiment" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Share multiple experiments" />
              </ListItem>
            </List>
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Delete" />
          </ListItem>
        </Menu>
        <CardActionArea>
          <CardContent>
            <Box>
              <Box>
                {
                  tags?.map((tag, i) => <Chip key={`${heading}_${i}_${tag}`} label={tag} color={i== 1 ? 'primary' : i === 2 ? 'secondary': 'default'}/>)
                }
              </Box>
              <Typography component="h3" onClick={handleClick}>
                {heading}
              </Typography>
              <Typography component="p">
                { community && <img src={CLONE} alt="clone" /> }
                {description}
              </Typography>
            </Box>
            <Tooltip arrow title={
              <Typography>
                <Typography component={'span'}>Owner</Typography>
                {user}
              </Typography>
            } placement="top">
              <Avatar src={USER} alt={user} />
            </Tooltip>

          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ExperimentCard;