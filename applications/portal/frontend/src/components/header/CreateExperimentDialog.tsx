import React, {useEffect, useState, Fragment} from 'react';
import {Box, Button, Grid, makeStyles, TextField, Typography} from "@material-ui/core";
import {filesBg, headerBorderColor, headerButtonBorderColor, switchActiveColor} from "../../theme";
import Modal from "../common/BaseDialog";
import {DropzoneArea} from 'material-ui-dropzone';
import {TagsAutocomplete} from "../common/ExperimentDialogs/TagsAutocomplete";
import {TextEditor} from "../common/ExperimentDialogs/TextEditor";
import {OwnerInfo} from "../common/ExperimentDialogs/OwnerInfo";
// @ts-ignore
import UPLOAD from "../../assets/images/icons/upload.svg";
// @ts-ignore
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import workspaceService from "../../service/WorkspaceService";
import * as Yup from 'yup'
import {ExperimentTagsInner} from "../../apiclient/workspaces";
// @ts-ignore
import Loader from "@metacell/geppetto-meta-ui/loader/Loader";


const useStyles = makeStyles(() => ({
    fileDrop: {
        boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
        padding: '1rem',
    },

    formGroup: {
        '&:not(:first-child)': {marginTop: '0.75rem'},

        '& label': {
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.005em',
            color: headerButtonBorderColor,
            width: '8rem',
            flexShrink: '0',
        },

        '& .rdw-editor-wrapper': {
            width: 'calc(100% - 8rem)'
        },
    },

    progress: {
        maxWidth: '13rem',
        width: '100%',
        padding: '0.75rem',
        background: filesBg,
        borderRadius: '0.375rem',

        '& .MuiButton-text': {
            padding: 0,
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.01em',
            color: switchActiveColor,
            display: 'block',
            margin: '0 auto',
            '&:hover': {
                backgroundColor: 'transparent'
            },
        },

        '& .MuiTypography-root': {
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.01em',
            color: headerButtonBorderColor,
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '& img': {
                marginRight: '0.25rem'
            },
        },
    },

    bar: {
        '& .MuiLinearProgress-root': {
            flexGrow: 1,
        },

        '& .MuiIconButton-root': {
            padding: 0,
            marginLeft: '0.8rem',

            '&:hover': {
                backgroundColor: 'transparent'
            },
        },
    },

    fileLabel: {
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.005em',
        color: headerButtonBorderColor,
        marginBottom: '.25rem',
    },

    addSet: {
        boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
        padding: '1rem',

        '& .MuiButton-text': {
            padding: 0,
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.01em',
            color: switchActiveColor,
            display: 'block',
            '&:hover': {
                backgroundColor: 'transparent'
            },
        },
    },
    errorBorder: {
        borderColor: "#f44336",
        '&:focus-within': {
            borderColor: '#7b61ff'
        },
    },
    editorWrapper: {
        '&:hover': {
            borderColor: '#fff'
        },
        '&:focus-within': {
            borderColor: '#7b61ff'
        },
    },

}));

const UPLOAD_ICON = () => <img src={UPLOAD} alt="upload"/>
const nameKey = "name"
const descriptionKey = "description"
const keyFileKey = "keyFile"
const dataFileKey = "dataFile"

