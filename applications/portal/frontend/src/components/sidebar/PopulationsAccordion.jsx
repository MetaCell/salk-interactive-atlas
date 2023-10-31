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
    makeStyles
} from '@material-ui/core';

import { headerBg, canvasIconColor } from "../../theme";
import UP_ICON from "../../assets/images/icons/up.svg";
import CustomAccordionSummary from "./CustomAccordionSummary";
import DOWNLOAD_ICON from "../../assets/images/icons/download_icon.svg";
import { downloadFile } from "../../utils";
import { areAllPopulationsWithChildrenSelected } from "../../utilities/functions";
import workspaceService from "../../service/WorkspaceService";
import { useParams } from "react-router";
import { SliderIcon } from '../icons';


const useStyles = makeStyles({
    populationAccordion: {
        // '& .population-icon': {
        //     padding: '10px'
        // },
        // '& .population-row': {
        //     display: 'flex',
        //     alignItems: 'center',
        //     lineHeight: '0.938rem',
        //     fontWeight: 400,
        //     fontSize: '0.75rem',
        //     justifyContent: 'space-between',
        // },
        // '& .population-entry': {
        //     display: 'flex',
        //     alignItems: 'center',
        //     lineHeight: '0.938rem',
        //     fontWeight: 400,
        // }

        '& .population-color': {
            display: 'flex',
            alignItems: 'center',
            lineHeight: '0.938rem',
            fontWeight: 400,
            fontSize: '0.75rem',
        },
        '& .population-row': {
            display: 'flex',
            alignItems: 'center',
            lineHeight: '0.938rem',
            fontWeight: 400,
            fontSize: '0.75rem',
            justifyContent: 'space-between',
        },
        '& .sidebar-title': {
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.005em',
            color: canvasIconColor,
            transition: "all ease-in-out .3s"
        },
        '& .MuiIconButton-root': {
            '&.slider-icon': {
                padding: '0',
                width: '1rem',
                height: '1rem',
                display: 'flex',
                alignItems: 'center',
                color: canvasIconColor,
                marginRight: '10px',
                '&:hover': {
                    backgroundColor: headerBg,
                },
            },
        },
    },

})


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
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
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

    const handlePopulationsWithChildrenColorChange = (population, color, opacity) => {
        // If the population has children, call handlePopulationColorChange for each child
        const children = population.children;
        if (children) {
            Object.keys(children).forEach(childId => {
                handlePopulationColorChange(childId, color, opacity);
            });
        }
    }

    const activePopulations = Object.values(populations)
        .flatMap(population => population.children ? Object.values(population.children) : [])
        .filter(child => child.selected)
        .map(child => child.id);

    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';

    return (
        <Accordion className={classes.populationAccordion} elevation={0} square defaultExpanded={true}>
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
                <Box className='population-row'>
                    <Typography className='sidebar-title'>Show all</Typography>
                    <Box className='population-color'>
                        {
                            areAllPopulationsWithChildrenSelected(populations) && (
                                <DotSizeButton
                                    onClickFunc={() => {
                                        setDotSizeDialogOpen(!dotSizeDialogOpen)
                                        setDialogPopulationsSelected(Object.values(activePopulations).reduce((acc, pId) => {
                                            acc[pId] = populations[pId]
                                            return acc
                                        }, {}))
                                    }}
                                />
                            )
                        }
                        <FormControlLabel
                            className='bold lg'
                            control={
                                <Switch />
                            }
                            onChange={handleShowAllPopulations}
                            checked={areAllPopulationsWithChildrenSelected(populations)}
                        />
                    </Box>
                </Box>
                {/* <FormControlLabel
                    control={
                        <Switch />
                    }
                    label="Show all"
                    labelPlacement="start"
                    onChange={handleShowAllPopulations}
                    checked={ }
                /> */}
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
                                    handlePopulationsWithChildrenColorChange(populations[pId], color, opacity)
                                }
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


const DotSizeButton = ({ onClickFunc }) => {
    const myRef = React.useRef(null);
    return (
        <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
                onClickFunc()
                setPopulationRefPosition(myRef.current.getBoundingClientRect())
            }}
            className='slider-icon'
            ref={myRef}
        >
            <SliderIcon style={{ height: '0.90rem' }} />
        </IconButton>
    );
};

export default PopulationsAccordion;