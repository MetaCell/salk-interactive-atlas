import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import theme, {bodyBgColor, canvasBg, headerBorderColor} from "../theme";
import {
    Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem,
    Popover, Select, Switch,
    Typography
} from "@material-ui/core";
import {Population} from "../apiclient/workspaces";
import {
    AtlasChoice,
    CAUDAL,
    DensityMapTypes,
    NEURONAL_LOCATIONS_ID,
    OVERLAYS, PROBABILITY_MAP_ID,
    RequestState,
    ROSTRAL
} from "../utilities/constants";
import workspaceService from "../service/WorkspaceService";
import {getAtlas} from "../service/AtlasService";
import {clearCanvas, drawColoredImage, drawImage} from "../service/CanvasService";
import {useDidUpdateEffect} from "../utilities/hooks/useDidUpdateEffect";
// @ts-ignore
import SWITCH_ICON from "../assets/images/icons/switch_icon.svg";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CordImageMapper from "./CordImageMapper";

const HEIGHT = "calc(100% - 55px)"

const useStyles = makeStyles(t => ({
    densityMapImage: {
        width: "80%"
    },
    densityMapImageContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: t.spacing(1),
        left: t.spacing(1),
    },
    button: {
        backgroundColor: headerBorderColor,
        width: 200
    },
    innerButtonContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        alignItems: "center",
        gap: t.spacing(1)
    },
    buttonLabel: {
        fontSize: "0.75rem"
    },
    popoverContent: {
        paddingBottom: t.spacing(1)
    },
    cordImageContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center',
    },
    dropdownContainer: {
        width: "100%"
    },
    select: {
        fontSize: 12
    },
    selectMenu: {
        marginTop: -50
    },
    popover: {
        "&.MuiPopover-paper": {
            width: "200px!important"
        }
    },
}))

const RADIO_GROUP_NAME = "segments-radio-buttons-group"
const SEPARATOR = '_'

// // @ts-ignore
// const RadioButton = ({onChange, isChecked, label}) => {
//     const classes = useStyles();
//
//     return (
//         <Button className={`${classes.buttonContainer} ${classes.fullWidth}`} onClick={() => onChange(label)}>
//             <span className={classes.radioContainer}>
//                 <Radio
//                     checked={isChecked}
//                     value={label}
//                     name={RADIO_GROUP_NAME}
//                     className={classes.radio}
//                 />
//                 <Typography className={classes.fontSize}>{label}</Typography>
//             </span>
//             <ArrowForwardIosIcon className={classes.fontSize}/>
//         </Button>
//     );
// }

const getDefaultOverlays = () => {
    const overlaysSwitchState: { [key: string]: boolean } = {}
    // @ts-ignore
    Object.keys(OVERLAYS).forEach(k => overlaysSwitchState[k] = false)
    return overlaysSwitchState
}

