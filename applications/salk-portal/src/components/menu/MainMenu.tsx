import * as React from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { MainMenuItem } from "./MainMenuItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles(() => ({
  button: {
    textTransform: "inherit",
    minWidth: "auto",
    width: "auto",
    marginRight: "3em",
    lineHeight: 1,
    fontWeight: 400,
  },
  firstButton: {
    fontWeight: 600,
  },
  flipButton: {
    fontWeight: 700,
    textTransform: "uppercase",
    padding: '5px',
    fontSize: '0.75rem',
  },
}));

export const MainMenu = () => {
  const classes = useStyles();
  const history = useHistory();
  return (

    <Box display="flex" flexWrap="wrap" p={0} bgcolor="background.paper" justifyContent="space-between">
      <Box display="flex" flexWrap="wrap" p={0}>
        <MainMenuItem
          title="Salk"
          className={classes.button + " " + classes.firstButton}
          items={[
            { label: "More", callback: () => window.open("https://www.salk.edu/scientist/martyn-goulding/") },
            { label: "About", callback: () => alert("Salk Spinal Cord Atlas v0.0.1") },
          ]}
        />
        <MainMenuItem
          title="View"
          className={classes.button}
          items={[
            { label: "Experiments", callback: () => history.push("/repositories"), checked: history.location.pathname === "/experiments" },
            { label: "Experiments", callback: () => history.push("/"), checked: history.location.pathname !== "/experiments" },
          ]}
        />
      </Box>
      {
        history.location.pathname === "/" ?
          <MainMenuItem
            title={<>Experiments <ExpandMoreIcon fontSize="small" /></>}
            className={classes.flipButton}
            items={[
              { label: "Experiments", callback: () => history.push("/experiments") },
            ]}
            popperPlacement="bottom-end"
          />
          :
          history.location.pathname === "/experiments" ?
            <MainMenuItem
              title={<>Experiments <ExpandMoreIcon fontSize="small" /></>}
              className={classes.flipButton}
              items={[
                { label: "Experiments", callback: () => history.push("/") },
              ]}
              popperPlacement="bottom-end"
            />
            : null
      }
    </Box>
  );
};

export default MainMenu;
