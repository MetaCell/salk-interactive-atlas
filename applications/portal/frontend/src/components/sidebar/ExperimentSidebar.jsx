import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
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

import {canvasIconColor, headerBg, headerBorderColor} from "../../theme";
import TOGGLE from "../../assets/images/icons/toggle.svg";
import ATLAS from "../../assets/images/icons/atlas.svg";
import ADD from "../../assets/images/icons/add.svg";
import UP_ICON from "../../assets/images/icons/up.svg";
import POPULATION from "../../assets/images/icons/population.svg";
import RESIDENTIAL_POPULATION from "../../assets/images/icons/residential_population.svg";
import {atlasMap} from "../../utilities/constants";
import {groupPopulations, splitPopulations, splitPopulationsByType} from '../../utilities/functions';
import PopulationsAccordion from "./PopulationsAccordion";

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
                padding: '0.5rem 1rem 0.5rem 3rem',
                flexDirection: 'row-reverse',
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
    }
});

const ExperimentSidebar = ({
                               selectedAtlas,
                               populations,
                               handleAtlasChange,
                               handleChildPopulationSwitch,
                               handleParentPopulationSwitch,
                               handleShowAllPopulations,
                               handlePopulationColorChange,
                               hasEditPermission
                           }) => {
    const classes = useStyles();
    const [shrink, setShrink] = useState(false);


    const toggleSidebar = () => {
        setShrink((prevState) => !prevState)
    };


    const sidebarClass = `${classes.sidebar} scrollbar ${shrink ? `${classes.shrink}` : ``}`;

    const { residentialPopulations, experimentalPopulations } = splitPopulations(populations);
    const experimentPopulationsWithChildren = groupPopulations(experimentalPopulations);
    const residentialPopulationsWithChildren = groupPopulations(residentialPopulations);


    return (
        <Box className={sidebarClass}>
            <Box className="sidebar-header" display="flex" alignItems="center">
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
                            <IconButton className='population-icon'>
                                <img src={ATLAS} alt=""/>
                            </IconButton>
                            <Typography>
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

                    <PopulationsAccordion populations={residentialPopulationsWithChildren} icon={RESIDENTIAL_POPULATION}
                                          title={"Data library"}
                                          handleShowAllPopulations={() => handleShowAllPopulations(residentialPopulationsWithChildren)}
                                          hasEditPermission={false}
                                          handlePopulationColorChange={handlePopulationColorChange}
                                          handleChildPopulationSwitch={handleChildPopulationSwitch}
                                          handleParentPopulationSwitch={handleParentPopulationSwitch}
                    />

                    <PopulationsAccordion populations={experimentPopulationsWithChildren} icon={POPULATION}
                                          title={"Experimental Populations"}
                                          handleShowAllPopulations={() => handleShowAllPopulations(experimentPopulationsWithChildren)}
                                          hasEditPermission={hasEditPermission}
                                          handlePopulationColorChange={handlePopulationColorChange}
                                          handleChildPopulationSwitch={handleChildPopulationSwitch}
                                          handleParentPopulationSwitch={handleParentPopulationSwitch}
                    />

                </>
            )}
        </Box>
    )
};

export default ExperimentSidebar;
