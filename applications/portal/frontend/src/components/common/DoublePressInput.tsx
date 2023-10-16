import React, { useState } from 'react';
import {
  Box,
  Input,
  makeStyles,
} from '@material-ui/core';
import { Population as PopulationType } from '../../apiclient/workspaces/api';

import workspaceService from "../../service/WorkspaceService";


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


const DoublePressInput = (props) => {
  const { children, value, population } = props;
  const [pressCount, setPressCount] = useState(0);
  const [editPopulation, setEditPopulation] = useState(false);
  const handleKeyPress = () => {
    setPressCount((prevCount) => prevCount + 1);
    setTimeout(() => {
      setPressCount(0);
    }, 300);

    if (pressCount === 1) {
      setEditPopulation(true);
    }
  };
  const api = workspaceService.getApi()

  const handleRenamePopulation = async (id: string, updatedPopulationName) => {
    // @ts-ignore
    const populationBody: PopulationType = { 'name': updatedPopulationName };
    await api.partialUpdatePopulation(id, populationBody)
    // Now change the name of the population everywhere.
    // @ts-ignore
    // const nextPopulations = { ...populations };
    // @ts-ignore
    // nextPopulations[id] = { ...nextPopulations[id], color, opacity }
    // setPopulations(nextPopulations)
    // setSidebarPopulations(nextPopulations)
  }

  return (
    <>
      {editPopulation ? (
        <Input
          defaultValue={value}
          autoFocus
          style={{
            width: '100%',
            fontSize: '0.75rem',
          }}
          onBlur={() => setEditPopulation(false)}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              setEditPopulation(false);
              handleRenamePopulation(population.id, e?.target?.value || value);
            }
          }}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <Box onClick={() => handleKeyPress()}>{children}</Box>
      )}
    </>
  );
};

export default DoublePressInput;
