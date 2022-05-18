import React, {useEffect, useRef} from 'react';
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
import {AtlasChoice, PROBABILITY_MAP_ID, REQUEST_STATE} from "../utilities/constants";
import workspaceService from "../service/WorkspaceService";
import CordImageMapper from "./CordImageMapper";
import {getAtlas} from "../service/AtlasService";
import {clearCanvas, drawColoredImage, drawImage} from "../service/CanvasService";


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
const ROSTRAL = "Rostral"
const CAUDAL = "Caudal"
const NO_POPULATIONS = "No population(s) selected to generate the heatmap"
const NO_SUBREGION = "No subregion selected to generate the heatmap"
const NO_CELLS = "Selected region has no active cells"
const ERROR = "Something went wrong"

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
    const activePopulationsColorMap = activePopulations.reduce((acc, pop) => {
        return {...acc, [pop.id]: pop.color}
    }, {})
    // FIXME: useEffect was detecting activePopulations changes although the object content wasn't changing
    // Line below is a workaround to fix the issue
    const activePopulationIds = activePopulations.map(pop => pop.id).sort().toString()
    const atlas = getAtlas(props.selectedAtlas)
    const canvasRef = useRef(null)
    const hiddenCanvasRef = useRef(null)
    const [selectedValue, setSelectedValue] = React.useState('');
    const [probabilityData, setProbabilityData] = React.useState({});
    const [centroidsData, setCentroidsData] = React.useState({});
    const [isDrawingReady, setIsDrawingReady] = React.useState(false);

    const handleChange = (value: string) => {
        setSelectedValue(value);
    };

    const fetchData = async (population: Population, apiMethod: (id: string, subdivision: string, options: any) => Promise<any>) => {
        const response = await apiMethod(population.id.toString(), selectedValue, {responseType: 'blob'})
        if (response.status === 200) {
            // @ts-ignore
            return {'id': population.id, 'data': URL.createObjectURL(response.data)}
        } else if (response.status === 204) {
            return {'id': population.id, 'data': REQUEST_STATE.NO_CONTENT}
        }
        return {'id': population.id, 'data': REQUEST_STATE.ERROR}
    }

    function getCentroids() {
        if (selectedValue) {
            if (showNeuronalLocations) {
                Promise.all(activePopulations.map(p =>
                    fetchData(p, (id, subdivision, options) => api.centroidsPopulation(id, subdivision, options))))
                    .then(centroidsResponses => {
                        const cData = centroidsResponses.reduce((acc, res) => {
                            const {id, data} = res;
                            return {...acc, [id]: data};
                        }, {});
                        setCentroidsData(cData)
                    })
            } else {
                setCentroidsData({})
            }
        } else {
            setCentroidsData({})
        }
    }

    function getProbabilityMap() {
        if (selectedValue) {
            if (showProbabilityMap) {
                Promise.all(activePopulations.map(p =>
                    fetchData(p, (id, subdivision, options) => api.probabilityMapPopulation(id, subdivision, options))))
                    .then(probabilityMapResponses => {
                        const probData = probabilityMapResponses.reduce((acc, res) => {
                            const {id, data} = res;
                            return {...acc, [id]: data};
                        }, {});
                        setProbabilityData(probData)
                    })
            } else {
                setProbabilityData({})
            }
        } else {
            setProbabilityData({})
        }
    }

    const drawContent = async () => {
        if (!selectedValue) {
            setIsDrawingReady(true)
            return
        }
        const canvas = canvasRef.current
        const hiddenCanvas = hiddenCanvasRef.current
        if (canvas == null || hiddenCanvas == null) {
            setIsDrawingReady(true)
            return
        }

        // Clear previous content
        clearCanvas(canvas)
        const background = atlas.getAnnotationImageSrc(selectedValue)
        if (background) {
            drawImage(canvas, background)
        }
        const promises = []
        if (showProbabilityMap && probabilityData) {
            // @ts-ignore
            for (const pId of Object.keys(probabilityData)) {
                // @ts-ignore
                const data = probabilityData[pId]
                if (data !== REQUEST_STATE.NO_CONTENT && data !== REQUEST_STATE.ERROR) {
                    // @ts-ignore
                    promises.push(drawColoredImage(canvas, hiddenCanvas, data, activePopulationsColorMap[pId]))
                }
            }
        }
        if (showNeuronalLocations && centroidsData) {
            // @ts-ignore
            for (const pId of Object.keys(centroidsData)) {
                // @ts-ignore
                const data = centroidsData[pId]
                if (data !== REQUEST_STATE.NO_CONTENT && data !== REQUEST_STATE.ERROR) {
                    // @ts-ignore
                    promises.push(drawColoredImage(canvas, hiddenCanvas, data, activePopulationsColorMap[pId]))
                }
            }
        }
        await Promise.all(promises)
        setIsDrawingReady(true)
    }

    useEffect(() => {
        getProbabilityMap()
        getCentroids();
        setIsDrawingReady(false)

    }, [selectedValue, activePopulationIds])

    useEffect(() => {
        getProbabilityMap();
        setIsDrawingReady(false)
    }, [showProbabilityMap])

    useEffect(() => {
        getCentroids();
        setIsDrawingReady(false)
    }, [showNeuronalLocations])

    useEffect(() => {
        drawContent().catch(console.error)
    }, [centroidsData, probabilityData])

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
                    <Loader active={!isDrawingReady}/>
                    <canvas hidden={true} ref={hiddenCanvasRef}/>
                    <canvas hidden={!isDrawingReady} className={classes.densityMapImage} ref={canvasRef}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DensityMap