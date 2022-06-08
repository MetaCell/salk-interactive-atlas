import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {canvasBg} from "../theme";
import {
    Box, Button,
    FormControl,
    Grid,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// @ts-ignore
import Loader from "@metacell/geppetto-meta-ui/loader/Loader";
// @ts-ignore
import {Population} from "../apiclient/workspaces";
import {AtlasChoice, CAUDAL, DensityMapTypes, RequestState, ROSTRAL} from "../utilities/constants";
import workspaceService from "../service/WorkspaceService";
import CordImageMapper from "./CordImageMapper";
import {getAtlas} from "../service/AtlasService";
import {clearCanvas, drawColoredImage, drawImage} from "../service/CanvasService";
import {mod} from "../utilities/functions";
import {useDidUpdateEffect} from "../utilities/hooks/useDidUpdateEffect";

const HEIGHT = "calc(100% - 55px)"

const useStyles = makeStyles({
    placeholder: {
        height: "100%",
        margin: 0,
    },
    densityMapImage: {
        width: "100%",
        objectFit: "contain",
        margin: 0,
        position: "sticky",
        top: 0
    },
    container: {
        background: "#323436",
        height: "100%"
    },
    buttonContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between'
    },
    radioContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'flex-start'
    },
    radio: {
        marginRight: "1rem"
    },
    fullWidth: {
        width: "100%"
    },
    border: {
        border: `1px solid rgba(255, 255, 255, 0.05)`,
        borderRadius: "4px 4px 4px 4px"
    },
    subsectionBorder: {
        borderTop: `1px solid rgba(255, 255, 255, 0.05)`,
        borderRight: `1px solid rgba(255, 255, 255, 0.05)`,
    },
    cordImageContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center',
        borderRight: `1px solid rgba(255, 255, 255, 0.05)`
    },
    fontSize: {
        fontSize: "0.75rem"
    },
    subdivisionsContainer: {
        height: HEIGHT,
        overflow: "auto"
    }
});

const RADIO_GROUP_NAME = "segments-radio-buttons-group"
const SEPARATOR = '_'

// @ts-ignore
const RadioButton = ({onChange, isChecked, label}) => {
    const classes = useStyles();

    return (
        <Button className={`${classes.buttonContainer} ${classes.fullWidth}`} onClick={() => onChange(label)}>
            <span className={classes.radioContainer}>
                <Radio
                    checked={isChecked}
                    value={label}
                    name={RADIO_GROUP_NAME}
                    className={classes.radio}
                />
                <Typography className={classes.fontSize}>{label}</Typography>
            </span>
            <ArrowForwardIosIcon className={classes.fontSize}/>
        </Button>
    );
}

const TwoDViewer = (props: {
    subdivisions: string[], activePopulations: Population[],
    selectedAtlas: AtlasChoice,
    showProbabilityMap: boolean,
    showNeuronalLocations: boolean,
    invalidCachePopulations: Set<string>
}) => {
    const api = workspaceService.getApi()
    const {activePopulations, selectedAtlas, showProbabilityMap, showNeuronalLocations, invalidCachePopulations} = props
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

    const handleChange = (value: number) => {
        setSelectedValueIndex(value);
    };

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
            if (showNeuronalLocations) {
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
            if (showProbabilityMap) {
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
        return showNeuronalLocations || showProbabilityMap
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
            if (showProbabilityMap) {
                // @ts-ignore
                const pData = content[pId][DensityMapTypes.PROBABILITY_DATA]
                const promise = getDrawColoredImagePromise(pData, canvas, hiddenCanvas, pId);
                if (promise) {
                    promises.push(promise)
                }
            }
            if (showNeuronalLocations) {
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
    }, [showProbabilityMap])

    useDidUpdateEffect(() => {
        setIsLoading(true)
        const promise = updateCentroids()
        if (promise) {
            promise.then(() => setContent(getActiveContent()))
        } else {
            setContent(getActiveContent())
        }
    }, [showNeuronalLocations])

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

    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem", minHeight: "100%", height: HEIGHT}
    const gridStyle = {className: `${classes.container} ${classes.border}`, container: true, columns: 2, height: HEIGHT}
    const subdivisionsGridStyle = {height: HEIGHT}
    return (
        <Box sx={boxStyle}>
            <Grid {...gridStyle}>
                <Grid item={true} xs={4} style={{...subdivisionsGridStyle}}>
                    <Box className={`${classes.cordImageContainer}`}>
                        <CordImageMapper
                            segments={segments}
                            selected={selectedValueIndex}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box className={`scrollbarStyle ${classes.subdivisionsContainer}`}>
                        <FormControl className={classes.fullWidth}>
                            <RadioGroup
                                aria-labelledby="segments-radio-buttons-group-label"
                                name={RADIO_GROUP_NAME}
                            >
                                {subdivisions.map((sId, idx) => (
                                        <Box key={sId} className={classes.subsectionBorder}>
                                            <RadioButton
                                                onChange={() => handleChange(idx * 2)}
                                                isChecked={segments[selectedValueIndex] === `${sId}-${ROSTRAL}`}
                                                label={`${sId}-${ROSTRAL}`}
                                            />
                                            <RadioButton
                                                onChange={() => handleChange(idx * 2 + 1)}
                                                isChecked={segments[selectedValueIndex] === `${sId}-${CAUDAL}`}
                                                label={`${sId}-${CAUDAL}`}
                                            />
                                        </Box>
                                    )
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item={true} xs={8}>
                    <Loader active={isLoading}/>
                    <canvas hidden={true} ref={hiddenCanvasRef}/>
                    <canvas hidden={isLoading} className={classes.densityMapImage} ref={canvasRef}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TwoDViewer