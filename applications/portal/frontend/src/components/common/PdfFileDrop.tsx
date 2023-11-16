import React, {Fragment} from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
// @ts-ignore
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import { common, UploadIcon } from "../header/ExperimentDialog/Common";


export const PdfFileDrop = ({ file, setFile, hasErrors } : any) => {
    const commonClasses = common();

    const handleFileUpload = (files: any) => {
        if (files.length > 0) {
            setFile(files[0])
        }
    }

    return (
        <Grid container={true} item={true} spacing={3}>
            <Fragment>
                {!file ? (
                    <Grid item={true} xs={12} sm={12}>
                        <Typography className={commonClasses.fileLabel}>PDF</Typography>
                        <DropzoneArea
                            dropzoneClass={`${hasErrors ? commonClasses.errorBorder : ""}`}
                            onChange={(files: any) => handleFileUpload(files)}
                            dropzoneText="Select your PDF(s) or drop it here"
                            Icon={UploadIcon}
                            showPreviews={false}
                            showPreviewsInDropzone={false}
                            filesLimit={1}
                            showAlerts={['error']}
                            classes={{icon: "MuiButton-outlined primary"}}
                        />
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
            </Fragment>
        </Grid>
    );
};