export const CreateExperimentDialog = (props: any) => {
    const classes = useStyles();
    const api = workspaceService.getApi()
    const {open, handleClose, user, onExperimentCreation} = props;
    const [dataFile, setDataFile] = useState<any>(null);
    const [keyFile, setKeyFile] = useState<any>(null);
    const [name, setName] = useState<string>(null);
    const [description, setDescription] = useState<string>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsOptions, setTagsOptions] = useState<ExperimentTagsInner[]>([]);
    const [errors, setErrors] = useState(new Set([]));
    const [isLoading, setIsLoading] = useState(false);
    const validationSchema = Yup.object().shape({
        [nameKey]: Yup.string().required(),
        [descriptionKey]: Yup.string().required(),
    })


    const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
        setState(newValue)
        errors.delete(errorKey)
        setErrors(errors)
    }

    const handleFileUpload = (files: any, key: string, setFileState: (value: any) => void) => {
        if (files.length > 0) {
            setFileState(files[0])
            errors.delete(getFileErrorKey(key))
            setErrors(errors)
        }
    }

    const handleTagsChange = (_: any, value: any) => {
        setTags(value)
    }

    const getCurrentFormDataObject = () => {
        return {
            name,
            description,
            keyFile,
            dataFile,
            tags
        }
    }

    const getFileErrorKey = (fileKey: string) => `${fileKey}`


    const getValidationErrors = async () => {
        const errorsSet = new Set()
        try {
            await validationSchema.validate(getCurrentFormDataObject(), {strict: true, abortEarly: false})
        } catch (exception) {
            for (const e of exception.inner) {
                if (e.path === keyFileKey || e.path === dataFileKey) {
                    errorsSet.add(getFileErrorKey(e.path))
                } else {
                    errorsSet.add(e.path)
                }
            }
        }

        if (keyFile && !dataFile) {
            errorsSet.add(getFileErrorKey(dataFileKey))
        }
        if (!keyFile && dataFile) {
            errorsSet.add(getFileErrorKey(keyFileKey))
        }

        return errorsSet
    }


    const handleAction = async () => {
        setIsLoading(true)
        const errorsSet = await getValidationErrors()
        if (errorsSet.size > 0) {
            setErrors(errorsSet)
            setIsLoading(false)
            return
        }
        const res = await api.createExperiment(name, description, null, true,
            null, null, user, null, null, null, null)
        const experiment = res.data
        if (tags.length > 0) {
            await api.addTagsExperiment(experiment.id.toString(), tags)
        }
        if (keyFile && dataFile) {
            await api.uploadFilesExperiment(experiment.id.toString(), keyFile, dataFile)
        }

        onExperimentCreation(experiment.id)
        handleClose()
    }

    useEffect(() => {
        const fetchTagOptions = async () => {
            const res = await api.listTags()
            setTagsOptions(res.data)
        }

        fetchTagOptions().catch(console.error)
    }, []);

    // @ts-ignore
    return !isLoading ? (
        <Modal
            dialogActions={true}
            actionText="Create"
            disableGutter={true}
            open={open}
            handleClose={handleClose}
            handleAction={handleAction}
            title="Create a new experiment"
        >
            <Box display={'flex'} alignItems="center" justifyContent={'center'} className={classes.fileDrop}>
                <Grid container={true} item={true} spacing={3}>
                    <Fragment>
                        {!keyFile ? (
                            <Grid item={true} xs={12} sm={6}>
                                <Typography className={classes.fileLabel}>Key file</Typography>
                                <DropzoneArea
                                    dropzoneClass={`${errors.has(getFileErrorKey(keyFileKey)) ? classes.errorBorder : ""}`}
                                    onChange={(files: any) => handleFileUpload(files, keyFileKey,
                                        (value) => setKeyFile(value))}
                                    dropzoneText="Select your key file or drop it here"
                                    Icon={UPLOAD_ICON}
                                    showPreviews={false}
                                    showPreviewsInDropzone={false}
                                    filesLimit={1}
                                    showAlerts={['error']}
                                    classes={{icon: "MuiButton-outlined primary"}}
                                    required={true}
                                />
                            </Grid>
                        ) : (
                            <Grid item={true} xs={12} sm={6}>
                                <Typography className={classes.fileLabel}>Key file</Typography>
                                <Box className={classes.progress}>
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
                                <Typography className={classes.fileLabel}>Data file</Typography>
                                <DropzoneArea
                                    dropzoneClass={`${errors.has(getFileErrorKey(dataFile)) ? classes.errorBorder : ""}`}
                                    onChange={(files: any) => handleFileUpload(files, dataFileKey,
                                        (value) => setDataFile(value))}
                                    dropzoneText="Select your data file or drop it here"
                                    Icon={UPLOAD_ICON}
                                    showPreviews={false}
                                    showPreviewsInDropzone={false}
                                    filesLimit={1}
                                    showAlerts={['error']}
                                    classes={{icon: "MuiButton-outlined primary"}}
                                    maxFileSize={300000000}
                                    required={true}
                                />
                            </Grid>
                        ) : (
                            <Grid item={true} xs={12} sm={6}>
                                <Typography className={classes.fileLabel}>Data file</Typography>
                                <Box className={classes.progress}>
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
            </Box>

            <Box p={2} pb={5}>
                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Name</Typography>
                    <TextField placeholder="Name" variant="outlined"
                               onChange={(e) =>
                                   handleFormChange(e.target.value, setName, nameKey)}
                               required={true}
                               error={errors.has(nameKey)}
                    />
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Description</Typography>
                    {
                        // FIXME: Unclear why we use TextEditor if we only store the text
                    }
                    <TextEditor
                        wrapperClassName={`${errors.has(descriptionKey) ? classes.errorBorder : classes.editorWrapper}`}
                        onChange={(editorState: any) =>
                            handleFormChange(editorState.getCurrentContent().getPlainText(), setDescription, descriptionKey)}
                        required={true}
                    />
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Tags</Typography>
                    <TagsAutocomplete tags={tagsOptions.map(t => t.name)} onChange={handleTagsChange}/>
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Owner</Typography>
                    <OwnerInfo user={user}/>
                </Box>
            </Box>
        </Modal>) : <Loader/>
};
