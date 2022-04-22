import React, {useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {canvasBg, headerBorderColor} from "../theme";
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
import CORD from "../assets/images/cord.png";
import {Population} from "../apiclient/workspaces";
import {AtlasChoice} from "../utilities/constants";
import workspaceService from "../service/WorkspaceService";

const useStyles = makeStyles({
    placeholder: {
        height: "100%",
        margin: 0,
    },
    densityMapImage: {
        height: "100%",
        width: "100%",
        objectFit: "contain",
        margin: 0,
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
        border: `1px solid ${headerBorderColor}`
    },
    cordImageContainer: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center'
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
    selectedAtlas: AtlasChoice, selectedValue: string, onChange: (value: string) => void
}) => {
    const api = workspaceService.getApi()
    const {experimentId, activePopulations, selectedAtlas, onChange} = props
    const [selectedValue, setSelectedValue] = React.useState(props.selectedValue);
    const [densityRequest, setDensityRequest] = React.useState({
        loading: false,
        data: null,
    });

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange(value)
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.retrieveDensityMapExperiment(experimentId, selectedAtlas, selectedValue, activePopulations.map(p => p.id), {responseType: 'blob'})
            setDensityRequest({loading: false, data: URL.createObjectURL(response.data)})
        }
        if (!(selectedValue && activePopulations.length > 0 && selectedAtlas)) {
            return
        }
        setDensityRequest({loading: true, data: null})
        fetchData()
            .catch(() => setDensityRequest({loading: false, data: null}));

    }, [selectedValue, activePopulations, selectedAtlas])

    const subdivisions = props.subdivisions.sort()
    const classes = useStyles();
    // @ts-ignore
    const boxStyle = {flexGrow: 1, background: canvasBg, padding: "1rem"}
    const gridStyle = {className: `${classes.container} ${classes.border}`, container: true, columns: 2}
    const content = selectedValue === null ? <Typography>{NO_SUBREGION}</Typography> :
        activePopulations.length === 0 ? <Typography>{NO_POPULATIONS}</Typography> :
            densityRequest.loading ? <p className={classes.placeholder}>Density Map Loading... </p> :
                densityRequest.data ? <img className={classes.densityMapImage}
                                           src={densityRequest.data} alt={"Density Map"}/> :
                    null
    return (
        <Box sx={boxStyle}>
            <Grid {...gridStyle}>
                <Grid item={true} xs={4}>
                    <Box className={`${classes.cordImageContainer} ${classes.border}`}>
                        <img src={CORD} width="80%" height="80%" alt={"Cord"}/>
                    </Box>
                    <Box>
                        <FormControl className={classes.fullWidth}>
                            <RadioGroup
                                aria-labelledby="segments-radio-buttons-group-label"
                                name={RADIO_GROUP_NAME}
                            >
                                {subdivisions.map(sId => (
                                        <Box key={sId} className={classes.border}>
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
                    {content}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DensityMap