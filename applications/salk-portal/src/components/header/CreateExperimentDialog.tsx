import * as React from "react";
import {Box, Button, Grid, makeStyles, TextField, Typography, } from "@material-ui/core";
import {filesBg, headerBorderColor, headerButtonBorderColor, switchActiveColor} from "../../theme";
import Modal from "../common/BaseDialog";
import {DropzoneArea} from 'material-ui-dropzone';
import {TagsAutocomplete} from "../common/ExperimentDialogs/TagsAutocomplete";
import {TextEditor} from "../common/ExperimentDialogs/TextEditor";
import {OwnerInfo} from "../common/ExperimentDialogs/OwnerInfo";
import {ExperimentTags} from "../../apiclient/workspaces";
// @ts-ignore
import UPLOAD from "../../assets/images/icons/upload.svg";
// @ts-ignore
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import workspaceService from "../../service/WorkspaceService";

const tagOptions: ExperimentTags[] = [
    {name: 'Project A', id: 1},
    {name: 'Label B', id: 2},
    {name: 'Label XYZ', id: 3},
    {name: 'Project C', id: 4},
    {name: 'Project d', id: 5},
    {name: 'Label e', id: 6},
    {name: 'Label XeYZ', id: 7},
    {name: 'Project Ce', id: 8},
];

const useStyles = makeStyles(() => ({
    fileDrop: {
        boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
        padding: '1rem',
    },

    formGroup: {
        '&:not(:first-child)': {marginTop: '0.75rem', },

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

}));

const UPLOAD_ICON = () => <img src={UPLOAD} alt="upload"/>

export const CreateExperimentDialog = (props: any) => {
    const classes = useStyles();
    const api = workspaceService.getApi()
    const {open, handleClose, user} = props;
    const [dataFiles, setDataFile] = React.useState<any>([]);
    const [keyFiles, setKeyFile] = React.useState<any>([]);
    const [pairsLength, setPairsLength] = React.useState<any>(1);
    const [name, setName] = React.useState<string>(null);
    const [description, setDescription] = React.useState<string>(null);
    const [tags, setTags] = React.useState<ExperimentTags[]>([]);

    const handleFileUpload = (files: any, index: number, state: any, setState: (value: any) => void) => {
        if (files.length > 0) {
            const nextState = [...state]
            nextState[index] = files[0]
            setState(nextState)
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

    const handleAction = async () => {
        await api.createExperiment(name, description, null, true, null, null, user, null, null, null, tags)
        // const promises = []
        // for (let i = 0; i < pairsLength ; i++){}
    }
    // const [progress, setProgress] = React.useState(0);

    // React.useEffect(() => {
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
                        <>
                            {!keyFiles[i] ? (
                                <Grid item={true} xs={12} sm={6}>
                                    <Typography className={classes.fileLabel}>Key file</Typography>
                                    <DropzoneArea
                                        onChange={(files: any) => handleFileUpload(files, i, keyFiles, (value) => setKeyFile(value))}
                                        dropzoneText="Select your key file or drop it here"
                                        Icon={UPLOAD_ICON}
                                        showPreviews={false}
                                        showPreviewsInDropzone={false}
                                        filesLimit={1}
                                        showAlerts={['error']}
                                        classes={{icon: "MuiButton-outlined primary"}}
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
                                                onClick={() => handleRemoveFile(i, keyFiles, (value) => setKeyFile(value))}>Remove</Button>
                                    </Box>
                                </Grid>)
                            }
                            {!dataFiles[i] ? (
                                <Grid item={true} xs={12} sm={6}>
                                    <Typography className={classes.fileLabel}>Data file</Typography>
                                    <DropzoneArea
                                        onChange={(files: any) => handleFileUpload(files, i, dataFiles, (value) => setDataFile(value))}
                                        dropzoneText="Select your data file or drop it here"
                                        Icon={UPLOAD_ICON}
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
                                    <Typography className={classes.fileLabel}>Data file</Typography>
                                    <Box className={classes.progress}>
                                        <Typography>
                                            <img src={CHECK_FILLED} alt="check"/>
                                            {dataFiles[i].name}
                                        </Typography>
                                        <Button disableRipple={true}
                                                onClick={() => handleRemoveFile(i, keyFiles, (value) => setDataFile(value))}>Remove</Button>
                                    </Box>
                                </Grid>
                            )}
                        </>
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
                    <TextField placeholder="Name" variant="outlined" onChange={(e) => setName(e.target.value)}/>
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Description</Typography>
                    {
                        // FIXME: Unclear why we use TextEditor if we only store the text
                    }
                    <TextEditor onChange={(editorState: any) => setDescription(editorState.getCurrentContent().getPlainText())}/>
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Tags</Typography>
                    <TagsAutocomplete tags={tagOptions} onChange={handleTagsChange}/>
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Owner</Typography>
                    <OwnerInfo user={user}/>
                </Box>
            </Box>
        </Modal>
    );
};