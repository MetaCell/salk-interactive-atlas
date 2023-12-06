import React, {useState} from 'react';
import {
    Box,
    Input,
    makeStyles,
} from '@material-ui/core';

import {
    EXPERIMENTAL_POPULATION_NAME,
    POPULATION_FINISHED_STATE,
    POPULATION_UNKNOWN_CHILD
} from '../../utilities/constants';
import {getParentPopulationStatus} from '../../utilities/functions';


const DoublePressInput = (props: any) => {
    const {label, value, population, isParent, type, handleOnEditPopulation} = props;
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

    const isPopulationNameEditable = () => {
        return !(value.toString() === POPULATION_UNKNOWN_CHILD) &&
            ((isParent && getParentPopulationStatus(population) === POPULATION_FINISHED_STATE) ||
                (!isParent && population.status === POPULATION_FINISHED_STATE));

    }

    return (
        <>
            {editPopulation && type === EXPERIMENTAL_POPULATION_NAME && isPopulationNameEditable() ? (
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
