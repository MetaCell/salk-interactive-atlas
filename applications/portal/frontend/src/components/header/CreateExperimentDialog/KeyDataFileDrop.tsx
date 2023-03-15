import React, {Fragment, useState} from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
// @ts-ignore
import UPLOAD from "../../../assets/images/icons/upload.svg";
// @ts-ignore
import CHECK_FILLED from "../../../assets/images/icons/check_filled.svg";
import {common, UploadIcon} from "./Common";





export const KeyDataFileDrop = ({setKeyFile, setDataFile, keyFile, dataFile, hasKeyErrors, hasDataErrors}: any) => {
    const commonClasses = common();

    const handleFileUpload = (files: any, setFileState: (value: any) => void) => {
        if (files.length > 0) {
            setFileState(files[0])
        }
    }

    const dropzoneClass = hasKeyErrors ? commonClasses.errorBorder : ""

    return (
        <Grid container={true} item={true} spacing={3}>
            <Fragment>
                {!keyFile ? (
                    <Grid item={true} xs={12} sm={6}>
                        <Typography className={commonClasses.fileLabel}>Key file</Typography>
                        <DropzoneArea
                            dropzoneClass={dropzoneClass}
                            onChange={(files: any) => handleFileUpload(files, (value) => setKeyFile(value))}
                            dropzoneText="Select your key file or drop it here"
                            Icon={UploadIcon}
                            showPreviews={false}
                            showPreviewsInDropzone={false}
                            filesLimit={1}
                            showAlerts={['error']}
                            classes={{icon: "MuiButton-outlined primary"}}
                        />
                    </Grid>
                ) : (
                    <Grid item={true} xs={12} sm={6}>
                        <Typography className={commonClasses.fileLabel}>Key file</Typography>
                        <Box className={commonClasses.progress}>
                            <Typography>
                                <img src={CHECK_FILLED} alt="check"/>
                                {keyFile.name}
                            </Typography>
                            <Button disableRipple={true}
                                    onClick={() => setKeyFile(null)}>Remove</Button>
                        </Box>
                    </Grid>)
                }
                {!dataFile ? (
                    <Grid item={true} xs={12} sm={6}>
                        <Typography className={commonClasses.fileLabel}>Data file</Typography>
                        <DropzoneArea
                            dropzoneClass={dropzoneClass}
                            onChange={(files: any) => handleFileUpload(files, (value) => setDataFile(value))}
                            dropzoneText="Select your data file or drop it here"
                            Icon={UploadIcon}
                            showPreviews={false}
                            showPreviewsInDropzone={false}
                            filesLimit={1}
                            showAlerts={['error']}
                            classes={{icon: "MuiButton-outlined primary"}}
                            maxFileSize={300000000}
                        />
                    </Grid>
                ) : (
                    <Grid item={true} xs={12} sm={6}>
                        <Typography className={commonClasses.fileLabel}>Data file</Typography>
                        <Box className={commonClasses.progress}>
                            <Typography>
                                <img src={CHECK_FILLED} alt="check"/>
                                {dataFile.name}
                            </Typography>
                            <Button disableRipple={true}
                                    onClick={() => setDataFile(null)}>Remove</Button>
                        </Box>
                    </Grid>
                )}
            </Fragment>
        </Grid>
    );
};