import React from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
// @ts-ignore
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import { common } from "../header/ExperimentDialog/Common";


export const PdfFileDrop = ({ file, setFile, children } : any) => {
    
    const commonClasses = common();

    return (
        <Grid container={true} item={true} spacing={3}>
            <>
                {!file ? (
                    <Grid item={true} xs={12} sm={12}>
                        {children}
                    </Grid>
                ) : (
                    <Grid item={true} xs={12} sm={12}>
                        <Typography className={commonClasses.fileLabel}>PDF</Typography>
                        <Box className={commonClasses.progress}>
                            <Typography>
                                <img src={CHECK_FILLED} alt="check"/>
                                {file.name}
                            </Typography>
                            <Button disableRipple={true}
                                    onClick={() => setFile(null)}>Remove</Button>
                        </Box>
                    </Grid>)
                }
            </>
        </Grid>
    );
};