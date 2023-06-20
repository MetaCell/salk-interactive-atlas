import React, {Fragment, useEffect, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import theme, {bodyBgColor, canvasBg, headerBorderColor} from "../../../theme";
import {
    Box,
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    MenuItem,
    Popover,
    Select, Snackbar,
    Switch,
    Typography
} from "@material-ui/core";
import {Population} from "../../../apiclient/workspaces";
import {
    AtlasChoice, CAUDAL,
    DensityImages,
    DensityMapTypes, GridTypes, LaminaImageTypes,
    NEURONAL_LOCATIONS_ID,
    OVERLAYS, PROBABILITY_MAP_ID,
    RequestState,
    ROSTRAL,
    alphanumericCollator,
} from "../../../utilities/constants";
import workspaceService from "../../../service/WorkspaceService";
import {getAtlas} from "../../../service/AtlasService";
import {
    clearCanvas,
    drawColoredImage,
    drawImage, loadImages,
} from "../../../service/CanvasService";
import {useDidUpdateEffect} from "../../../utilities/hooks/useDidUpdateEffect";
// @ts-ignore
import SWITCH_ICON from "../assets/images/icons/switch_icon.svg";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CordImageMapper from "./CordImageMapper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import {
    areAllSelected, areSomeSelected,
    getRGBAFromHexAlpha,
    getRGBAString,
    onKeyboard,
    onWheel,
    scrollStop
} from "../../../utilities/functions";
import ColorPicker from "../../common/ColorPicker";
import SwitchLabel from "../../common/SwitchLabel";
import {TWO_D_VIEWER_SNACKBAR_MESSAGE} from "../../../utilities/resources";
import SnackbarAlert from "../../common/Alert";
import LaminaPicker from "./LaminaPicker";
import OverlayLabel from "./OverlayLabel";
import {DARK_GREY_SHADE, getLaminaShades} from "../../../models/Atlas";

const HEIGHT = "calc(100% - 55px)"

