import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Slider, Divider, Button, Dialog } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
    border: '1px solid #000'
  },
  slider: {
    width: '80%',
  },
  closeButton: {
    marginTop: theme.spacing(2),
  },
  popupContainer: {
    position: 'absolute',

  },

}));

const NeuronDotSize = ({ open, onClose, value, onValueChange, anchorElement }) => {
  const classes = useStyles();

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  const getPositionStyles = () => {
    if (!anchorElement) {
      return {};
    }

    // const anchorRect = anchorElement.getBoundingClientRect();
    // return {
    //   top: anchorRect.top + window.scrollY,
    //   left: anchorRect.left + window.scrollX,
    // };
    // get the left and top position of the anchor element
    const left = anchorElement.offsetLeft;
    const top = anchorElement.offsetTop;
    // get the width and height of the anchor element
    const width = anchorElement.offsetWidth;
    const height = anchorElement.offsetHeight;
    // return the style object
    return { left: `${left + width}px`, top: `${top + height}px` };
  };
  console.log('NeuronDotSize', anchorElement, getPositionStyles());

  return (
    <Dialog open={open} onClose={onClose}
      classes={{ paper: classes.popupContainer }}
    >
      <Box className={classes.dialogContent}
        style={{ ...getPositionStyles() }}
      >
        <Typography variant="h6" gutterBottom>
          Popup Title
        </Typography>
        <Divider className={classes.divider} />
        <Slider
          className={classes.slider}
          value={value}
          onChange={(event, newValue) => onValueChange(newValue)}
          marks={marks}
          min={0}
          max={100}
        />
        <Divider className={classes.divider} />
        <Button
          className={classes.closeButton}
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
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
