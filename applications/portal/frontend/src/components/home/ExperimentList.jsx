import * as React from "react";
import { useLocation } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { bodyBgColor, headerBorderColor, headerButtonBorderColor, cardTextColor, sidebarTextColor, headerBg, secondaryColor, defaultChipBg, primaryChipBg, secondaryChipBg, inputFocusShadow, switchActiveColor } from "../../theme";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import FILTER from "../../assets/images/icons/filters.svg";
import UP_ICON from "../../assets/images/icons/up.svg";
import CHECK from "../../assets/images/icons/check.svg";
import INFO from "../../assets/images/icons/info.svg";
import ExperimentCard from "./ExperimentCard";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { SalkTeamInfo } from "./SalkTeamInfo";
import { SALK_TEAM } from "../../utilities/constants";
import WorkspaceService from "../../service/WorkspaceService";

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

  infoIcon: {
    padding: 0,
    marginRight: '0.25rem',
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
}));

const ExperimentList = (props) => {
  const classes = useStyles();
  const { experiments, refreshExperimentList } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filterAnchorEL, setFilterAnchorEL] = React.useState(null);
  const [infoDrawer, setInfoDrawer] = React.useState(false);
  const [tagsOptions, setTagsOptions] = React.useState([]);

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

  const toggleTeamInfoView = () => {
    setInfoDrawer((prevOpen) => !prevOpen )
  }

  const { heading, description, type, infoIcon, handleDialogToggle, handleShareMultipleDialogToggle, handleShareDialogToggle } = props;

  const sortOptions = {
    0: "Alphabetical",
    1: "Date created",
    2: "Last modified"
  }
  const orderOptions = {
    0: "Oldest first",
    1: "Newest first"
  }
  const orderOptionsAlphabetical = {
    0: "A-Z",
    1: "Z-A"
  }

  // Default viewing option - Date created, Newest first
  const [selectedSortIndex, setSelectedSortIndex] = React.useState(1);
  const [selectedOrderIndex, setSelectedOrderIndex] = React.useState(1);

  const [selectedTags, setSelectedTags] = React.useState([]);



  const filterExperimentsByTags = (exp) => {
    exp = exp.filter(exp => {
      if (selectedTags.length === 0) {
        return true;
      } else {
        return exp.tags.map(t => t.name).some(t => selectedTags.includes(t));
      }
    });
    return exp;
  }

  const sortAndOrderExperiments = (exp) => {
    let reversal = selectedOrderIndex === 0 ? false : true;
    if (selectedSortIndex === 0) {
      exp.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSortIndex === 1) {
      exp.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    } else if (selectedSortIndex === 2) {
      exp.sort((a, b) => new Date(a.last_modified) - new Date(b.last_modified));
    }

    if (reversal) {
      exp.reverse();
    }
    return exp;
  }

  const handleSortAndOrderChange = (sortindex, orderindex) => {
    setSelectedSortIndex(sortindex);
    setSelectedOrderIndex(orderindex);
  }

  const handleTagSelection = (event, tag) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    }
  }

  const experimentItems = React.useMemo(() => {
    const sortedExperiments = sortAndOrderExperiments(experiments)
    const filteredExperiments = filterExperimentsByTags(sortedExperiments)
    return filteredExperiments;

  }, [experiments, selectedTags, selectedSortIndex, selectedOrderIndex]);


  const hash = useLocation()?.hash;
  const api = WorkspaceService.getApi();

  React.useEffect(() => {
    const fetchTagOptions = async () => {
      const res = await api.listTags();
      return res.data;
    }
    fetchTagOptions().then(data => {
      setTagsOptions(data.map(tag => tag.name));
    }).catch(console.error);
  }, []);


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
          className={`${classes.filterMenu} scrollable scrollbar`}
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
            disabled
          />
          {
            tagsOptions.length < 1 ?
              <Typography style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: headerButtonBorderColor }}>No tags available</Typography>
              : tagsOptions.map((tag, i) => <FormControlLabel
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
              onChange={(e) => handleTagSelection(e, tag)}
            />)
          }
        </Menu>

        <Box display="flex" justifyContent={"center"} alignItems="center" flexGrow={1}>
          { (hash === `#${SALK_TEAM}`&& infoIcon) && (
            <IconButton className={classes.infoIcon} disableRipple onClick={toggleTeamInfoView}>
              <img src={INFO} alt="info" />
            </IconButton>
          )}
          <Breadcrumbs separator="·" aria-label="breadcrumb">
            <Link color="inherit" href="/">
            {heading}
            </Link>
            <Typography color="textPrimary">{description}</Typography>
          </Breadcrumbs>
        </Box>


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
            <RadioGroup aria-label="sort-by" name="sort-by" >
              {
                Object.keys(sortOptions).map((option, index) =>
                  <FormControlLabel key={option} value={+option} control={
                    <Radio
                      checkedIcon={
                        <img src={CHECK} alt="" />
                      }
                      checked={selectedSortIndex === +option}
                      onChange={() => handleSortAndOrderChange(+option, selectedOrderIndex)}
                    />
                  } label={sortOptions[option]} />
                )
              }
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Order</FormLabel>
            <RadioGroup aria-label="order" name="order" >
              {
                Object.keys(selectedSortIndex === 0 ? orderOptionsAlphabetical : orderOptions).map((option, index) =>
                  <FormControlLabel key={option} value={+option} control={
                    <Radio
                      checkedIcon={
                        <img src={CHECK} alt="" />
                      }
                      checked={selectedOrderIndex === +option}
                      onChange={() => handleSortAndOrderChange(selectedSortIndex, +option)}
                    />
                  } label={selectedSortIndex === 0 ? orderOptionsAlphabetical[option] : orderOptions[option]} />
                )
              }
            </RadioGroup>
          </FormControl>
        </Menu>
      </Box>
      <Box p={5}>
        <Grid container item spacing={3}>
          {experimentItems?.map(exp => (
            <ExperimentCard
              key={exp.id} experiment={exp} type={type} handleDialogToggle={handleDialogToggle}
              tagsOptions={tagsOptions}
              handleShareDialogToggle={handleShareDialogToggle}
              handleShareMultipleDialogToggle={handleShareMultipleDialogToggle}
              refreshExperimentList={refreshExperimentList}
            />
            ))
          }
        </Grid>
      </Box>
      <SalkTeamInfo infoDrawer={infoDrawer} closeDrawer={toggleTeamInfoView}/>
    </>
  );
}

export default ExperimentList;