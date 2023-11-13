import React, { useState } from 'react';
import {
  Box,
  Input,
  makeStyles,
} from '@material-ui/core';

import { EXPERIMENTAL_POPULATION_NAME, POPULATION_UNKNOWN_CHILD } from '../../utilities/constants';

const useStyles = makeStyles({
  sidebar: {
    '& .population-entry': {
      display: 'flex',
      alignItems: 'center',
      lineHeight: '0.938rem',
      fontWeight: 400,
      fontSize: '0.75rem',
    },

    '& .population-label': {
      display: 'flex',
      flex: '1',
      justifyContent: 'space-between',
      lineHeight: '0.938rem',
      fontWeight: 400,
      fontSize: '0.75rem',
    },
  }
});


const DoublePressInput = (props: any) => {
  const { label, value, population, isParent, type, handleOnEditPopulation } = props;
  const [pressCount, setPressCount] = useState(0);
  const [editPopulation, setEditPopulation] = useState(false);
  const handleKeyPress = () => {
    setPressCount((prevCount) => prevCount + 1);
    setTimeout(() => {
      setPressCount(0);
    }, 500);

    if (pressCount === 1) {
      setEditPopulation(true);
    }
  };


  return (
    <>
      {(editPopulation && type === EXPERIMENTAL_POPULATION_NAME) && (!value.toString().startsWith(POPULATION_UNKNOWN_CHILD)) ? (
        <Input
          defaultValue={value}
          autoFocus={true}
          style={{
            width: '100%',
            fontSize: '0.75rem',
          }}
          onBlur={() => setEditPopulation(false)}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              setEditPopulation(false);
              // @ts-ignore
              handleOnEditPopulation(e?.target?.value || value, isParent, population);
            }
          }}
          onKeyPress={handleKeyPress}
        />
      ) : (
          <Box onClick={() => handleKeyPress()}>{label}</Box>
      )}
    </>
  );
};

export default DoublePressInput;
