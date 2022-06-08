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
const keyFilesKey = "keyFiles"
const dataFilesKey = "dataFiles"

export const CreateExperimentDialog = (props: any) => {
    const classes = useStyles();
    const api = workspaceService.getApi()
    const {open, handleClose, user, onExperimentCreation} = props;
    const [dataFiles, setDataFile] = useState<any>([]);
    const [keyFiles, setKeyFile] = useState<any>([]);
    const [pairsLength, setPairsLength] = useState<any>(1);
    const [name, setName] = useState<string>(null);
    const [description, setDescription] = useState<string>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsOptions, setTagsOptions] = useState<ExperimentTagsInner[]>([]);
    const [errors, setErrors] = useState(new Set([]));
    const validationSchema = Yup.object().shape({
        [nameKey]: Yup.string().required(),
        [descriptionKey]: Yup.string().required(),
        [keyFilesKey]: Yup.array().min(1).required(),
        [dataFilesKey]: Yup.array().min(1).required()
    })



    const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
        setState(newValue)
        errors.delete(errorKey)
        setErrors(errors)
    }

    const handleFileUpload = (files: any, key: string, index: number, state: any, setState: (value: any) => void) => {
        if (files.length > 0) {
            const nextState = [...state]
            nextState[index] = files[0]
            setState(nextState)
            errors.delete(getFileErrorKey(key, index))
            setErrors(errors)
        }
    }

    const handleRemoveFile = (index: number, state: any, setState: (value: any) => void) => {
        if (index >= 0 && state.length > index) {
            const nextState = [...state]
            nextState[index] = null
            setState(nextState)
        }
    }

    const handleTagsChange = (_: any, value: any) => {
        setTags(value)
    }

    const getCurrentFormDataObject = () => {
        return {
            name,
            description,
            keyFiles,
            dataFiles,
            tags
        }
    }

    const getFileErrorKey = (fileKey: string, index: number) => `${fileKey}.${index}`


    const getValidationErrors = async () => {
        const errorsSet = new Set()
        try {
            await validationSchema.validate(getCurrentFormDataObject(), {strict: true, abortEarly: false})
        } catch (exception) {
            for (const e of exception.inner) {
                if (e.path === keyFilesKey || e.path === dataFilesKey) {
                    errorsSet.add(getFileErrorKey(e.path, 0))
                } else {
                    errorsSet.add(e.path)
                }
            }
        }

        for (let i = 0; i < pairsLength; i++) {
            if (keyFiles[i] && !dataFiles[i]) {
                errorsSet.add(getFileErrorKey(dataFilesKey, i))
            }
            if (!keyFiles[i] && dataFiles[i]) {
                errorsSet.add(getFileErrorKey(keyFilesKey, i))
            }
        }

        return errorsSet
    }


    const handleAction = async () => {
        const errorsSet = await getValidationErrors()
        if (errorsSet.size > 0) {
            setErrors(errorsSet)
            return
        }
        const res = await api.createExperiment(name, description, null, true,
            null, null, user, null, null, null, null)
        const experiment = res.data
        await api.addTagsExperiment(experiment.id.toString(), tags)
        const promises = []
        for (let i = 0; i < pairsLength; i++) {
            if (keyFiles[i] && dataFiles[i]) {
                promises.push(api.uploadFilesExperiment(experiment.id.toString(), keyFiles[i], dataFiles[i]))
            }
        }
        await Promise.all(promises)
        handleClose()
        onExperimentCreation(experiment.id)
    }

    useEffect(() => {
        const fetchTagOptions = async () => {
            const res = await api.listTags()
            setTagsOptions(res.data)
        }

        fetchTagOptions().catch(console.error)
    }, []);
    // const [progress, setProgress] = useState(0);

    // useEffect(() => {
    //   const timer = setInterval(() => {
    //     setProgress((oldProgress) => {
    //       if (oldProgress === 100) {
    //         return 0;
    //       }
    //       const diff = Math.random() * 10;
    //       return Math.min(oldProgress + diff, 100);
    //     });
    //   }, 500);

    //   return () => {
    //     clearInterval(timer);
    //   };
    // }, []);

    // @ts-ignore

    return (
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
                    {[...Array(pairsLength)].map((n, i) =>
                        <Fragment key={i}>
                            {!keyFiles[i] ? (
                                <Grid item={true} xs={12} sm={6}>
                                    <Typography className={classes.fileLabel}>Key file</Typography>
                                    <DropzoneArea
                                        dropzoneClass={`${errors.has(getFileErrorKey(keyFilesKey, i)) ? classes.errorBorder : ""}`}
                                        onChange={(files: any) => handleFileUpload(files, keyFilesKey, i, keyFiles,
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
                                            {keyFiles[i].name}
                                        </Typography>
                                        <Button disableRipple={true}
                                                onClick={() => handleRemoveFile(i, keyFiles,
                                                    (value) => setKeyFile(value))}>Remove</Button>
                                    </Box>
                                </Grid>)
                            }
                            {!dataFiles[i] ? (
                                <Grid item={true} xs={12} sm={6}>
                                    <Typography className={classes.fileLabel}>Data file</Typography>
                                    <DropzoneArea
                                        dropzoneClass={`${errors.has(getFileErrorKey(dataFilesKey, i)) ? classes.errorBorder : ""}`}
                                        onChange={(files: any) => handleFileUpload(files, dataFilesKey, i, dataFiles,
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
                                            {dataFiles[i].name}
                                        </Typography>
                                        <Button disableRipple={true}
                                                onClick={() => handleRemoveFile(i, keyFiles, (value) =>
                                                    setDataFile(value))}>Remove</Button>
                                    </Box>
                                </Grid>
                            )}
                        </Fragment>
                    )}
                </Grid>
            </Box>

            <Box className={classes.addSet}>
                <Button disableRipple={true} onClick={() => setPairsLength(pairsLength + 1)}>+ Add another set of
                    files</Button>
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
        </Modal>
    );
};