const TwoDViewer = (props: {
    subdivisions: string[], activePopulations: Population[],
    selectedAtlas: AtlasChoice,
    invalidCachePopulations: Set<string>
}) => {
    const api = workspaceService.getApi()
    const {activePopulations, selectedAtlas, invalidCachePopulations} = props
    const activePopulationsColorMap = activePopulations.reduce((acc, pop) => {
        return {...acc, [pop.id.toString()]: pop.color}
    }, {})
    const activePopulationsHash = activePopulations.map(pop => `${pop.id}+${pop.color}`).join('')
    const atlas = getAtlas(props.selectedAtlas)
    const canvasRef = useRef(null)
    const hiddenCanvasRef = useRef(null)
    const subdivisions = props.subdivisions.sort()
    const segments = subdivisions.flatMap((s) => [`${s}-${ROSTRAL}`, `${s}-${CAUDAL}`])
    const [selectedValueIndex, setSelectedValueIndex] = useState(0);
    const [content, setContent] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const cache = useRef({} as any);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [overlaysSwitchState, setOverlaysSwitchState] = useState(getDefaultOverlays())


    const fetchData = async (population: Population, apiMethod: (id: string, subdivision: string, options: any) => Promise<any>) => {
        const response = await apiMethod(population.id.toString(), segments[selectedValueIndex], {responseType: 'blob'})
        if (response.status === 200) {
            // @ts-ignore
            return {'id': population.id, 'data': URL.createObjectURL(response.data)}
        } else if (response.status === 204) {
            return {'id': population.id, 'data': RequestState.NO_CONTENT}
        }
        return {'id': population.id, 'data': RequestState.ERROR}
    }

    function updateCentroids() {
        if (activePopulations.length > 0) {
            if (overlaysSwitchState[NEURONAL_LOCATIONS_ID]) {
                return Promise.all(activePopulations.filter((p: Population) => !isInCache(p, DensityMapTypes.CENTROIDS_DATA)).map(p =>
                    fetchData(p, (id, subdivision, options) => api.centroidsPopulation(id, subdivision, options))))
                    .then(centroidsResponses => {
                        const cData = centroidsResponses.reduce((acc, res) => {
                            const {id, data} = res;
                            return {...acc, [id]: data};
                        }, {});
                        updateData(cData, DensityMapTypes.CENTROIDS_DATA)
                    })
            }
        }
    }

    function updateProbabilityMap() {
        if (activePopulations.length > 0) {
            if (overlaysSwitchState[PROBABILITY_MAP_ID]) {
                return Promise.all(activePopulations.filter((p: Population) => !isInCache(p, DensityMapTypes.PROBABILITY_DATA)).map(p =>
                    fetchData(p, (id, subdivision, options) => api.probabilityMapPopulation(id, subdivision, options))))
                    .then(probabilityMapResponses => {
                        const probData = probabilityMapResponses.reduce((acc, res) => {
                            const {id, data} = res;
                            return {...acc, [id]: data};
                        }, {});
                        updateData(probData, DensityMapTypes.PROBABILITY_DATA)
                    })
            }
        }
    }

    const updateData = (newData: { [x: string]: any; }, type: DensityMapTypes) => {
        Object.keys(newData).forEach(id => {
            // @ts-ignore
            cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`] = {
                ...cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`],
                [type]: newData[id]
            }
        })
    }

    const getActiveContent = () => {
        const activeContent = {}
        // @ts-ignore
        activePopulations.forEach(pop => activeContent[pop.id.toString()] = cache.current[`${pop.id}${SEPARATOR}${segments[selectedValueIndex]}`])
        return activeContent
    }

    const isInCache = (pop: Population, type: DensityMapTypes) => {
        const id = pop.id.toString()
        // @ts-ignore
        return Object.keys(cache.current).includes(`${id}${SEPARATOR}${segments[selectedValueIndex]}`) && cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`][type] != null
    }

    const hasSomethingToDraw = () => {
        return overlaysSwitchState[PROBABILITY_MAP_ID] || overlaysSwitchState[NEURONAL_LOCATIONS_ID]
    }

    const isCanvasReady = () => {
        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current
        return canvas && hiddenCanvas
    }

    function getDrawColoredImagePromise(data: string | RequestState, canvas: null, hiddenCanvas: null, pId: string) {
        if (data != null && data !== RequestState.NO_CONTENT && data !== RequestState.ERROR) {
            // @ts-ignore
            return drawColoredImage(canvas, hiddenCanvas, data, activePopulationsColorMap[pId])
        }
    }

    const drawContent = async () => {
        if (!isLoading) {
            return
        }

        if (!hasSomethingToDraw() || !isCanvasReady()) {
            setIsLoading(false)
            return
        }

        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current

        // Clear previous content
        clearCanvas(canvas)
        const background = atlas.getAnnotationImageSrc(segments[selectedValueIndex])
        if (background) {
            drawImage(canvas, background)
        }
        const promises = []
        for (const pId of Object.keys(content)) {
            if (overlaysSwitchState[PROBABILITY_MAP_ID]) {
                // @ts-ignore
                const pData = content[pId][DensityMapTypes.PROBABILITY_DATA]
                const promise = getDrawColoredImagePromise(pData, canvas, hiddenCanvas, pId);
                if (promise) {
                    promises.push(promise)
                }
            }
            if (overlaysSwitchState[NEURONAL_LOCATIONS_ID]) {
                // @ts-ignore
                const cData = content[pId][DensityMapTypes.CENTROIDS_DATA]
                const promise = getDrawColoredImagePromise(cData, canvas, hiddenCanvas, pId);
                if (promise) {
                    promises.push(promise)
                }
            }
        }
        await Promise.all(promises)
        setIsLoading(false)
    }


    useDidUpdateEffect(() => {
        setIsLoading(true)
        const promise1 = updateProbabilityMap()
        const promise2 = updateCentroids();
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [selectedValueIndex, isReady])

    useDidUpdateEffect(() => {
        setIsLoading(true)
        const promise1 = updateProbabilityMap()
        const promise2 = updateCentroids();
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())

        }
    }, [activePopulationsHash])

    useDidUpdateEffect(() => {
        setIsLoading(true)
        const promise = updateProbabilityMap();
        if (promise) {
            promise.then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [overlaysSwitchState[PROBABILITY_MAP_ID]])

    useDidUpdateEffect(() => {
        setIsLoading(true)
        const promise = updateCentroids()
        if (promise) {
            promise.then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [overlaysSwitchState[NEURONAL_LOCATIONS_ID]])

    useEffect(() => {
        Object.keys(cache).forEach(idSegment => {
            const id = idSegment.split(SEPARATOR)[0]
            if (invalidCachePopulations.has(id)) {
                // @ts-ignore
                delete cache[idSegment]
            }
        })
    }, [invalidCachePopulations])

    useEffect(() => {
        drawContent().catch(console.error)
    }, [content])

    useEffect(() => {
        setIsReady(true)
    }, [])


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOverlaySwitch = (overlayId: string) => {
        setOverlaysSwitchState({...overlaysSwitchState, [overlayId]: !overlaysSwitchState[overlayId]})
    };

    const handleSegmentChange = (value: number) => {
        setSelectedValueIndex(value);
    };

    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem", minHeight: "100%", height: HEIGHT}
    const open = Boolean(anchorEl);
    return (

        <Box sx={boxStyle}>
            <Box className={classes.buttonContainer}>
                <Button className={classes.button}
                        onClick={(event) => handleClick(event)}>
                    <Box className={classes.innerButtonContainer}>
                        <Typography className={classes.buttonLabel}>Custom View</Typography>
                        <ExpandLessIcon/>
                    </Box>
                </Button>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => handleClose()}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        style: {
                            width: anchorEl?.offsetWidth,
                            height: anchorEl?.parentNode?.parentNode?.clientHeight - theme.spacing(1),
                            background: bodyBgColor,
                            padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px ${theme.spacing(1)}px`
                        },
                    }}
                    classes={{
                        paper: classes.popover
                    }}
                >

                    <Box className={`${classes.cordImageContainer}`}>
                        <CordImageMapper
                            segments={segments}
                            selected={selectedValueIndex}
                            onChange={handleSegmentChange}
                        />
                    </Box>

                    <FormControl className={`${classes.dropdownContainer}`}>
                        <Select
                            className={`${classes.select}`}
                            disableUnderline={true}
                            value={selectedValueIndex}
                            onChange={(event) => handleSegmentChange(event.target.value)}
                            MenuProps={{ classes: { paper: classes.selectMenu }}}
                        >
                            {segments.map((segment, idx) =>
                                <MenuItem key={segment} value={idx}> {segment} </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {Object.keys(OVERLAYS).map(oId =>
                        <FormControlLabel
                            className={classes.popoverContent}
                            key={oId}
                            control={<Switch/>}
                            label={OVERLAYS[oId].name}
                            labelPlacement="start"
                            onChange={() => handleOverlaySwitch(oId)}
                            checked={overlaysSwitchState[oId]}
                        />
                    )}
                </Popover>
            </Box>
            <Box className={classes.densityMapImageContainer}>
                <canvas hidden={true} ref={hiddenCanvasRef}/>
                <canvas hidden={isLoading} className={classes.densityMapImage} ref={canvasRef}/>
            </Box>
        </Box>
    );
};

export default TwoDViewer