import React from 'react';
import {
    Box,
    AccordionSummary,
    Switch,
    FormControlLabel,
    Popover
} from '@material-ui/core';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import UP_ICON from "../../assets/images/icons/up.svg";
import {POPULATION_FINISHED_STATE} from "../../utilities/constants";
import {
    areAllPopulationsWithChildrenSelected, areAllSelected,
    getParentPopulationStatus,
    getRGBAFromHexAlpha,
    getRGBAString
} from "../../utilities/functions";
import ColorPicker from "../common/ColorPicker";
import SwitchLabel from "../common/SwitchLabel";
import {TrailIcon, TrailEndIcon} from '../icons';


const POPULATION_ICONS_OPACITY = 0.4

const CustomAccordionSummary = ({
                                    id,
                                    data,
                                    isExpanded,
                                    population,
                                    isParent,
                                    handlePopulationSwitch,
                                    handlePopulationColorChange,
                                    hasEditPermission,

                                }) => {
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
    const [selectedPopoverId, setSelectedPopoverId] = React.useState(null);


    const handlePopoverClick = (event, id) => {
        setPopoverAnchorEl(event.currentTarget);
        setSelectedPopoverId(id);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
        setSelectedPopoverId(null);
    };

    const getRGBAColor = () => {
        const {color, opacity} = population
        return getRGBAFromHexAlpha(color, opacity)
    }

    const PopulationLabel = ({population}) => {
        let labelText = population.name;
        let status = population.status
        if (isParent){
            status = getParentPopulationStatus(population)
        }
        if (status !== POPULATION_FINISHED_STATE) {
            labelText += ` - ${status}`
        }
        const isParentLabel = isParent && isExpanded
        return (
            <SwitchLabel label={labelText} isParentLabel={isParentLabel}/>
        )
    }

    const populationTextStyle = (disabled) => hasEditPermission && !disabled ? {} : {marginLeft: "8px"}
    const lastElement = id === data?.length - 1;
    const status = isParent ? getParentPopulationStatus(population) : population.status
    const checked = isParent ? areAllSelected(population.children) : population.selected

    return (
        <AccordionSummary
            expandIcon={
                isParent ? <img src={UP_ICON} alt=""/> : !lastElement ? <TrailIcon className='trail-icon'/> :
                        lastElement ? <TrailEndIcon className='trail-icon'/> : null
            }
            className={isParent ? 'nested' : 'nested_child_element'}
        >
            <span className='population-color'
                  onClick={(event) => handlePopoverClick(event, population.id)}>
                <Box style={{backgroundColor: getRGBAString(getRGBAColor())}}
                     component="span"
                     className='square'/>
                {hasEditPermission && status === POPULATION_FINISHED_STATE &&
                    <ArrowDropDownIcon fontSize='small' style={{opacity: POPULATION_ICONS_OPACITY}}/>}
            </span>
            {hasEditPermission && status === POPULATION_FINISHED_STATE &&
                <Popover
                    open={population.id === selectedPopoverId}
                    anchorEl={popoverAnchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                >
                    <ColorPicker selectedColor={getRGBAColor()}
                                 handleColorChange={(color, opacity) => handlePopulationColorChange(population.id, color, opacity)}/>
                </Popover>
            }

            <FormControlLabel
                className={'population-label'}
                key={population.id}
                control={<Switch/>}
                label={<PopulationLabel population={population}/>}
                labelPlacement="start"
                onChange={() => isParent? handlePopulationSwitch(population.children, !checked) : handlePopulationSwitch(population.id)}
                checked={checked}
                style={populationTextStyle(status !== POPULATION_FINISHED_STATE)}
                disabled={status !== POPULATION_FINISHED_STATE}
            />
        </AccordionSummary>
    )
};

export default CustomAccordionSummary;