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

const PopulationsAccordion = ({
                                  populations,
                                  icon,
                                  title,
                                  handleShowAllPopulations,
                                  hasEditPermission,
                                  handlePopulationColorChange,
                                  handlePopulationSwitch
                              }) => {

    const [expanded, setExpanded] = React.useState(false);

    const areAllPopulationsSelected = () => {
        return Object.keys(populations)
            .filter(pId => populations[pId].status === POPULATION_FINISHED_STATE)
            .reduce((acc, pId) => populations[pId].selected && acc, true)
    }

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

    const handlePopulationsWithChildrenColorChange = (id, color, opacity) => {
        const { populations, handlePopulationColorChange } = this.props;

        if (!populations[id]) {
            console.error(`No population found with id: ${id}`);
            return;
        }

        // Call handlePopulationColorChange for the main population
        handlePopulationColorChange(id, color, opacity);

        // If the population has children, call handlePopulationColorChange for each child
        const children = populations[id].children;
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
                    checked={areAllPopulationsSelected()}
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
                                            isChild={false}
                                            handlePopulationSwitch={handlePopulationSwitch}
                                            handlePopulationColorChange={handlePopulationsWithChildrenColorChange}
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
                                                                    isChild={true}
                                                                    population={populations[pId]?.children[nestedPId]}
                                                                    handlePopulationSwitch={handlePopulationSwitch}
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