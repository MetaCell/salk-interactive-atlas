import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { bodyBgColor, headerBorderColor, headerButtonBorderColor, cardTextColor, sidebarTextColor, headerBg, secondaryColor, defaultChipBg, primaryChipBg, secondaryChipBg } from "../../theme";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FILTER from "../../assets/images/icons/filters.svg";
import FILTER_ACTIVE from "../../assets/images/icons/filters-active.svg";
import UP_ICON from "../../assets/images/icons/up.svg";
import CHECK from "../../assets/images/icons/check.svg";
import ExperimentCard from "./ExperimentCard";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

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

  filterMenu: {
    '&.scrollable': {
      '& .MuiPopover-paper': {maxHeight: '11.875rem'},
    },
    '& .MuiPopover-paper': {
      top: '5.9375rem !important',
      boxShadow: '0 0.75rem 2.5rem -0.25rem rgba(0, 0, 0, 0.3), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.2)',
      maxWidth: '14.125rem',
      width: '100%',
      border: `0.0625rem solid ${headerBorderColor}`,
      background: headerBg,
      borderRadius: '0 0 0.375rem 0.375rem',
      padding: '0.75rem 0',
      '& .MuiList-padding': {
        paddingTop: 0,
        paddingBottom: 0,

        '& .MuiFormControlLabel-root': {
          margin: 0,
          padding: '0.5rem 1rem',
          display: 'flex',
          '& .MuiRadio-root': {
            padding: 0,
            '& img': {
              display: 'block',
            },
            '&:not(.Mui-checked)': {
              visibility: 'hidden',
              width: '1rem',
            },
          },

          '& .MuiCheckbox-root': {
            padding: 0,
            height: '1.0625rem',
            '& img': {
              display: 'block',
            },
            '&:not(.Mui-checked)': {
              visibility: 'hidden',
              width: '1rem',
            },
          },
          '& .MuiFormControlLabel-label': {
            fontWeight: '500',
            fontSize: '0.75rem',
            lineHeight: '1.0625rem',
            letterSpacing: '0.005em',
            display: 'flex',
            alignItems: 'center',
            color: secondaryColor,

            '& .icon': {
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '0.1875rem',
              display: 'block',
              marginRight: '0.5rem',
            },

            '& p': {
              fontWeight: '500',
              fontSize: '0.75rem',
              lineHeight: '1.0625rem',
              letterSpacing: '0.005em',
              color: headerButtonBorderColor,
            },
          },
        },
        '& .MuiFormControl-root': {
          width: '100%',
          '&:not(:last-child)': {
            borderBottom: `0.0625rem solid ${headerBorderColor}`,
            paddingBottom: '0.75rem',
            marginBottom: '0.75rem',
          },
          '& .MuiFormControlLabel-root': {padding: '0.25rem 1rem',},
          '& .MuiFormControlLabel-label': {paddingLeft: '0.5rem',},
          '& .MuiFormLabel-root': {
            fontWeight: '500',
            fontSize: '0.75rem',
            lineHeight: '1.0625rem',
            letterSpacing: '0.005em',
            color: sidebarTextColor,
            display: 'block',
            width: '100%',
            padding: '0.25rem 0 0.25rem 2.5rem',
          },
        },
      },
    },
  },
}));

const ExperimentList = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState('Alpahabetical');
  const [filterAnchorEL, setFilterAnchorEL] = React.useState(null);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const openSortingMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeSortMenu = () => {
    setAnchorEl(null);
  };

  const openFilter = (event) => {
    setFilterAnchorEL(event.currentTarget);
  };

  const closeFilter = () => {
    setFilterAnchorEL(null);
  };

  const tags = ["Project A", "Tag X", "Label 1"];
  const { heading, description } = props;
  const sortOptions = ["Alphabetical", "Date created", "Last viewed"];
  const orderOptions = ["Oldest first", "Newest first"];

  return (
    <>
      <Box className={classes.subHeader} display="flex" alignItems="center">
        <Button aria-controls="filter-menu" aria-haspopup="true" onClick={openFilter}>
          Filter
          <img src={FILTER} alt="arrow" />
          {/* <img src={FILTER_ACTIVE} alt="arrow" /> */}
        </Button>
        <Menu
          id="filter-menu"
          className={`${classes.filterMenu} scrollable`}
          anchorEl={filterAnchorEL}
          keepMounted
          open={Boolean(filterAnchorEL)}
          onClose={closeFilter}
        >
          <FormControlLabel
            labelPlacement="start"
            control={
              <Checkbox checkedIcon={<img src={CHECK} alt="" />} />
            }
            label={'All tags'}
          />
          {
            tags.map((tag, i) => <FormControlLabel
              labelPlacement="start"
              control={
                <Checkbox checkedIcon={<img src={CHECK} alt="" />} />
              }
              label={
                <>
                  <Box style={{ backgroundColor: i== 1 ? primaryChipBg : i === 2 ? secondaryChipBg : defaultChipBg}} component={'span'} className="icon" />
                  <Typography>{tag}</Typography>
                </>
              }
              key={`filter_${i}`}
            />)
          }
        </Menu>

        <Breadcrumbs separator="·" aria-label="breadcrumb">
          <Link color="inherit" href="/">
           {heading}
          </Link>
          <Typography color="textPrimary">{description}</Typography>
        </Breadcrumbs>

        <Button aria-controls="sort-menu" aria-haspopup="true" onClick={openSortingMenu}>
          Sort
          <img src={UP_ICON} alt="arrow" />
        </Button>
        <Menu
          id="sort-menu"
          className={classes.filterMenu}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeSortMenu}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Sort by</FormLabel>
            <RadioGroup aria-label="sort-by" name="sort-by" value={value} onChange={handleChange}>
              {
                sortOptions.map((option) => <FormControlLabel key={option} value={option} control={<Radio checkedIcon={<img src={CHECK} alt="" />} />} label={option} />)
              }
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Order</FormLabel>
            <RadioGroup aria-label="order" name="order" value={value} onChange={handleChange}>
              {
                orderOptions.map((option) => <FormControlLabel key={option} value={option} control={<Radio checkedIcon={<img src={CHECK} alt="" />} />} label={option} />)
              }
            </RadioGroup>
          </FormControl>
        </Menu>
      </Box>
      <Box p={5}>
        <Grid container item spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
            <ExperimentCard id={i} i={`${heading}experiment_${i}`} tags={tags} heading={"Exploration of the spinal cord"} description={"Shared on Sept 2nd, 2021"} user={"name"} />
            ))
          }
        </Grid>
      </Box>
    </>
  );
}

export default ExperimentList;