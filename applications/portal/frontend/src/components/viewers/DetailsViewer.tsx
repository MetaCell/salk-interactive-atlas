import React, {SyntheticEvent} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {canvasBg} from "../../theme";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ephys from "../../assets/details/ephys.png";
import {Details} from "../../utilities/constants";

const useStyles = makeStyles({
    container: {
        background: canvasBg,
        height: "100%",
        margin: 0,
    },
});

const DetailsViewer = () => {
    const [expanded, setExpanded] = React.useState <string | false>(false);
    const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };
    const classes = useStyles();
    return <div className={classes.container}>
        <Accordion expanded={expanded === Details.ELECTROPHYSIOLOGY} onChange={handleChange(Details.ELECTROPHYSIOLOGY)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Electrophysiology</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <img src={ephys} alt={"Electrophysiology PDF"}></img>
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === Details.BEHAVIOUR} onChange={handleChange(Details.BEHAVIOUR)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>Behaviour</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <img src={ephys} alt={"Behaviour PDF"}></img>
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === Details.IO} onChange={handleChange(Details.IO)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>I/O Mapping</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <img src={ephys} alt={"I/O Mapping PDF"}></img>
            </AccordionDetails>
        </Accordion>
    </div>
};

export default DetailsViewer