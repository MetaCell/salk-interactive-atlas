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
import {areEqual, differenceSet} from "../utilities/functions";


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
    }
});

const RADIO_GROUP_NAME = "segments-radio-buttons-group"

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

const DensityMap = (props: {
    subdivisions: string[], activePopulations: Population[],
    selectedAtlas: AtlasChoice,
    showProbabilityMap: boolean, showNeuronalLocations: boolean,
}) => {
    const api = workspaceService.getApi()
    const {activePopulations, selectedAtlas, showProbabilityMap, showNeuronalLocations} = props
    const activePopulationsMap = activePopulations.reduce((acc, pop) => {
        return {...acc, [pop.id.toString()]: pop}
    }, {})
    const atlas = getAtlas(props.selectedAtlas)
    const canvasRef = useRef(null)
    const hiddenCanvasRef = useRef(null)
    const [selectedValue, setSelectedValue] = useState('');
    const [content, setContent] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const _data = useRef({});

    const handleChange = (value: string) => {
        setSelectedValue(value);
    };

    const fetchData = async (population: Population, apiMethod: (id: string, subdivision: string, options: any) => Promise<any>) => {
        const response = await apiMethod(population.id.toString(), selectedValue, {responseType: 'blob'})
        if (response.status === 200) {
            // @ts-ignore
            return {'id': population.id, 'data': URL.createObjectURL(response.data)}
        } else if (response.status === 204) {
            return {'id': population.id, 'data': RequestState.NO_CONTENT}
        }
        return {'id': population.id, 'data': RequestState.ERROR}
    }

    function updateCentroids(forceFetch = false) {
        if (selectedValue) {
            if (activePopulations.length > 0) {
                if (showNeuronalLocations) {
                    const fetchFilter = forceFetch ? (_: Population) => true : (p: Population) => needsFetch(p, DensityMapTypes.CENTROIDS_DATA)
                    return Promise.all(activePopulations.filter(fetchFilter).map(p =>
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
    }

    function updateProbabilityMap(forceFetch = false) {
        if (selectedValue) {
            if (activePopulations.length > 0) {
                if (showProbabilityMap) {
                    const fetchFilter = forceFetch ? (_: Population) => true : (p: Population) => needsFetch(p, DensityMapTypes.PROBABILITY_DATA)
                    return Promise.all(activePopulations.filter(fetchFilter).map(p =>
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
    }

    const updateData = (newData: { [x: string]: any; }, type: DensityMapTypes) => {
        Object.keys(newData).forEach(id => {
            // @ts-ignore
            const pop = activePopulationsMap[id]
            // @ts-ignore
            _data.current[id] = {..._data.current[id], population: pop, [type]: newData[id]}
        })
    }

    const removeInactivePopulations = () => {
        const previous = new Set(Object.keys(content))
        const current = new Set(activePopulations.map(pop => pop.id.toString()))
        const toRemove = differenceSet(previous, current)
        // @ts-ignore
        toRemove.forEach(id => delete _data.current[id])
    }

    const needsFetch = (pop: Population, type: DensityMapTypes) => {
        const id = pop.id.toString()
        if (Object.keys(_data.current).includes(id)) {
            // @ts-ignore
            return _data.current[id][type] == null || !areEqual(_data.current[id].population, pop)
        }
        return true
    }

    const hasSomethingToDraw = () => {
        return selectedValue && (showNeuronalLocations || showProbabilityMap)
    }

    const isCanvasReady = () => {
        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current
        return canvas && hiddenCanvas
    }

    function getDrawColoredImagePromise(data: string | RequestState, canvas: null, hiddenCanvas: null, pId: string) {
        if (data != null && data !== RequestState.NO_CONTENT && data !== RequestState.ERROR) {
            // TODO: Also consider population opacity for the color?
            // @ts-ignore
            return drawColoredImage(canvas, hiddenCanvas, data, activePopulationsMap[pId].color)
        }
    }

    const drawContent = async () => {
        if (!isLoading){
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
        const background = atlas.getAnnotationImageSrc(selectedValue)
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


    useEffect(() => {
        setIsLoading(true)
        removeInactivePopulations()
        const promise1 = updateProbabilityMap(true)
        const promise2 = updateCentroids(true);
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent({..._data.current}))
        } else {
            setContent({..._data.current})
        }
    }, [selectedValue])

    useEffect(() => {
        setIsLoading(true)
        removeInactivePopulations()
        const promise1 = updateProbabilityMap()
        const promise2 = updateCentroids();
        if (promise1 || promise2) {
            Promise.all([promise1, promise2].filter(p => p != null)).then(() => setContent({..._data.current}))
        } else {
            setContent({})
        }
    }, [activePopulations])

    useEffect(() => {
        setIsLoading(true)
        const promise = updateProbabilityMap();
        if (promise) {
            promise.then(() => setContent({..._data.current}))
        } else {
            // @ts-ignore
            Object.keys(_data.current).forEach(id => delete _data.current[id][DensityMapTypes.PROBABILITY_DATA])
            setContent({..._data.current})
        }
    }, [showProbabilityMap])

    useEffect(() => {
        setIsLoading(true)
        const promise = updateCentroids()
        if (promise) {
            promise.then(() => setContent({..._data.current}))
        } else {
            // @ts-ignore
            Object.keys(_data.current).forEach(id => delete _data.current[id][DensityMapTypes.CENTROIDS_DATA])
            setContent({..._data.current})
        }
    }, [showNeuronalLocations])

    useEffect(() => {
        drawContent().catch(console.error)
    }, [content])

    const subdivisions = props.subdivisions.sort()
    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem", minHeight: "100%"}
    const gridStyle = {className: `${classes.container} ${classes.border}`, container: true, columns: 2}
    return (
        <Box sx={boxStyle}>
            <Grid {...gridStyle}>
                <Grid item={true} xs={4}>
                    <Box className={`${classes.cordImageContainer}`}>
                        <CordImageMapper
                            segments={subdivisions.flatMap((s) => [`${s}-${ROSTRAL}`, `${s}-${CAUDAL}`])}
                            selected={selectedValue}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box>
                        <FormControl className={classes.fullWidth}>
                            <RadioGroup
                                aria-labelledby="segments-radio-buttons-group-label"
                                name={RADIO_GROUP_NAME}
                            >
                                {subdivisions.map(sId => (
                                        <Box key={sId} className={classes.subsectionBorder}>
                                            <RadioButton
                                                onChange={handleChange}
                                                isChecked={selectedValue === `${sId}-${ROSTRAL}`}
                                                label={`${sId}-${ROSTRAL}`}
                                            />
                                            <RadioButton
                                                onChange={handleChange}
                                                isChecked={selectedValue === `${sId}-${CAUDAL}`}
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

export default DensityMap