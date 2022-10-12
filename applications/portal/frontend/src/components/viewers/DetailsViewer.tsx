import React, {SyntheticEvent} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {canvasBg} from "../../theme";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// @ts-ignore
import ephys from "../../assets/details/ephys.png";
import {Details, POPULATION_V1, POPULATION_V2} from "../../utilities/constants";

const useStyles = makeStyles({
    container: {
        background: canvasBg,
        height: "100%",
        width: "100%",
        display: "inline-block",
        margin: 0,
    },
    title: {
        paddingLeft: "0.5em"
    }
});

const DetailsViewer = (props: {
    populationName: string | null
}) => {
    const {populationName} = props
    const [expanded, setExpanded] = React.useState <string | false>(false);
    const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const hasEphysPDF = () => populationName.includes(POPULATION_V2)
    const hasBehaviorPDF = () => populationName.includes(POPULATION_V2)
    const hasIOMappingPDF = () => populationName.includes(POPULATION_V1)

    const NoDataAvailable = () => <p> No data available </p>

    const classes = useStyles();
    return populationName !== null ? (<div className={classes.container}>
        <h1 className={classes.title}>{populationName}</h1>
        <Accordion expanded={expanded === Details.ELECTROPHYSIOLOGY} onChange={handleChange(Details.ELECTROPHYSIOLOGY)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Electrophysiology</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {hasEphysPDF() ? (<img src={ephys} alt={"Electrophysiology PDF"}/>) : <NoDataAvailable/>}
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === Details.BEHAVIOUR} onChange={handleChange(Details.BEHAVIOUR)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Behaviour</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {hasBehaviorPDF() ? (<img src={ephys} alt={"Behaviour PDF"}/>) : <NoDataAvailable/>}
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === Details.IO} onChange={handleChange(Details.IO)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>I/O Mapping</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {hasIOMappingPDF() ? (<img src={ephys} alt={"I/O Mapping PDF"}/>) : <NoDataAvailable/>}
            </AccordionDetails>
        </Accordion>
    </div>) : (
        <div className={classes.container}>
            <p className={classes.title}>No population selected</p>
        </div>)
};

export default DetailsViewer