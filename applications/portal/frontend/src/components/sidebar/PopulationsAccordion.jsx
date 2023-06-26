import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControlLabel,
    Switch,
    Tooltip,
    IconButton
} from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import PopulationEntry from './PopulationEntry';

import UP_ICON from "../../assets/images/icons/up.svg";
import {isPopulationReady} from "../../utilities/functions";
import {makeStyles} from "@material-ui/core/styles";
import {downloadFile} from "../../utils";
import workspaceService from "../../service/WorkspaceService";
import {useParams} from "react-router";

const useStyles = makeStyles({
    downloadButton: {
        marginRight: '6px',
        display: 'flex',
        justifyContent: 'end'
    }
});


const PopulationsAccordion = ({
                                 populations,
                                 icon,
                                 title,
                                 handleShowAllPopulations,
                                 hasEditPermission,
                                 selectedPopoverId,
                                 handlePopoverClick,
                                 popoverAnchorEl,
                                 handlePopoverClose,
                                 handlePopulationColorChange,
                                 handlePopulationSwitch
                             }) => {

    const classes = useStyles();
    const params = useParams();

    const activePopulations = Object.keys(populations).filter(
        (populationID) => populations[populationID].selected
    );
    const api = workspaceService.getApi()

    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';



    const areAllPopulationsSelected = () => {
        return Object.keys(populations)
            .filter(pId => isPopulationReady(populations[pId]))
            .reduce((acc, pId) => populations[pId].selected && acc, true)
    }

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

    return (
        <Accordion elevation={0} square defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<img src={UP_ICON} alt=""/>}
            >
                <Typography>
                    <img src={icon} alt=""/>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormControlLabel
                    className='bold'
                    control={
                        <Switch/>
                    }
                    label="Show all"
                    labelPlacement="start"
                    onChange={handleShowAllPopulations}
                    checked={areAllPopulationsSelected()}
                />
                {Object.keys(populations).map(pId =>
                    <PopulationEntry
                        key={pId}
                        population={populations[pId]}
                        hasEditPermissions={hasEditPermission && isPopulationReady(populations[pId])}
                        isOpenPopover={parseInt(pId) === selectedPopoverId}
                        handlePopoverClick={handlePopoverClick}
                        popoverAnchorEl={popoverAnchorEl}
                        handlePopoverClose={handlePopoverClose}
                        handlePopulationColorChange={handlePopulationColorChange}
                        handlePopulationSwitch={handlePopulationSwitch}
                    />
                )}
                <Tooltip title={downloadTooltipTitle}>
                    <span className={classes.downloadButton}>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => downloadPopulationsData()}
                            disabled={!activePopulations.length}
                            style={{fontSize: '1rem'}}
                        >
                            <FontAwesomeIcon icon={faDownload}/>
                        </IconButton>
                    </span>
                </Tooltip>
            </AccordionDetails>
        </Accordion>
    );
};

export default PopulationsAccordion;
