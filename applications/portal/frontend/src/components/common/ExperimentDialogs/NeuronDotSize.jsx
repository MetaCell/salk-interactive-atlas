import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Slider, Divider, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import { getRGBAString, getRGBAColor, areAllPopulationsSelected } from "../../../utilities/functions";
import { headerBorderColor } from "../../../theme";
import CLOSE from "../../../assets/images/icons/close.svg";


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),

    '& .title': {
      fontWeight: 500,
      fontSize: '0.75rem',
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
    '& .MuiDivider-root': {
      margin: '1.5rem 0',
      borderColor: headerBorderColor
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
  },


}));

const NeuronDotSize = ({ open, onClose, populations, anchorElement, activePopulations, handlePopulationDotSizeChange, dialogPopulationsSelected }) => {
  const classes = useStyles();
  const [globalDotSize, setGlobalDotSize] = React.useState(1);
  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 25,
      label: '25%',
    },
    {
      value: 50,
      label: '50%',
    },
    {
      value: 75,
      label: '75%',
    },
    {
      value: 100,
      label: '100%',
    },
  ];

  const getPositionStyles = () => {
    if (!anchorElement) {
      return {};
    }
    const anchorRect = anchorElement.getBoundingClientRect();
    return {
      top: anchorRect.top + window.scrollY,
      left: anchorElement.offsetLeft,
    };
  };


  const changeAllDotSize = useCallback((newValue) => {
    Object.keys(activePopulations).map((pId) => {
      handlePopulationDotSizeChange(pId, newValue / 100);
    })
    setGlobalDotSize(newValue / 100);
  }, [populations, handlePopulationDotSizeChange, activePopulations]);



  const showAllPopulations = () => {
    if (dialogPopulationsSelected && activePopulations
      && areAllPopulationsSelected(populations)
      && Object.keys(dialogPopulationsSelected).length === Object.keys(activePopulations).length) {
      return true;
    }
    return false;
  };
  console.log('dialogPopulationsSelected', dialogPopulationsSelected);

  return (
    <Dialog open={open} onClose={onClose}
      classes={{ paper: classes.popupContainer }}
      fullWidth={true}
    >
      <DialogTitle>
        Neuron Size
        <IconButton onClick={onClose}>
          <img src={CLOSE} alt="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>

      <Box className={classes.dialogContent}
        style={{ ...getPositionStyles() }}
      >
          <Box >
            {
              showAllPopulations() && (
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
                      value={globalDotSize * 100}
                      onChange={(event, newValue) => changeAllDotSize(newValue)}
                      marks={marks}
                      min={0}
                      max={100}
                    />
                    <Button className='disable-text' onClick={() => changeAllDotSize(100)}>
                      <Typography className="disable-text" gutterBottom>
                        Reset
                      </Typography>
                    </Button>
                  </Box>

                  <Divider />
                </Box>
              )
            }
            {
              dialogPopulationsSelected && Object.keys(dialogPopulationsSelected).map((pId) => (
                <Box key={dialogPopulationsSelected[pId].id}>
                  <Box className='row-container'>
                    <span className='population-color'>
                      <Box style={{ backgroundColor: getRGBAString(getRGBAColor(dialogPopulationsSelected, pId)) }}
                        component="span"
                        className='square' />
                    </span>
                    <Typography variant="body1" gutterBottom>
                      {dialogPopulationsSelected[pId].name}
                    </Typography>
                  </Box>
                  <Box className='row-slider'>
                    <Slider
                      className={classes.slider}
                      value={dialogPopulationsSelected[pId].size * 100}
                      onChange={(event, newValue) => handlePopulationDotSizeChange(pId, newValue / 100)}
                      marks={marks}
                      min={0}
                      max={100}
                    />
                    <Button onClick={() => handlePopulationDotSizeChange(pId, 1)}>
                      <Typography className="disable-text" gutterBottom>
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
