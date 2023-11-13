import React, { useState } from 'react';
import {
  Box,
  Input,
  makeStyles,
} from '@material-ui/core';

import workspaceService from "../../service/WorkspaceService";
import { EXPERIMENTAL_POPULATION_NAME } from '../../utilities/constants';

type SubPoplulationRenameBodyType = {
  type: string,
  change: {
    pid: number,
    name: string,
  }
}

type PopulationRenameBodyType = {
  type: string,
  change: [
    {
      pid: number,
      name: string,
    }
  ]
}

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
  const { label, value, population, isParent, type } = props;
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
  const api = workspaceService.getApi()

  const handleOnEditPopulation = (newValue: string) => {
    console.log("DoublePressInput: population: ", population)
    setEditPopulation(false);
    if (isParent) {
      handleRenamePopulation(population, newValue || value);
    } else {
      handleRenameSubPopulation(population, newValue || value);
    }
  }
  const handleRenamePopulation = async (population: any, updatedPopulationName) => {
    // @ts-ignore
    // const populationBody: PopulationRenameBodyType = 
    let change = []
    const subPopulations = Object.values(population.children)
    for (const subPopulation of subPopulations) {
      console.log("DoublePressInput: subPopulation: ", subPopulation)
      change.push({
        pid: subPopulation.id,
        name: updatedPopulationName + " " + subPopulation.name,
      })
    }
    const populationBody = {
      type: 'population',
      change: change
    }
    console.log("DoublePressInput: populationBody: ", populationBody)
    // await api.partialUpdatePopulation(id, populationBody)




    // Now change the name of the population everywhere.
    // @ts-ignore
    // const nextPopulations = { ...populations };
    // @ts-ignore
    // nextPopulations[id] = { ...nextPopulations[id], color, opacity }
    // setPopulations(nextPopulations)
    // setSidebarPopulations(nextPopulations)
  }

  const handleRenameSubPopulation = async (population: any, updatedPopulationName) => {
    const subPopulationBody: SubPoplulationRenameBodyType = {
      type: 'subpopulation',
      change: {
        pid: population.id,
        name: updatedPopulationName,
      }
    };
    console.log("DoublePressInput: subPopulationBody: ", subPopulationBody)
  }



  return (
    <>
      {(editPopulation && type === EXPERIMENTAL_POPULATION_NAME) ? (
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
              handleOnEditPopulation(e.target.value);
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
