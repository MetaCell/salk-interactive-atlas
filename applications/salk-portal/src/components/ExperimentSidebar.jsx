import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, Switch, FormControlLabel, FormControl, RadioGroup, Radio, Button } from '@material-ui/core';
import { canvasIconColor, headerBg, headerBorderColor } from "../theme";
import TOGGLE from "../assets/images/icons/toggle.svg";
import ATLAS from "../assets/images/icons/atlas.svg";
import SUBDIVISIONS from "../assets/images/icons/subdivisions.svg";
import OVERLAYS from "../assets/images/icons/overlays.svg";
import ADD from "../assets/images/icons/add.svg";
import UP_ICON from "../assets/images/icons/up.svg";
import POPULATION from "../assets/images/icons/population.svg";

const useStyles = makeStyles({
  sidebar: {
    height: 'calc(100vh - 3rem)',
    width: '15rem',
    flexShrink: 0,
    borderRight: `0.0625rem solid ${headerBorderColor}`,
    background: '#27292B',
    overflow: 'auto',

    '& .sidebar-title': {
      flexGrow: 1,
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.005em',
      color: canvasIconColor,
      transition: "all ease-in-out .3s"
    },

    '& .sidebar-header': {
      padding: '0 .5rem 0 1rem',
      height: '3rem',
      background: headerBorderColor,
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 9,

      '& button': {
        transform: 'rotate(0deg)',
      },
    },

    '& .MuiCollapse-root': {
      maxHeight: '15.625rem',
      overflow: 'auto',
    },

    '& .MuiFormControlLabel-root': {
      height: '2rem',

      '&.bold': {
        backgroundColor: headerBg,
        zIndex: 1,
        position: 'sticky',
        top: 0,
        '& .MuiFormControlLabel-label': {
          fontWeight: 600,
        },
      }
    },

    '& .MuiButton-text': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: '600',
      fontSize: '0.75rem',
      height: '2rem',
      textTransform: 'none',
      lineHeight: '0.9375rem',
      color: canvasIconColor,
      backgroundColor: headerBg,
      zIndex: 1,
      position: 'sticky',
      borderRadius: 0,
      top: 0,
      '&:hover': {
        backgroundColor: headerBg,
      },
    },
  },

  shrink: {
    width: '3rem',
    '& .sidebar-header': {
      padding: '0',
      justifyContent: 'center',

      '& button': {
        transform: 'rotate(180deg)',
      },
    },

    '& .sidebar-title': {
      transform: 'rotate(-180deg)',
      textOrientation: 'revert-layer',
      writingMode: 'vertical-lr',
      padding: '1rem 15px',
      cursor: 'default',
    },
  },
});

const ExperimentSidebar = () => {
  const classes = useStyles();
  const [shrink, setShrink] = useState(false);
  const [value, setValue] = useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const toggleSidebar = () => {
    setShrink((prevState) => !prevState)
  };

  const sidebarClass = `${classes.sidebar} scrollbar ${shrink ? `${classes.shrink}` : ``}`;

  return (
    <Box className={sidebarClass}>
      <Box className="sidebar-header">
        {!shrink && <Typography className='sidebar-title'>Customize Data</Typography>}
        <IconButton onClick={toggleSidebar}>
          <img src={TOGGLE} alt="Toggle_Icon" title="" />
        </IconButton>
      </Box>

      {shrink && <Typography className='sidebar-title'>Customize Data</Typography>}

      {!shrink && (
        <>
          <Accordion elevation={0} square>
            <AccordionSummary
              expandIcon={<img src={UP_ICON} alt="" />}
            >
              <Typography>
                <img src={ATLAS} alt="" />
                Atlas
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button disableRipple>
                Add an atlas
                <img src={ADD} alt="add" />
              </Button>
              <FormControl component="fieldset">
                <RadioGroup aria-label="atlas" name="atlas1" value={value} onChange={handleChange}>
                  <FormControlLabel value="Allen Atlas" control={<Radio color='primary' />} label="Allen Atlas" labelPlacement='start' />
                  <FormControlLabel value="Salk Atlas" control={<Radio color='primary' />} label="Salk Atlas" labelPlacement='start' />
                  <FormControlLabel value="Columbia Atlas" control={<Radio color='primary' />} label="Columbia Atlas" labelPlacement='start' />
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={0} square>
            <AccordionSummary
              expandIcon={<img src={UP_ICON} alt="" />}
            >
              <Typography>
                <img src={SUBDIVISIONS} alt="" />
                Subdivisions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                className='bold'
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="All subdivisions"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C2"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C3"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C2"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C3"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C2"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C3"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C1"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C2"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="C3"
                labelPlacement="start"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={0} square>
            <AccordionSummary
              expandIcon={<img src={UP_ICON} alt="" />}
            >
              <Typography>
                <img src={POPULATION} alt="" />
                Populations
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                className='bold'
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Show all"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Population ABC"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Population XYZ"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Population CDG"
                labelPlacement="start"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={0} square>
            <AccordionSummary
              expandIcon={<img src={UP_ICON} alt="" />}
            >
              <Typography>
                <img src={OVERLAYS} alt="" />
                Overlays
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Density Map"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Probability Map"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                  />
                }
                label="Neuronal Locations"
                labelPlacement="start"
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  )
};

export default ExperimentSidebar;
