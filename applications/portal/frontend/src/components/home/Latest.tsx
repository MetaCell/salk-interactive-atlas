import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: "left",
  },
  partners: {

    fontSize: "0.9em",
    marginBottom: "0.5em",
  }
}));

export const Latest = () => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" className="verticalFill">
      <Typography component="h2" variant="h6" gutterBottom={true}>
        Disclaimer
     </Typography>
      <Box mt={3} flexGrow="1"  >
        <Typography>
          This is a alpha release of version 0.0.1 of the SALK Spinal Cord Atlas platform, which is under active development and testing.
        </Typography>
        <br />
        <Typography>
          <strong>User accounts and data are subject to change without notice.</strong>
        </Typography>
        <br />

      </Box>

    </Box>
  );
};
