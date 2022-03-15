import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { bodyBgColor, headerBorderColor, headerButtonBorderColor, cardTextColor } from "../../theme";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FILTER from "../../assets/images/icons/filters.svg";
import UP_ICON from "../../assets/images/icons/up.svg";
import ExperimentCard from "./ExperimentCard";

const useStyles = makeStyles(() => ({
  subHeader: {
    minHeight: '3rem',
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '0 1.875rem',
    backgroundColor: bodyBgColor,
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 1,

    '& .MuiButton-root': {
      padding: '0.5rem',
      fontWeight: '600',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.005em',
      color: headerButtonBorderColor,
      textTransform: 'none',
      '& img': {
        marginLeft: '0.25rem',
      },
    },

    '& .MuiBreadcrumbs-root': {
      flexGrow: 1,
      '& .MuiBreadcrumbs-ol': {
        justifyContent: 'center',
      },
      '& .MuiTypography-root': {
        fontWeight: '600',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        color: headerButtonBorderColor,
        '&.MuiTypography-colorTextPrimary': {
          color: cardTextColor,
        },
      },
    },
  },

}));

const ExperimentList = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const tags = ["Project A", "Tag X", "Label 1"];
  const { heading, description } = props;
  return (
    <>
      <Box className={classes.subHeader} display="flex" alignItems="center">
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Filter
          <img src={FILTER} alt="arrow" />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>

        <Breadcrumbs separator="·" aria-label="breadcrumb">
          <Link color="inherit" href="/">
           {heading}
          </Link>
          <Typography color="textPrimary">{description}</Typography>
        </Breadcrumbs>

        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Sort
          <img src={UP_ICON} alt="arrow" />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
      <Box p={5}>
        <Grid container item spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
            <ExperimentCard i={`${heading}experiment_${i}`} tags={tags} heading={"Exploration of the spinal cord"} description={"Shared on Sept 2nd, 2021"} user={"name"} />
            ))
          }
        </Grid>
      </Box>
    </>
  );
}

export default ExperimentList;