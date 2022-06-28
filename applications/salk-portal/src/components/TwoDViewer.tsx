import React, {Fragment, useEffect, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import theme, {bodyBgColor, canvasBg, headerBorderColor} from "../theme";
import {
    Box,
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    MenuItem,
    Popover,
    Select,
    Switch,
    Typography
} from "@material-ui/core";
import {Population} from "../apiclient/workspaces";
import {
    AtlasChoice,
    CAUDAL,
    DensityImages,
    DensityMapTypes,
    NEURONAL_LOCATIONS_ID,
    OVERLAYS,
    PROBABILITY_MAP_ID,
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
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import {areAllSelected} from "../utilities/functions";


const HEIGHT = "calc(100% - 55px)"

const useStyles = makeStyles(t => ({
    densityMapImage: {
        maxWidth: '100%',
        display: 'block',
        width: '100%',
        objectFit: 'contain',
    },
    densityMapImageContainer: {
        display: 'flex',
        height: '100%',
        flex: '1',
        padding: '0 0 0 200px',
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
    menuButtonContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        alignItems: "center",
        gap: t.spacing(1)
    },
    menuFontSize: {
        fontSize: "0.75rem"
    },
    entryPadding: {
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
    selectMenu: {
        marginTop: -50
    },
    popover: {
        "&.MuiPopover-paper": {
            width: "200px!important"
        }
    },
    collapse: {
        borderTop: 'none !important'
    },
}))

const SEPARATOR = '_'

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
    const [isSubRegionsOpen, setIsSubRegionsOpen] = useState(false)
    const cache = useRef({} as any);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [overlaysSwitchState, setOverlaysSwitchState] = useState(getDefaultOverlays())
    // TODO: Get lamina color from backend
    const [laminas, setLaminas] = useState(atlas.laminas.reduce(
        (obj, lamina) => ({...obj, [lamina]: {selected: false, color: '#0000FF'}}), {}) as
        {[key: string] : {color: string, selected: boolean}})


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

        if (!isCanvasReady()) {
            setIsLoading(false)
            return
        }

        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current

        // Clear previous content
        clearCanvas(canvas)

        // Draw Annotation (Grey Matter and White Matter)
        const background = atlas.getImageSrc(DensityImages.ANNOTATION, segments[selectedValueIndex])
        if (background) {
            drawImage(canvas, background)
        }
        const promises = []
        for (const pId of Object.keys(content)) {
            // Draw probability map
            if (overlaysSwitchState[PROBABILITY_MAP_ID]) {
                // @ts-ignore
                const pData = content[pId][DensityMapTypes.PROBABILITY_DATA]
                const promise = getDrawColoredImagePromise(pData, canvas, hiddenCanvas, pId);
                if (promise) {
                    promises.push(promise)
                }
            }
            // Draw neuron centroids
            if (overlaysSwitchState[NEURONAL_LOCATIONS_ID]) {
                // @ts-ignore
                const cData = content[pId][DensityMapTypes.CENTROIDS_DATA]
                const promise = getDrawColoredImagePromise(cData, canvas, hiddenCanvas, pId);
                if (promise) {
                    promises.push(promise)
                }
            }
        }
        // Draw laminas
        for (const lId of Object.keys(laminas)) {
            // @ts-ignore
            if (laminas[lId].selected) {
                const laminaData = atlas.getLaminaSrc(lId, segments[selectedValueIndex])
                // @ts-ignore
                promises.push(drawColoredImage(canvas, hiddenCanvas, laminaData, laminas[lId].color))
            }
        }

        await Promise.all(promises)
        const canal = atlas.getImageSrc(DensityImages.CANAL, segments[selectedValueIndex])
        if (canal) {
            drawImage(canvas, canal)
        }
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
    }, [content, laminas])

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

    const handleLaminaSwitch = (laminaId: string) => {
        setLaminas({...laminas, [laminaId]: {...laminas[laminaId], selected: !laminas[laminaId].selected}})
        setIsLoading(true)
    }

    const handleShowAllLaminaSwitch = () => {
        const areAllLaminasActive = areAllSelected(laminas)
        const nextLaminas: any = {}
        Object.keys(laminas).forEach(lId => nextLaminas[lId] = {...laminas[lId], selected: !areAllLaminasActive})
        setLaminas(nextLaminas)
        setIsLoading(true)
    }


    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem", minHeight: "100%", height: HEIGHT}
    const isMenuOpen = Boolean(anchorEl);
    // @ts-ignore
    const popoverHeight = anchorEl?.parentNode?.parentNode?.clientHeight ? anchorEl.parentNode.parentNode.clientHeight - theme.spacing(1) : 0
    return (
        <Box sx={boxStyle}>
            <Box className={classes.buttonContainer}>
                <Button className={classes.button}
                        onClick={(event) => handleClick(event)}>
                    <Box className={classes.menuButtonContainer}>
                        <Typography className={classes.menuFontSize}>Custom View</Typography>
                        <ExpandLessIcon/>
                    </Box>
                </Button>
                <Popover
                    open={isMenuOpen}
                    anchorEl={anchorEl}
                    onClose={() => handleClose()}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        style: {
                            width: anchorEl?.offsetWidth,
                            height: popoverHeight,
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
                            className={`${classes.menuFontSize}`}
                            disableUnderline={true}
                            value={selectedValueIndex}
                            onChange={(event) => handleSegmentChange(event.target.value as number)}
                            MenuProps={{classes: {paper: classes.selectMenu}}}
                        >
                            {segments.map((segment, idx) =>
                                <MenuItem key={segment} value={idx}> {segment} </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {atlas.laminas.length > 0 &&
                        <Fragment>
                            <Box onClick={() => setIsSubRegionsOpen(!isSubRegionsOpen)}
                                 className={`${classes.entryPadding} ${classes.menuButtonContainer}`}>
                                <Typography className={classes.menuFontSize}>Subregions</Typography>
                                {isSubRegionsOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </Box>
                            <Collapse in={isSubRegionsOpen} timeout="auto" unmountOnExit={true}
                                      className={`${classes.collapse}`}>
                                <FormControlLabel
                                    className={classes.entryPadding}
                                    control={
                                        <Switch/>
                                    }
                                    label="All subregions"
                                    labelPlacement="start"
                                    onChange={() => handleShowAllLaminaSwitch()}
                                    checked={areAllSelected(laminas)}
                                />
                                {atlas.laminas.sort().map(lId =>
                                    <FormControlLabel
                                        className={classes.entryPadding}
                                        key={lId}
                                        control={<Switch/>}
                                        label={lId}
                                        labelPlacement="start"
                                        onChange={() => handleLaminaSwitch(lId)}
                                        checked={laminas[lId].selected}
                                    />
                                )}
                            </Collapse>
                        </Fragment>
                    }

                    {Object.keys(OVERLAYS).map(oId =>
                        <FormControlLabel
                            className={classes.entryPadding}
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