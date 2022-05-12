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
import {AtlasChoice, REQUEST_STATE} from "../utilities/constants";
import workspaceService from "../service/WorkspaceService";
import CordImageMapper from "./CordImageMapper";
import {getAtlas} from "../service/AtlasService";
import {clearCanvas, drawImage} from "../service/CanvasService";


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
    experimentId: string,
    subdivisions: string[], activePopulations: Population[],
    selectedAtlas: AtlasChoice, selectedValue: string,
    showProbabilityMap: boolean, showNeuronalLocations: boolean,
    onChange: (value: string) => void
}) => {
    const api = workspaceService.getApi()
    const atlas = getAtlas(props.selectedAtlas)
    const canvasRef = useRef(null)
    const {experimentId, activePopulations, selectedAtlas, onChange} = props
    const [selectedValue, setSelectedValue] = React.useState(props.selectedValue);
    const [densityRequest, setDensityRequest] = React.useState({
        loading: false,
        data : null,
        state: null
    });

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange(value)
    };

    const drawContent = () => {
        const canvas = canvasRef.current
        if (canvas == null){
            return
        }

        // Clear previous content
        clearCanvas(canvas)
        const ctx = canvas.getContext('2d')
        const background = atlas.getAnnotationImageSrc(selectedValue)
        if (background){
            drawImage(ctx, background)
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await api.retrieveDensityMapExperiment(experimentId, selectedAtlas, selectedValue, activePopulations.map(p => p.id), {responseType: 'blob'})
    //         if (response.status === 200){
    //             // @ts-ignore
    //             const data =  URL.createObjectURL(response.data)
    //             setDensityRequest({
    //                     loading: false,
    //                     data,
    //                     state: REQUEST_STATE.SUCCESS
    //                 })
    //         }else if (response.status === 204){
    //             setDensityRequest({loading: false, data: null, state: REQUEST_STATE.NO_CONTENT})
    //         }else{
    //             setDensityRequest({loading: false, data: null, state: REQUEST_STATE.ERROR})
    //         }
    //     }
    //     if (!(selectedValue && activePopulations.length > 0 && selectedAtlas)) {
    //         return
    //     }
    //     setDensityRequest({loading: true, data: null, state: null})
    //     fetchData()
    //         .catch(() => setDensityRequest({loading: false, data: null, state: REQUEST_STATE.ERROR}));
    //
    // }, [selectedValue, activePopulations, selectedAtlas])

    const subdivisions = props.subdivisions.sort()
    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem", minHeight: "100%"}
    const gridStyle = {className: `${classes.container} ${classes.border}`, container: true, columns: 2}

    drawContent()

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
                    <canvas ref={canvasRef}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DensityMap