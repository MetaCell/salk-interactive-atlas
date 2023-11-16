import React, { Fragment, useState } from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
// @ts-ignore
import UPLOAD from "../../../assets/images/icons/upload.svg";
// @ts-ignore
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import { common, UploadIcon } from "../header/ExperimentDialog/Common";


export const AddPdfFileDrop = ({ file, setFile, hasErrors }: any) => {
    const commonClasses = common();

    const handleFileUpload = (files: any) => {
        console.log("files another: " ,files)
        setFile(files.target.value)
    }

    return (
        <Grid container={true} item={true} spacing={3}>
            <Fragment>
                {!file ? (
                    <Grid item={true} xs={12} sm={12}>
                        <Button component="label"><input
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={(files: any) => handleFileUpload(files)}
                        />
                            + Add another file
                        </Button>
                    </Grid>
                ) : (
                    <Grid item={true} xs={12} sm={12}>
                        <Typography className={commonClasses.fileLabel}>PDF</Typography>
                        <Box className={commonClasses.progress}>
                            <Typography>
                                <img src={CHECK_FILLED} alt="check" />
                                {file.name}
                            </Typography>
                            <Button disableRipple={true}
                                onClick={() => setFile(null)}>Remove</Button>
                        </Box>
                    </Grid>)
                }
            </Fragment>
        </Grid>
    );
};