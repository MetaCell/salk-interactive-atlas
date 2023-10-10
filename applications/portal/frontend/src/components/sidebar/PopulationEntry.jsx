import React from 'react';
import {Box, FormControlLabel, Popover, Switch} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {getRGBAFromHexAlpha, getRGBAString, isPopulationReady} from "../../utilities/functions";
import {POPULATION_ICONS_OPACITY} from "../../utilities/constants";
import ColorPicker from "../common/ColorPicker";
import SwitchLabel from "../common/SwitchLabel";


const PopulationLabel = ({population}) => {
    let labelText = population.name;
    if (!isPopulationReady(population)) {
        labelText += `- ${population.status}`
    }
    return (
        <SwitchLabel label={labelText}/>
    )
}

function PopulationEntry({
                             population,
                             hasEditPermissions,
                             isOpenPopover,
                             handlePopoverClick,
                             popoverAnchorEl,
                             handlePopoverClose,
                             handlePopulationColorChange,
                             handlePopulationSwitch
                         }) {
    const getRGBAColor = () => {
        const {color, opacity} = population
        return getRGBAFromHexAlpha(color, opacity)
    }

    const populationTextStyle = (population) => hasEditPermissions && isPopulationReady(population) ? {} : {marginLeft: "8px"}

    return (
        <span className='population-entry'>
            <span className='population-color' onClick={(event) => handlePopoverClick(event, population)}>
                <Box style={{backgroundColor: getRGBAString(getRGBAColor())}}
                     component="span"
                     className='square'/>
                {hasEditPermissions &&
                    <ArrowDropDownIcon fontSize='small'
                                       style={{opacity: POPULATION_ICONS_OPACITY}}/>}
            </span>
            {hasEditPermissions &&
                <Popover
                    open={isOpenPopover}
                    anchorEl={popoverAnchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <ColorPicker selectedColor={getRGBAColor(population.id)} handleColorChange={
                        (color, opacity) => handlePopulationColorChange(population.id, color, opacity)
                    }/>
                </Popover>
            }
            <FormControlLabel
                className={'population-label'}
                key={population.id}
                control={<Switch/>}
                label={<PopulationLabel population={population}/>}
                labelPlacement="start"
                onChange={() => handlePopulationSwitch(population.id.toString())}
                checked={population.selected}
                style={populationTextStyle(population)}
                disabled={!isPopulationReady(population)}
            />
        </span>
    );
}

export default PopulationEntry;
