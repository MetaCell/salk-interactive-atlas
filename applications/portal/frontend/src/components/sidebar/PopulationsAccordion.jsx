import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControlLabel,
    Switch,
    Tooltip,
    IconButton, Button
} from '@material-ui/core';


import UP_ICON from "../../assets/images/icons/up.svg";
import CustomAccordionSummary from "./CustomAccordionSummary";
import DOWNLOAD_ICON from "../../assets/images/icons/download_icon.svg";
import {POPULATION_FINISHED_STATE} from "../../utilities/constants";
import {downloadFile} from "../../utils";
import {areAllPopulationsWithChildrenSelected} from "../../utilities/functions";

const PopulationsAccordion = ({
                                  populations,
                                  icon,
                                  title,
                                  handleShowAllPopulations,
                                  hasEditPermission,
                                  handlePopulationColorChange,
                                  handleChildPopulationSwitch,
                                  handleParentPopulationSwitch
                              }) => {

    const [expanded, setExpanded] = React.useState(false);

    const downloadPopulationsData = async () => {
        try {
            const response = await api.downloadPopulationsExperiment(params.id, activePopulations.join(','), {
                responseType: 'arraybuffer',
            })
            downloadFile(response)
        }catch (error){
            console.error('Error while fetching the file:', error);
        }
    }

    const handlePopulationsWithChildrenColorChange = (population, color, opacity) => {
        // If the population has children, call handlePopulationColorChange for each child
        const children = population.children;
        if (children) {
            Object.keys(children).forEach(childId => {
                handlePopulationColorChange(childId, color, opacity);
            });
        }
    }

    const activePopulations = Object.keys(populations).filter(
        (populationID) => populations[populationID].selected
    );

    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';

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
            <AccordionDetails>
                <FormControlLabel
                    className='bold lg'
                    control={
                        <Switch />
                    }
                    label="Show all"
                    labelPlacement="start"
                    onChange={handleShowAllPopulations}
                    checked={areAllPopulationsWithChildrenSelected(populations)}
                />
                {Object.keys(populations).length > 0 && Object.keys(populations).map(pId =>
                    <span className='population-entry' key={pId}>
                                    <Accordion elevation={0} onChange={(e, expanded) => {
                                        setExpanded(expanded)
                                    }}>
                                        <CustomAccordionSummary
                                            isExpanded={expanded}
                                            population={populations[pId]}
                                            isParent={populations[pId]?.children !== undefined}
                                            handlePopulationSwitch={handleParentPopulationSwitch}
                                            handlePopulationColorChange={(id, color, opacity) =>
                                                handlePopulationsWithChildrenColorChange(populations[pId], color, opacity)}
                                            hasEditPermission={hasEditPermission}
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
                                                                    isExpanded={false}
                                                                    isParent={false}
                                                                    population={populations[pId]?.children[nestedPId]}
                                                                    handlePopulationSwitch={handleChildPopulationSwitch}
                                                                    handlePopulationColorChange={handlePopulationColorChange}
                                                                    hasEditPermission={hasEditPermission}
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
                        style={{ fontWeight: 400 }}
                    >
                        Download actives
                        <img src={DOWNLOAD_ICON} alt="" />
                    </Button>
                </Tooltip>
            </AccordionDetails>
        </Accordion>
    );
};

export default PopulationsAccordion;