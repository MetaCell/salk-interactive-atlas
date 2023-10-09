import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Switch,
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio,
    Button,
    Tooltip
} from '@material-ui/core';

import { canvasIconColor, headerBg, headerBorderColor } from "../theme";
import TOGGLE from "../assets/images/icons/toggle.svg";
import ATLAS from "../assets/images/icons/atlas.svg";
import ADD from "../assets/images/icons/add.svg";
import UP_ICON from "../assets/images/icons/up.svg";
import POPULATION from "../assets/images/icons/population.svg";
import DOWNLOAD_ICON from "../assets/images/icons/download_icon.svg";
import { atlasMap, POPULATION_FINISHED_STATE } from "../utilities/constants";
import CustomAccordionSummary from './CustomAccordionSummary';

const useStyles = makeStyles({
    sidebar: {
        height: 'calc(100vh - 3rem)',
        width: '15.313rem',
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
            padding: '0.25rem 0.25rem 0.25rem 1rem',
            background: headerBorderColor,
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
            '& .trail-icon:path': {
                stroke: 'red'
            },
            '& .nav_control': {
                display: 'none'
            },
            '& .MuiAccordion-root': {
                '&:before': {
                    display: 'none !important'
                }
            },
            '& .MuiAccordionSummary-expandIcon': {
                padding: 0,
                marginRight: '1.188rem'
            },
            '& .ellipsis': {
                textOverflow: 'ellipsis',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%'
            },
            '& .MuiAccordionSummary-root': {
                padding: '0 !important',
                flexDirection: 'row-reverse',
                padding: '0.5rem 1rem 0.5rem 3rem',
                '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .nav_control': {
                        display: 'block'
                    },
                    '& .ellipsis': {
                        width: '5.25rem'
                    }
                },
                '&.nested': {
                    padding: '0.5rem 1rem 0.5rem 0.75rem',
                },
                '&.nested_child_element': {
                    padding: '0 1rem 0 1.1875rem',
                    '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
                        transform: 'none'
                    },
                    '&:hover': {
                        '& .trail-icon path': {
                            stroke: '#7B61FF'
                        }
                    },
                    '& .trail-icon': {
                        width: 'auto',
                        height: 'auto'
                    }
                }
            },
            '& .MuiCollapse-root': {
                borderTop: 'none'
            },
            '& .MuiAccordionDetails-root': {
                paddingBottom: 0
            },
            '& .MuiFormControlLabel-root': {
                padding: 0
            }
        },

        '& .population-label': {
            display: 'flex',
            flex: '1',
            justifyContent: 'space-between',
            lineHeight: '0.938rem',
            fontWeight: 400,
            fontSize: '0.75rem'
        },

        '& .population-color': {
            display: 'flex',
            alignItems: 'center',
            lineHeight: '0.938rem',
            fontWeight: 400,
            fontSize: '0.75rem',
        },

        '& .population-icon': {
            padding: '10px'
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
            padding: '0.5rem 1rem 0.5rem 3rem',

            '&.bold': {
                backgroundColor: headerBg,
                zIndex: 1,
                position: 'sticky',
                top: 0,
                '& .MuiFormControlLabel-label': {
                    fontWeight: 600,
                },
            },
            '&.lg': {
                padding: '1rem 1rem 1rem 3rem'
            }
        },

        '& .MuiButton-text': {
            padding: '1rem 1rem 1rem 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '600',
            fontSize: '0.75rem',
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
        }
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
    // populations,
    handleAtlasChange,
    handlePopulationSwitch,
    handleShowAllPopulations,
    handlePopulationColorChange,
    hasEditPermission
}) => {
    const classes = useStyles();
    const [shrink, setShrink] = useState(false);


    const toggleSidebar = () => {
        setShrink((prevState) => !prevState)
    };

    const areAllPopulationsSelected = () => {
        return Object.keys(populations)
            .filter(pId => populations[pId].status === POPULATION_FINISHED_STATE)
            .reduce((acc, pId) => populations[pId].selected && acc, true)
    }

    const activePopulations = Object.keys(populations).filter(
        (populationID) => populations[populationID].selected
    );

    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';

    const [expanded, setExpanded] = React.useState(false);
    const sidebarClass = `${classes.sidebar} scrollbar ${shrink ? `${classes.shrink}` : ``}`;

    return (
        <Box className={sidebarClass}>
            <Box className="sidebar-header" display="flex" alignItems="center">
                {!shrink && <Typography className='sidebar-title'>Customize Data</Typography>}
                <IconButton onClick={toggleSidebar} disableRipple>
                    <img src={TOGGLE} alt="Toggle_Icon" title="" />
                </IconButton>
            </Box>

            {shrink && <Typography className='sidebar-title'>Customize Data</Typography>}

            {!shrink && (
                <>
                    <Accordion elevation={0} square defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<img src={UP_ICON} alt="" />}
                        >
                            <IconButton className='population-icon'>
                                <img src={ATLAS} alt="" />
                            </IconButton>
                            <Typography>
                                Atlas
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button disableRipple>
                                Add an atlas
                                <img src={ADD} alt="add" />
                            </Button>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="atlas" name="atlas1" value={selectedAtlas}>
                                    {Array.from(atlasMap.keys()).map(atlasId =>
                                        <FormControlLabel key={atlasId}
                                            value={atlasId}
                                            control={<Radio />}
                                            label={atlasMap.get(atlasId).name}
                                            labelPlacement='start'
                                            onChange={(atlasId) => handleAtlasChange(atlasId)} />)
                                    }
                                </RadioGroup>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion elevation={0} square defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<img src={UP_ICON} alt="" />}
                        >
                            <IconButton className='population-icon'>
                                <img src={POPULATION} alt="" />
                            </IconButton>
                            <Typography>
                                Experimental Populations
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
                            {Object.keys(populations).map(pId =>
                                <span className='population-entry' key={pId}>
                                    <Accordion elevation={0} onChange={(e, expanded) => {
                                        setExpanded(expanded)
                                    }}>
                                        <CustomAccordionSummary
                                            pId={pId}
                                            isExpanded={expanded}
                                            populations={populations}
                                            isParent={populations[pId].children !== undefined}
                                            isChild={false}
                                            handlePopulationSwitch={handlePopulationSwitch}
                                            handlePopulationColorChange={handlePopulationColorChange}
                                            hasEditPermission={hasEditPermission}
                                        />
                                        {
                                            populations[pId].children !== undefined && <AccordionDetails>
                                                {
                                                    Object.keys(populations[pId].children).map((nestedPId, index, arr) =>
                                                        <span className='population-entry' key={nestedPId}>
                                                            <Accordion elevation={0}>
                                                                <CustomAccordionSummary
                                                                    id={index}
                                                                    data={arr}
                                                                    pId={nestedPId}
                                                                    isExpanded={false}
                                                                    isParent={false}
                                                                    isChild={true}
                                                                    populations={populations[pId].children}
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
                </>
            )}
        </Box>
    )
};

export default ExperimentSidebar;

const populations = {
    100: {
        id: 100,
        name: 'V1',
        color: '#9FEE9A',
        experiment: 133,
        atlas: 'salk_cord_10um',
        opacity: 1,
        selected: false,
        status: "finished",
        cells: [],
        children: {
            101: {
                id: 100,
                name: 'MafA',
                color: '#9FEE9A',
                experiment: 133,
                atlas: 'salk_cord_10um',
                opacity: 1,
                selected: false,
                status: "finished",
                cells: [],
                children: undefined
            },
            102: {
                id: 102,
                name: 'ab',
                color: '#9FEE9A',
                experiment: 133,
                atlas: 'salk_cord_10um',
                opacity: 1,
                selected: false,
                status: "finished",
                cells: [],
                children: undefined
            },
            103: {
                id: 103,
                name: 'Lnz',
                color: '#9FEE9A',
                experiment: 133,
                atlas: 'salk_cord_10um',
                opacity: 1,
                selected: false,
                status: "finished",
                cells: [],
                children: undefined
            }
        }
    },
    200: {
        id: 200,
        name: 'Population XYZ',
        color: '#44C9C9',
        experiment: 133,
        atlas: 'salk_cord_10um',
        opacity: 1,
        selected: false,
        status: "finished",
        cells: [],
        children: undefined
    },
    300: {
        id: 300,
        name: 'Population 123',
        color: '#9B3E8B',
        experiment: 133,
        atlas: 'salk_cord_10um',
        opacity: 1,
        selected: false,
        status: "finished",
        cells: [],
        children: undefined
    },
    400: {
        id: 400,
        name: 'Population 789',
        color: '#C99444',
        experiment: 133,
        atlas: 'salk_cord_10um',
        opacity: 1,
        selected: false,
        status: "finished",
        cells: [],
        children: undefined
    }
}

