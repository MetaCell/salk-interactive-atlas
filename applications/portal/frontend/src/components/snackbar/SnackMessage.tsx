import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Box } from "@material-ui/core";
import { SNACKBAR_TIMEOUT } from "../../utilities/constants";
import { Alert } from '@material-ui/lab';


export default function SnackMessage(props: any) {
  const { message, setMessage } = props;
  const handleSnackbarClose = () => {
    setMessage('')
  };
  return (
    <Box sx={{
      width: 500,
      position: 'absolute',
    }} >
      <Snackbar open={message !== null && message !== ''} autoHideDuration={SNACKBAR_TIMEOUT} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}