import React from "react";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const SnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default SnackbarAlert