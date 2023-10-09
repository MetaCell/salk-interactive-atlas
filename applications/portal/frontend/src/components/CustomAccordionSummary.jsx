import React from 'react';
import {
    Box,
    AccordionSummary,
    Switch,
    FormControlLabel,
    Popover
} from '@material-ui/core';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import UP_ICON from "../assets/images/icons/up.svg";
import { POPULATION_FINISHED_STATE } from "../utilities/constants";
import { getRGBAFromHexAlpha, getRGBAString } from "../utilities/functions";
import ColorPicker from "./common/ColorPicker";
import SwitchLabel from "./common/SwitchLabel";
import { TrailIcon, TrailEndIcon } from './icons';


const POPULATION_ICONS_OPACITY = 0.4

const CustomAccordionSummary = ({
    id,
    data,
    pId,
    isExpanded,
    populations,
    isParent,
    isChild,
    handlePopulationSwitch,
    handlePopulationColorChange,
    hasEditPermission,

}) => {
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
    const [selectedPopoverId, setSelectedPopoverId] = React.useState(null);


    const handlePopoverClick = (event, id) => {
        if (!hasEditPermission) {
            return
        }
        setPopoverAnchorEl(event.currentTarget);
        setSelectedPopoverId(id);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
        setSelectedPopoverId(null);
    };

    const getRGBAColor = (pId) => {
        const { color, opacity } = populations[pId]
        return getRGBAFromHexAlpha(color, opacity)
    }

    const PopulationLabel = ({ population }) => {
        let labelText = population.name;
        if (population.status != POPULATION_FINISHED_STATE) {
            labelText += `- ${population.status}`
        }
        const isParentLabel = isParent && isExpanded
        return (
            <SwitchLabel label={labelText} isParentLabel={isParentLabel}/>
        )
    }

    const populationTextStyle = (disabled) => hasEditPermission && !disabled ? {} : { marginLeft: "8px" }
    const lastElement = id === data?.length - 1;

    return (
        <AccordionSummary
            expandIcon={
                isParent ? <img src={UP_ICON} alt="" /> :
                    isChild && !lastElement ? <TrailIcon className='trail-icon'/> :
                        lastElement ? <TrailEndIcon className='trail-icon'/>: null
            }
            className={isParent ? 'nested' : isChild ? 'nested_child_element' : ''}
        >
            <span className='population-color' onClick={(event) => handlePopoverClick(event, pId)}>
                <Box style={{ backgroundColor: getRGBAString(getRGBAColor(pId)) }}
                    component="span"
                    className='square' />
                {hasEditPermission && populations[pId].status === POPULATION_FINISHED_STATE &&
                    <ArrowDropDownIcon fontSize='small' style={{ opacity: POPULATION_ICONS_OPACITY }} />}
            </span>
            {hasEditPermission && populations[pId].status === POPULATION_FINISHED_STATE &&
                <Popover
                    open={pId === selectedPopoverId}
                    anchorEl={popoverAnchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <ColorPicker selectedColor={getRGBAColor(pId)} handleColorChange={
                        (color, opacity) => handlePopulationColorChange(pId, color, opacity)
                    } />
                </Popover>
            }
           
            <FormControlLabel
                className={'population-label'}
                key={pId} control={<Switch />}
                label={<PopulationLabel population={populations[pId]} />}
                labelPlacement="start"
                onChange={() => handlePopulationSwitch(pId)}
                checked={populations[pId].selected}
                style={populationTextStyle(populations[pId].status !== POPULATION_FINISHED_STATE)}
                disabled={populations[pId].status !== POPULATION_FINISHED_STATE}
            />
        </AccordionSummary>
    )
};

export default CustomAccordionSummary;