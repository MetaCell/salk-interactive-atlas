import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Slider, Divider, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import { getRGBAString, getRGBAColor, areAllPopulationsWithChildrenSelected } from "../../../utilities/functions";
import { headerBorderColor } from "../../../theme";
import CLOSE from "../../../assets/images/icons/close.svg";
import { EXPERIMENTAL_POPULATION_NAME, RESIDENTIAL_POPULATION_NAME } from "../../../utilities/constants";


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),

    '& .title': {
      fontWeight: 500,
      fontSize: '0.75rem',
    },
    '& .MuiDivider-root': {
      margin: '1.5rem 0',
      borderColor: headerBorderColor
    },
    '& .MuiTypography-body1': {
      fontWeight: 400,
      fontSize: '0.75rem',
    },

    '& .population-color': {
      display: 'flex',
      alignItems: 'center',
      lineHeight: '0.938rem',
      fontWeight: 400,
      fontSize: '0.75rem',
    },
    '& .square': {
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '0.1rem',
      marginRight: theme.spacing(1),
    },
    '& .row-container': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    '& .row-slider': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    '& .disable-text': {
      fontWeight: 400,
      fontSize: '0.75rem',
      color: '#999999',
    },

  },
  slider: {
    width: '80%',
  },
  closeButton: {
    marginTop: theme.spacing(2),
  },
  popupContainer: {
    position: 'absolute',
    width: '100%',
    maxWidth: '25rem',
    margin: '0rem',
    '& .MuiDialogContent-root': {
      padding: '0rem',
    },
    '& .MuiButton-label': {
      padding: 0,
    },
    '& .MuiButton-root': {
      padding: '0.4rem',
      minWidth: '40px',
    },
    '& .MuiDialogTitle-root': {
      padding: '0.125rem 0.25rem 0.125rem 0.8rem',
    },

  },
  dialogContainer: {
    '& .MuiDialog-container': {
      display: 'block',
    },
  },
}));

const NeuronDotSize = ({
  open, onClose, populations, anchorElement,
  activePopulations, handleSubPopulationDotSizeChange,
  dialogPopulationsSelected, populationDotSizes,
}) => {
  const classes = useStyles();
  const [globalDotSize, setGlobalDotSize] = React.useState({
    [RESIDENTIAL_POPULATION_NAME]: 1,
    [EXPERIMENTAL_POPULATION_NAME]: 1,
  });

  const marks = [
    {
      value: 0,
    },
    {
      value: 25,
    },
    {
      value: 50,
    },
    {
      value: 75,
    },
    {
      value: 100,
    },
  ];
  const getPositionStyles = () => {
    if (!anchorElement) {
      return {};
    }
    return {
      marginLeft: anchorElement?.left + anchorElement?.width + 60,
      marginTop: anchorElement?.top,
    };
  };



  const populationSelected = dialogPopulationsSelected?.populations;
  const populationType = dialogPopulationsSelected?.type;

  const changeAllDotSize = useCallback((newValue) => {
    let allSubPopulations = []
    Object.keys(populationSelected).map((populationName) => {
      allSubPopulations = [...allSubPopulations, ...populationSelected[populationName].children]
    })
    handlePopulationDotSizeChange(allSubPopulations, newValue / 100)

    setGlobalDotSize({
      ...globalDotSize,
      [populationType]: newValue / 100,
    });
  }, [populations, handlePopulationDotSizeChange, activePopulations]);


  const getPopulationSize = (subPopulationList) => {
    // Detail: All subpopulations have the same size - get the size of the first one
    return populationDotSizes[subPopulationList[0]] * 100;
  }

  const handlePopulationDotSizeChange = useCallback((subPopulationList, newValue) => {
    const newPopulationDotSizes = { ...populationDotSizes };
    subPopulationList ? subPopulationList.forEach((pId) => {
      newPopulationDotSizes[pId] = newValue;
    }) : null;
    handleSubPopulationDotSizeChange(newPopulationDotSizes);
  }, [handleSubPopulationDotSizeChange]);

  return (
    <Dialog open={open} onClose={onClose}
      classes={{
        paper: classes.popupContainer,
      }}
      className={classes.dialogContainer}
      fullWidth={true}
      style={{ ...getPositionStyles() }}
    >
      <DialogTitle>
        Neuron Size
        <IconButton onClick={onClose}>
          <img src={CLOSE} alt="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>

        <Box className={classes.dialogContent}>
          <Box >
            {
              dialogPopulationsSelected?.showAll && (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Global
                  </Typography>
                  <Typography variant="body1" className='disable-text' gutterBottom>
                    This will affect all the populations in this data library
                  </Typography>
                  <Box className='row-slider'>

                    <Slider
                      className={classes.slider}
                      value={globalDotSize[populationType] * 100}
                      onChange={(event, newValue) => changeAllDotSize(newValue)}
                      marks={marks}
                      min={0}
                      max={100}
                    />
                    <Button className='disable-text' onClick={() => changeAllDotSize(100)}>
                      <Typography className="disable-text">
                        Reset
                      </Typography>
                    </Button>
                  </Box>

                  <Divider />
                </Box>
              )
            }
            {
              populationSelected && Object.keys(populationSelected).map((populationName) => (
                <Box key={populationName}>
                  <Box className='row-container'>
                    <span className='population-color'>
                      <Box style={{ backgroundColor: populationSelected[populationName].color }}
                        component="span"
                        className='square' />
                    </span>
                    <Typography variant="body1">
                      {populationName}
                    </Typography>
                  </Box>
                  <Box className='row-slider'>
                    <Slider
                      className={classes.slider}
                      value={getPopulationSize(populationSelected[populationName].children)}
                      onChange={(event, newValue) => handlePopulationDotSizeChange(populationSelected[populationName].children, newValue / 100)}
                      marks={marks}
                      min={0}
                      max={100}
                    />
                    <Button onClick={() => handlePopulationDotSizeChange(populationSelected[populationName].children, 1)}>
                      <Typography className="disable-text">
                        Reset
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              ))
            }
          </Box>
        </Box>
      </DialogContent>

    </Dialog>
  );
};

NeuronDotSize.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default NeuronDotSize;
