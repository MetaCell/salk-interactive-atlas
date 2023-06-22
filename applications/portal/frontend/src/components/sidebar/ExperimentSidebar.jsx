import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio,
    Button
} from '@material-ui/core';

import {canvasIconColor, headerBg, headerBorderColor} from "../../theme";
import TOGGLE from "../../assets/images/icons/toggle.svg";
import ATLAS from "../../assets/images/icons/atlas.svg";
import ADD from "../../assets/images/icons/add.svg";
import POPULATION from "../../assets/images/icons/population.svg";
import RESIDENTIAL_POPULATION from "../../assets/images/icons/residential_population.svg";
import UP_ICON from "../../assets/images/icons/up.svg";
import {atlasMap} from "../../utilities/constants";
import {isResidentialPopulation} from "../../utilities/functions";
import PopulationsAccordion from "./PopulationsAccordion";

const useStyles = makeStyles({
    sidebar: {
        height: 'calc(100vh - 3rem)',
        width: '16rem',
        flexShrink: 0,
        borderRight: `0.0625rem solid ${headerBorderColor}`,
        background: headerBg,
        overflow: 'auto',
        transition: "all linear .1s",

        '& .sidebar-title': {
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.005em',
            color: canvasIconColor,
            transition: "all ease-in-out .3s"
        },

        '& .sidebar-header': {
            padding: '0 .5rem 0 1rem',
            height: '3rem',
            background: headerBorderColor,
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 9,

            '& button': {
                transform: 'rotate(0deg)',
            },
        },

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

        '& .population-color': {
            display: 'flex',
            alignItems: 'center',
            lineHeight: '0.938rem',
            fontWeight: 400,
            fontSize: '0.75rem',
        },

        '& .square': {
            width: '0.75rem',
            height: '0.75rem',
            borderRadius: '0.1rem',
        },

        '& .MuiCollapse-wrapperInner': {
            maxHeight: '15.625rem',
            overflow: 'auto',
        },

        '& .MuiFormControlLabel-root': {
            height: '2rem',

            '&.bold': {
                backgroundColor: headerBg,
                zIndex: 1,
                position: 'sticky',
                top: 0,
                '& .MuiFormControlLabel-label': {
                    fontWeight: 600,
                },
            }
        },

        '& .MuiButton-text': {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '600',
            fontSize: '0.75rem',
            height: '2rem',
            textTransform: 'none',
            lineHeight: '0.9375rem',
            color: canvasIconColor,
            backgroundColor: headerBg,
            zIndex: 1,
            position: 'sticky',
            borderRadius: 0,
            top: 0,
            '&:hover': {
                backgroundColor: headerBg,
            },
        },
    },

    shrink: {
        width: '3rem',
        '& .sidebar-header': {
            padding: '0',
            justifyContent: 'center',

            '& button': {
                transform: 'rotate(180deg)',
            },
        },

        '& .sidebar-title': {
            transform: 'rotate(-180deg)',
            textOrientation: 'revert-layer',
            writingMode: 'vertical-lr',
            padding: '1rem 0.9375rem',
            cursor: 'default',
        },
    },
    downloadButton: {
        marginRight: '6px',
        display: 'flex',
        justifyContent: 'end'
    }
});


const ExperimentSidebar = ({
                               selectedAtlas,
                               populations,
                               handleAtlasChange,
                               handlePopulationSwitch,
                               handleShowAllPopulations,
                               handlePopulationColorChange,
                               hasEditPermission
                           }) => {
    const classes = useStyles();
    const [shrink, setShrink] = useState(false);
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
    const [selectedPopoverId, setSelectedPopoverId] = React.useState(null);

    const canEdit = (population) => {
        return hasEditPermission && !isResidentialPopulation(population)
    }

    const handlePopoverClick = (event, population) => {
        if (!canEdit(population)) {
            return
        }
        setPopoverAnchorEl(event.currentTarget);
        setSelectedPopoverId(population.id);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
        setSelectedPopoverId(null);
    };

    const toggleSidebar = () => {
        setShrink((prevState) => !prevState)
    };


    const sidebarClass = `${classes.sidebar} scrollbar ${shrink ? `${classes.shrink}` : ``}`;


    const residentialPopulations = {};
    let experimentPopulations = {};

    Object.keys(populations).forEach((key) => {
        if (populations[key].experiment !== null) {
            experimentPopulations[key] = populations[key];
        } else {
            residentialPopulations[key] = populations[key];
        }
    });


    return (
        <Box className={sidebarClass}>
            <Box className="sidebar-header">
                {!shrink && <Typography className='sidebar-title'>Customize Data</Typography>}
                <IconButton onClick={toggleSidebar} disableRipple>
                    <img src={TOGGLE} alt="Toggle_Icon" title=""/>
                </IconButton>
            </Box>

            {shrink && <Typography className='sidebar-title'>Customize Data</Typography>}

            {!shrink && (
                <>
                    <Accordion elevation={0} square defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<img src={UP_ICON} alt=""/>}
                        >
                            <Typography>
                                <img src={ATLAS} alt=""/>
                                Atlas
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button disableRipple>
                                Add an atlas
                                <img src={ADD} alt="add"/>
                            </Button>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="atlas" name="atlas1" value={selectedAtlas}>
                                    {Array.from(atlasMap.keys()).map(atlasId =>
                                        <FormControlLabel key={atlasId}
                                                          value={atlasId}
                                                          control={<Radio/>}
                                                          label={atlasMap.get(atlasId).name}
                                                          labelPlacement='start'
                                                          onChange={(atlasId) => handleAtlasChange(atlasId)}/>)
                                    }
                                </RadioGroup>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    <PopulationsAccordion
                        populations={residentialPopulations}
                        icon={RESIDENTIAL_POPULATION}
                        title={"Data library"}
                        handleShowAllPopulations={() => handleShowAllPopulations(residentialPopulations)}
                        hasEditPermission={false}
                        selectedPopoverId={null}
                        handlePopoverClick={() => {
                        }}
                        popoverAnchorEl={null}
                        handlePopoverClose={() => {
                        }}
                        handlePopulationColorChange={() => {
                        }}
                        handlePopulationSwitch={handlePopulationSwitch}
                    />
                    <PopulationsAccordion
                        populations={experimentPopulations}
                        icon={POPULATION}
                        title={"Experimental populations"}
                        handleShowAllPopulations={() => handleShowAllPopulations(experimentPopulations)}
                        hasEditPermission={hasEditPermission}
                        selectedPopoverId={selectedPopoverId}
                        handlePopoverClick={handlePopoverClick}
                        popoverAnchorEl={popoverAnchorEl}
                        handlePopoverClose={handlePopoverClick}
                        handlePopulationColorChange={handlePopulationColorChange}
                        handlePopulationSwitch={handlePopulationSwitch}
                    />

                </>
            )}
        </Box>
    )
};

export default ExperimentSidebar;
