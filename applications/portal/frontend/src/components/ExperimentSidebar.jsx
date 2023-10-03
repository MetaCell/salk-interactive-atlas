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
    Popover,
    Tooltip
} from '@material-ui/core';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { canvasIconColor, headerBg, headerBorderColor } from "../theme";
import TOGGLE from "../assets/images/icons/toggle.svg";
import ATLAS from "../assets/images/icons/atlas.svg";
import ADD from "../assets/images/icons/add.svg";
import UP_ICON from "../assets/images/icons/up.svg";
import TRAIL_ICON from "../assets/images/icons/trail_icon.svg";
import TRAIL_END_ICON from "../assets/images/icons/trail_end_icon.svg";
import POPULATION from "../assets/images/icons/population.svg";
import { atlasMap, POPULATION_FINISHED_STATE } from "../utilities/constants";
import { getRGBAFromHexAlpha, getRGBAString } from "../utilities/functions";
import ColorPicker from "./common/ColorPicker";
import SwitchLabel from "./common/SwitchLabel";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import workspaceService from "../service/WorkspaceService";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadFile } from "../utils";
import { TailIcon } from './icons';

const useStyles = makeStyles({
    sidebar: {
        height: 'calc(100vh - 3rem)',
        width: '15rem',
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
            padding: '4px 4px 4px 1rem',
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
            '& .MuiAccordion-root': {
                '&:before': {
                    display: 'none !important'
                }
            },
            '& .MuiAccordionSummary-expandIcon': {
                padding: 0,
                marginRight: '20px'
            },
            '& .MuiAccordionSummary-root': {
                padding: '0 !important',
                flexDirection: 'row-reverse',
                padding: '8px 16px 8px 48px',
                '&.nested': {
                    padding: '8px 16px 8px 12px',
                },
                '&.nested_child_element': {
                    padding: '0px 16px 0px 20px'
                }
            },
            '& .MuiCollapse-root': {
                borderTop: 'none'
            },
            '& .MuiDialogActions-root': {
                padding: '1rem 1rem 1rem 0.75rem'
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
            padding: '8px 16px 8px 48px',

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


const POPULATION_ICONS_OPACITY = 0.4

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
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
    const [selectedPopoverId, setSelectedPopoverId] = React.useState(null);
    const params = useParams();


    const api = workspaceService.getApi()


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

    const toggleSidebar = () => {
        setShrink((prevState) => !prevState)
    };

    const getRGBAColor = (pId) => {
        const { color, opacity } = populations[pId]
        return getRGBAFromHexAlpha(color, opacity)
    }

    const areAllPopulationsSelected = () => {
        return Object.keys(populations)
            .filter(pId => populations[pId].status === POPULATION_FINISHED_STATE)
            .reduce((acc, pId) => populations[pId].selected && acc, true)
    }

    const activePopulations = Object.keys(populations).filter(
        (populationID) => populations[populationID].selected
    );


    const sidebarClass = `${classes.sidebar} scrollbar ${shrink ? `${classes.shrink}` : ``}`;
    const PopulationLabel = ({ population }) => {
        let labelText = population.name;
        if (population.status != POPULATION_FINISHED_STATE) {
            labelText += `- ${population.status}`
        }
        return (
            <SwitchLabel label={labelText} />
        )
    }
    const populationTextStyle = (disabled) => hasEditPermission && !disabled ? {} : { marginLeft: "8px" }
    const downloadTooltipTitle = activePopulations.length
        ? 'Download active populations data'
        : 'No active populations to download';


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
    const lastElement = populations[100].children.length
    console.log("last el: ", lastElement)
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
                            <IconButton>
                                <img src={ATLAS} alt="" />
                            </IconButton>
                            <Typography sx={{ ml: '4px' }}>
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
                            <IconButton>
                                <img src={POPULATION} alt="" />
                            </IconButton>
                            <Typography sx={{ ml: '4px' }}>
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
                                    <Accordion elevation={0}>
                                        <AccordionSummary expandIcon={populations[pId].children !== undefined && <img src={UP_ICON} alt="" />} className={populations[pId].children !== undefined && 'nested'}>
                                            <span className='population-color'
                                                onClick={(event) => handlePopoverClick(event, pId)}>
                                                <Box style={{ backgroundColor: getRGBAString(getRGBAColor(pId)) }}
                                                    component="span"
                                                    className='square' />
                                                {hasEditPermission && populations[pId].status === POPULATION_FINISHED_STATE &&
                                                    <ArrowDropDownIcon fontSize='small'
                                                        style={{ opacity: POPULATION_ICONS_OPACITY }} />}
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
                                                className={'population-label nested'}
                                                key={pId} control={<Switch />}
                                                label={<PopulationLabel population={populations[pId]} />}
                                                labelPlacement="start"
                                                onChange={() => handlePopulationSwitch(pId)}
                                                checked={populations[pId].selected}
                                                style={populationTextStyle(populations[pId].status !== POPULATION_FINISHED_STATE)}
                                                disabled={populations[pId].status !== POPULATION_FINISHED_STATE}
                                            />
                                        </AccordionSummary>
                                        {
                                            populations[pId].children !== undefined && <AccordionDetails>
                                                {
                                                    Object.keys(populations[pId].children).map((nestedPId, index, array) =>
                                                        <span className='population-entry' key={nestedPId}>
                                                            <Accordion elevation={0}>
                                                                <AccordionSummary
                                                                    className='nested_child_element'
                                                                    expandIcon={index === array.length - 1 ? <img src={TRAIL_END_ICON} alt="" /> : <img src={TRAIL_ICON} alt="" />}
                                                                >
                                                                    <span className='population-color'>
                                                                        <Box
                                                                            style={{ backgroundColor: getRGBAString(getRGBAColor(pId)) }}
                                                                            component="span"
                                                                            className='square'
                                                                        />
                                                                    </span>
                                                                    <FormControlLabel
                                                                        className={'population-label'}
                                                                        key={nestedPId} control={<Switch />}
                                                                        label={"Label"}
                                                                        labelPlacement="start"
                                                                        style={populationTextStyle(populations[pId].status !== POPULATION_FINISHED_STATE)}
                                                                        disabled={populations[pId].status !== POPULATION_FINISHED_STATE}
                                                                    />
                                                                </AccordionSummary>
                                                            </Accordion>
                                                        </span>
                                                    )
                                                }
                                            </AccordionDetails>
                                        }
                                    </Accordion>
                                </span>
                            )}
                            {/* <Tooltip title={downloadTooltipTitle}>
                                <span className={classes.downloadButton}>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={() => downloadPopulationsData()}
                                        disabled={!activePopulations.length}
                                        style={{ fontSize: '1rem' }}
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                    </IconButton>
                                </span>
                            </Tooltip> */}
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