const useStyles = makeStyles(t => ({
    densityMapImage: {
        maxWidth: '100%',
        display: 'block',
        width: '100%',
        objectFit: 'contain',
    },
    densityMapImageContainer: {
        padding: t.spacing(2),
        display: 'flex',
        height: '100%',
        flex: '1',
        // padding: '0 0 0 211px', // for now we disable this to show bigger images
        justifyContent: 'center',
        outline: "none !important"
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

    laminaEntry: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    laminaColor: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    square: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '0.1rem',
    },
    laminaLabel: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    label: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        lineHeight: '0.938rem',
        fontWeight: 400,
        fontSize: '0.75rem',
    },
    laminaTopLabelContainer: {
        display: 'flex',
        flex: '1'
    }
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
    const canvasContainerRef = useRef(null)
    const canvasRef = useRef(null)
    const hiddenCanvasRef = useRef(null)
    const subdivisions = props.subdivisions.sort()
    const segments = subdivisions.flatMap((s) => [`${s}-${ROSTRAL}`, `${s}-${CAUDAL}`])
    const [selectedValueIndex, setSelectedValueIndex] = useState(0);
    const cursorRef = useRef(selectedValueIndex);
    const [content, setContent] = useState({})
    const [isDrawing, setIsDrawing] = useState(false)
    const [isComponentReady, setIsComponentReady] = useState(false)
    const [isSubRegionsOpen, setIsSubRegionsOpen] = useState(false)
    const cache = useRef({} as any);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [overlaysSwitchState, setOverlaysSwitchState] = useState(getDefaultOverlays())
    const [laminas, setLaminas] = useState(atlas.laminas.reduce(
        (obj, lamina) => ({...obj, [lamina.id]: {selected: false, color: lamina.defaultShade, opacity: 1}}), {}) as
        { [key: string]: { color: string, selected: boolean, opacity: number } })
    const [laminaPopoverAnchorEl, setLaminaPopoverAnchorEl] = React.useState(null);
    const [selectedLaminaPopoverId, setSelectedLaminaPopoverId] = React.useState(null);
    const [laminaType, setLaminaType] = React.useState(LaminaImageTypes.FILLED);
    const [gridType, setGridType] = React.useState(GridTypes.FRAME);
    const [laminaBaseColor, setLaminaBaseColor] = React.useState(DARK_GREY_SHADE);
    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(true);


    const fetchData = async (population: Population, apiMethod: (id: string, subdivision: string, options: any) => Promise<any>) => {
        // Fetches either probability map or centroids image from the backend

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
        // If neuronal centroids switch is active and there are populations active fetches data for the populations not in cache
        // Updates the cache variable on the centroids key

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
        // If probability maps switch is active and there are populations active fetches data for the populations not in cache
        // Updates the cache variable on the probability map key

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
        // Updates the cache variable on the given key with the given data
        Object.keys(newData).forEach(id => {
            // @ts-ignore
            cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`] = {
                ...cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`],
                [type]: newData[id]
            }
        })
    }

    const getActiveContent = () => {
        // Retrieves from cache the content of the active populations

        const activeContent = {}
        // @ts-ignore
        activePopulations.forEach(pop => activeContent[pop.id.toString()] = cache.current[`${pop.id}${SEPARATOR}${segments[selectedValueIndex]}`])
        return activeContent
    }

    const isInCache = (pop: Population, type: DensityMapTypes) => {
        // Checks if a given population has data in cache for the density map type given

        const id = pop.id.toString()
        // @ts-ignore
        return Object.keys(cache.current).includes(`${id}${SEPARATOR}${segments[selectedValueIndex]}`) && cache.current[`${id}${SEPARATOR}${segments[selectedValueIndex]}`][type] != null
    }

    const isCanvasReady = () => {
        // Checks if both canvas and hidden canvas refs already exist

        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current
        return canvas && hiddenCanvas
    }

    function hasColoredImageData(data: string | RequestState) {
        return data != null && data !== RequestState.NO_CONTENT && data !== RequestState.ERROR
    }

    const draw = async () => {
        if (!isDrawing) {
            return
        }

        if (!isCanvasReady()) {
            setIsDrawing(false)
            return
        }

        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current

        // Clear previous content
        clearCanvas(canvas)

        const imagesToLoad = []
        const drawImageCallback = (img: HTMLImageElement) => drawImage(canvas, img)
        const drawColoredImageCallback = (color: string) => (img: HTMLImageElement) => drawColoredImage(canvas, hiddenCanvas, img, color)


        // Get grid
        const grid = atlas.getGridSrc(segments[selectedValueIndex], gridType)
        if (grid) {
            imagesToLoad.push({src: grid, draw: drawImageCallback})
        }

        // Get annotation
        const background = atlas.getImageSrc(DensityImages.GREY_AND_WHITE_MATTER, segments[selectedValueIndex])
        if (background) {
            imagesToLoad.push({src: background, draw: drawImageCallback})
        }

        for (const pId of Object.keys(content)) {
            // @ts-ignore
            const color = activePopulationsColorMap[pId]

            // Get probability map
            if (overlaysSwitchState[PROBABILITY_MAP_ID]) {
                // @ts-ignore
                const pData = content[pId][DensityMapTypes.PROBABILITY_DATA]
                if (hasColoredImageData(pData)) {
                    imagesToLoad.push({src: pData, draw: (drawColoredImageCallback(color))})
                }
            }

            // Get neuron centroids
            if (overlaysSwitchState[NEURONAL_LOCATIONS_ID]) {
                // @ts-ignore
                const cData = content[pId][DensityMapTypes.CENTROIDS_DATA]
                if (hasColoredImageData(cData)) {
                    imagesToLoad.push({src: cData, draw: (drawColoredImageCallback(color))})
                }
            }
        }

        // Get laminas
        for (const lId of Object.keys(laminas)) {
            // @ts-ignore
            if (laminas[lId].selected) {
                const laminaData = atlas.getLaminaSrc(lId, segments[selectedValueIndex], laminaType)
                if (laminaData) {
                    imagesToLoad.push({src: laminaData, draw: (drawColoredImageCallback(laminas[lId].color))})
                }
            }
        }

        // Get canal
        const canal = atlas.getImageSrc(DensityImages.CANAL, segments[selectedValueIndex])
        if (canal) {
            imagesToLoad.push({src: canal, draw: drawImageCallback})
        }


        Promise.all(loadImages(imagesToLoad)).then((imagesContainer: any) =>
            imagesContainer.forEach((iCt: any) => iCt.draw(iCt.img)))
        setIsDrawing(false)
    }


    useDidUpdateEffect(() => {
        setIsDrawing(true)
        const promise1 = updateProbabilityMap()
        const promise2 = updateCentroids();
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [selectedValueIndex, isComponentReady])

    useDidUpdateEffect(() => {
        setIsDrawing(true)
        const promise1 = updateProbabilityMap()
        const promise2 = updateCentroids();
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [activePopulationsHash])

    useDidUpdateEffect(() => {
        setIsDrawing(true)
        const promise = updateProbabilityMap();
        if (promise) {
            promise.then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [overlaysSwitchState[PROBABILITY_MAP_ID]])

    useDidUpdateEffect(() => {
        setIsDrawing(true)
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
        draw().catch(console.error)
    }, [content, laminas, laminaType, gridType])

    useEffect(() => {
        setIsComponentReady(true)
    }, [])

    useEffect(() => {
        scrollStop(canvasRef.current,
            (e) => onWheel(e, cursorRef, segments.length, (n) => setSelectedValueIndex(n)),
            () => handleSegmentChange(cursorRef.current))
    }, [canvasRef])

    useEffect(() => {
        canvasContainerRef.current.addEventListener('keydown',
            (e: { keyCode: number }) => onKeyboard(e, cursorRef, segments.length, (n) => setSelectedValueIndex(n)),
            false);
    }, [canvasContainerRef])

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
        setIsDrawing(true)
        setLaminas({...laminas, [laminaId]: {...laminas[laminaId], selected: !laminas[laminaId].selected}})
    }

    const handleShowAllLaminaSwitch = () => {
        setIsDrawing(true)
        const areAllLaminasActive = areAllSelected(laminas)
        const nextLaminas: any = {}
        Object.keys(laminas).forEach(lId => nextLaminas[lId] = {...laminas[lId], selected: !areAllLaminasActive})
        setLaminas(nextLaminas)
    }

    const handleLaminaPopoverClick = (event: React.MouseEvent<HTMLSpanElement>, id: string) => {
        setLaminaPopoverAnchorEl(event.currentTarget);
        setSelectedLaminaPopoverId(id);
    };

    const handleLaminaPopoverClose = () => {
        setLaminaPopoverAnchorEl(null);
        setSelectedLaminaPopoverId(null);
    };


    const handleLaminaColorChange = (id: string, color: string, opacity: number) => {
        if (laminas[id].selected) {
            setIsDrawing(true)
        }
        setLaminas({...laminas, [id]: {...laminas[id], color, opacity}})
    }


    const handleLaminaTypeChange = (value: string) => {
        if (areSomeSelected(laminas)) {
            setIsDrawing(true)
        }
        // @ts-ignore
        setLaminaType(value)
    }

    const handleGridTypeChange = (value: string) => {
        setIsDrawing(true)
        // @ts-ignore
        setGridType(value);
    };

    const handleLaminaBaseColorChange = (hexColor: string) => {
        setLaminaBaseColor(hexColor)
        if (areSomeSelected(laminas)) {
            setIsDrawing(true)
        }
        const shades = getLaminaShades(Object.keys(laminas).length, hexColor)
        const nextLaminas = {...laminas}
        Object.keys(nextLaminas).forEach((lk, idx) => nextLaminas[lk].color = shades[idx])
        setLaminas(nextLaminas)
    }

    const handleSnackbarOpen = () => {
        if (showSnackbar) {
            setIsSnackbarOpen(true)
        }
    };

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsSnackbarOpen(false);
        setShowSnackbar(false)
    };

    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, minHeight: "100%", height: HEIGHT}
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
                        paper: `${classes.popover} scrollbar`
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
                            onOpen={() => handleSnackbarOpen()}
                            onChange={(event) => handleSegmentChange(event.target.value as number)}
                            MenuProps={{classes: {paper: classes.selectMenu}}}
                        >
                            {segments.map((segment, idx) =>
                                <MenuItem key={segment} value={idx}> {segment} </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {Object.keys(laminas).length > 0 &&
                        <Fragment>
                            <Box onClick={() => setIsSubRegionsOpen(!isSubRegionsOpen)}
                                 className={`${classes.entryPadding} ${classes.menuButtonContainer}`}>
                                <Typography className={classes.menuFontSize}>Subregions</Typography>
                                {isSubRegionsOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </Box>
                            <Collapse in={isSubRegionsOpen} timeout="auto" unmountOnExit={true}
                                      className={`${classes.collapse}`}>
                                <Box className={classes.laminaTopLabelContainer}>
                                    <LaminaPicker onLaminaStyleChange={(v: string) => handleLaminaTypeChange(v)}
                                                  onLaminaBaseColorChange={(hexColor: string) => handleLaminaBaseColorChange(hexColor)}
                                                  baseColor={laminaBaseColor}/>
                                    <FormControlLabel
                                        className={`${classes.entryPadding} ${classes.laminaLabel}`}
                                        control={
                                            <Switch/>
                                        }
                                        label={"All subregions"}
                                        labelPlacement="start"
                                        onChange={() => handleShowAllLaminaSwitch()}
                                        checked={areAllSelected(laminas)}
                                    />
                                </Box>
                                {Object.keys(laminas).sort(alphanumericCollator.compare).map(lId =>
                                    <span key={lId} className={`${classes.entryPadding} ${classes.laminaEntry}`}>
                                        <span className={classes.laminaColor}
                                              onClick={(event) => handleLaminaPopoverClick(event, lId)}>
                                            <Box
                                                style={{backgroundColor: getRGBAString(getRGBAFromHexAlpha(laminas[lId].color, laminas[lId].opacity))}}
                                                component="span"
                                                className={classes.square}/>
                                            <ArrowDropDownIcon fontSize='small'/>
                                        </span>
                                        <Popover
                                            open={lId === selectedLaminaPopoverId}
                                            anchorEl={laminaPopoverAnchorEl}
                                            onClose={handleLaminaPopoverClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <ColorPicker
                                                selectedColor={getRGBAFromHexAlpha(laminas[lId].color, laminas[lId].opacity)}
                                                handleColorChange={(color: string, opacity: number) =>
                                                    handleLaminaColorChange(lId, color, opacity)
                                                }/>
                                        </Popover>
                                        <FormControlLabel
                                            className={`${classes.label}`}
                                            key={lId}
                                            control={<Switch/>}
                                            label={<SwitchLabel label={lId}/>}
                                            labelPlacement="start"
                                            onChange={() => handleLaminaSwitch(lId)}
                                            checked={laminas[lId].selected}
                                        />
                                    </span>
                                )}
                            </Collapse>
                        </Fragment>
                    }
                    {Object.keys(OVERLAYS).map(oId =>
                        <FormControlLabel
                            className={classes.entryPadding}
                            key={oId}
                            control={<Switch/>}
                            label={<OverlayLabel label={OVERLAYS[oId].name}/>}
                            labelPlacement="start"
                            onChange={() => handleOverlaySwitch(oId)}
                            checked={overlaysSwitchState[oId]}
                        />
                    )}
                    <FormControl className={`${classes.dropdownContainer}`}>
                        <Select
                            className={`${classes.menuFontSize}`}
                            disableUnderline={true}
                            value={gridType}
                            onChange={(event) => handleGridTypeChange(event.target.value)}
                            MenuProps={{classes: {paper: classes.selectMenu}}}
                        >
                            {Object.values(GridTypes).map((type, idx) =>
                                <MenuItem key={idx} value={type}> {type.value} </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Popover>
                <Snackbar
                    open={isSnackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <SnackbarAlert onClose={handleSnackbarClose} severity="info">
                        {TWO_D_VIEWER_SNACKBAR_MESSAGE}
                    </SnackbarAlert>
                </Snackbar>
            </Box>
            <Box className={classes.densityMapImageContainer} ref={canvasContainerRef} tabIndex="0">
                <canvas hidden={true} ref={hiddenCanvasRef}/>
                <canvas hidden={isDrawing} className={classes.densityMapImage} ref={canvasRef}
                        width={atlas.gridDimensions.width} height={atlas.gridDimensions.height}/>
            </Box>
        </Box>
    );
};

export default TwoDViewer