import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControlLabel,
    Switch,
    Tooltip,
    IconButton,
    Button,
    Box,
} from '@material-ui/core';

import UP_ICON from "../../assets/images/icons/up.svg";
import CustomAccordionSummary from "./CustomAccordionSummary";
import DOWNLOAD_ICON from "../../assets/images/icons/download_icon.svg";
import { downloadFile } from "../../utils";
import { areAllPopulationsWithChildrenSelected, areAllPopulationsWithStatusFinished } from "../../utilities/functions";
import workspaceService from "../../service/WorkspaceService";
import { useParams } from "react-router";
import { DotSizeButton } from './DotSizeButton';


const PopulationsAccordion = ({
    populations,
    icon,
    title,
    type,
    handleOnEditPopulation,
    handleShowAllPopulations,
    hasEditPermission,
    handlePopulationColorChange,
    handleChildPopulationSwitch,
    handleParentPopulationSwitch,
    setDialogPopulationsSelected,
    handleDotSizeClick,
    dotSizeId
}) => {
    const [expanded, setExpanded] = React.useState({});
    const api = workspaceService.getApi()
    const params = useParams();

    const downloadPopulationsData = async () => {
        try {
            const response = await api.downloadPopulationsExperiment(params.id, activePopulations.join(','), {
                responseType: 'arraybuffer',
            })
            downloadFile(response)
        } catch (error) {
            console.error('Error while fetching the file:', error);
        }
    }

    const handlePopulationsWithChildrenColorChange = async (population, color, opacity, setPopulations) => {
        const children = population.children;
        if (children) {
            const updates = Object.keys(children).map(childId => {
                return { id: childId, color, opacity };
            });

            await handlePopulationColorChange(updates, setPopulations);
        }
    };
    const activePopulations = Object.values(populations)
        .flatMap(population => population.children ? Object.values(population.children) : [])
        .filter(child => child.selected)
        .map(child => child.id);

    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';

    const selectAllPopulationsForDotSizeChange = (e) => {

        handleDotSizeClick(e)

        let populationsToSelect = {}
        for (const populationId in populations) {
            const population = populations[populationId]
            if (population.children) {
                populationsToSelect = {
                    ...populationsToSelect,
                    [population.name]: {
                        color: population.color,
                        children: Object.keys(population.children).map((childId) => population.children[childId].id)
                    }
                }
            }
        }
        setDialogPopulationsSelected({
            showAll: true,
            type: type,
            populations: populationsToSelect
        })
    }


    return (
        <Accordion elevation={0} square defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<img src={UP_ICON} alt="" />}
            >
                <IconButton className='population-icon'>
                    <img src={icon} alt="" />
                </IconButton>
                <Typography>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails >
                <Box className='population-row'>
                    <Typography className='sidebar-title'>Show all</Typography>
                    <Box className='population-switch'>
                        {
                            areAllPopulationsWithChildrenSelected(populations) && (
                                <DotSizeButton
                                    dotSizeId={dotSizeId}
                                    onClickFunc={(e) => selectAllPopulationsForDotSizeChange(e)}
                                />
                            )
                        }
                        <FormControlLabel
                            className='bold lg switch-label'
                            control={
                                <Switch />
                            }
                            onChange={handleShowAllPopulations}
                            checked={areAllPopulationsWithChildrenSelected(populations)}
                            disabled={areAllPopulationsWithStatusFinished(populations)}
                        />
                    </Box>
                </Box>
                {Object.keys(populations).length > 0 && Object.keys(populations).map(pId =>
                    <span className='population-entry' key={pId}>
                        <Accordion elevation={0} onChange={(e, expand) => {
                            setExpanded({ ...expanded, [pId]: expand })
                        }}>
                            <CustomAccordionSummary
                                expanded={expanded}
                                type={type}
                                handleOnEditPopulation={handleOnEditPopulation}
                                population={populations[pId]}
                                isParent={populations[pId]?.children !== undefined}
                                handlePopulationSwitch={handleParentPopulationSwitch}
                                handlePopulationColorChange={(id, color, opacity) =>
                                    handlePopulationsWithChildrenColorChange(populations[pId], color, opacity)
                                }
                                hasEditPermission={hasEditPermission}
                                setDialogPopulationsSelected={setDialogPopulationsSelected}
                                handleDotSizeClick={handleDotSizeClick}
                                dotSizeId={dotSizeId}
                            />
                            {
                                populations[pId]?.children && <AccordionDetails>
                                    {
                                        Object.keys(populations[pId]?.children).map((nestedPId, index, arr) =>
                                            <span className='population-entry' key={nestedPId}>
                                                <Accordion elevation={0}>
                                                    <CustomAccordionSummary
                                                        id={index}
                                                        data={arr}
                                                        expanded={{}}
                                                        type={type}
                                                        handleOnEditPopulation={handleOnEditPopulation}
                                                        isParent={false}
                                                        population={populations[pId]?.children[nestedPId]}
                                                        handlePopulationSwitch={handleChildPopulationSwitch}
                                                        handlePopulationColorChange={(id, color, opacity) =>
                                                            handlePopulationColorChange([{
                                                                id: id,
                                                                color: color,
                                                                opacity: opacity
                                                            }])}

                                                        hasEditPermission={hasEditPermission}
                                                        handleDotSizeClick={handleDotSizeClick}
                                                        dotSizeId={dotSizeId}
                                                    />
                                                </Accordion>
                                            </span>
                                        )
                                    }
                                </AccordionDetails>
                            }
                        </Accordion>
                    </span>
                )}
                <Tooltip title={downloadTooltipTitle}>
                    <Button
                        disableRipple
                        onClick={() => downloadPopulationsData()}
                        disabled={!activePopulations.length}
                        style={{ fontWeight: 400, padding: '1.5rem 1rem 1rem 1rem' }}
                    >
                        Download active populations
                        <img src={DOWNLOAD_ICON} alt="" />
                    </Button>
                </Tooltip>
            </AccordionDetails>
        </Accordion>
    );
};


export default PopulationsAccordion;