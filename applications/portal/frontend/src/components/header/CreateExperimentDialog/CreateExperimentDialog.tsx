import React, {useEffect, useState, Fragment} from 'react';
import {Box, makeStyles, TextField, Typography, Tabs, Tab} from "@material-ui/core";
import {headerBorderColor, headerButtonBorderColor, switchActiveColor} from "../../../theme";
import Modal from "../../common/BaseDialog";
import {TagsAutocomplete} from "../../common/ExperimentDialogs/TagsAutocomplete";
import {TextEditor} from "../../common/ExperimentDialogs/TextEditor";
import {OwnerInfo} from "../../common/ExperimentDialogs/OwnerInfo";
// @ts-ignore
import UPLOAD from "../../../assets/images/icons/upload.svg";
// @ts-ignore
import CHECK_FILLED from "../../../assets/images/icons/check_filled.svg";
// @ts-ignore
import workspaceService from "../../../service/WorkspaceService";
import * as Yup from 'yup'
// @ts-ignore
import {ExperimentTagsInner} from "../../../apiclient/workspaces";
// @ts-ignore
import Loader from "@metacell/geppetto-meta-ui/loader/Loader";
import {common} from "./Common";
import {KeyDataFileDrop} from "./KeyDataFileDrop";
import {SingleFileDrop} from "./SingleFileDrop";


const useStyles = makeStyles(() => ({
    tabs: {
        height: '100%',
        width: '100%',
        paddingLeft: '1rem',
        boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    },
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
    editorWrapper: {
        '&:hover': {
            borderColor: '#fff'
        },
        '&:focus-within': {
            borderColor: '#7b61ff'
        },
    },

}));

const NAME_KEY = "name"
const DESCRIPTION_KEY = "description"
const KEY_FILE_KEY = "keyFile"
const DATA_FILE_KEY = "dataFile"
const SINGLE_FILE_KEY = "singleFile"
const KEY_DATA_TAB = 0
const SINGLE_FILE_TAB = 1


export const CreateExperimentDialog = (props: any) => {
    const classes = useStyles();
    const commonClasses = common();
    const api = workspaceService.getApi()
    const {open, handleClose, user, onExperimentCreation} = props;
    const [name, setName] = useState<string>(null);
    const [description, setDescription] = useState<string>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsOptions, setTagsOptions] = useState<ExperimentTagsInner[]>([]);
    const [errors, setErrors] = useState(new Set([]));
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<number>(KEY_DATA_TAB);
    const [files, setFiles] = useState<any>({
        [KEY_FILE_KEY]: null,
        [DATA_FILE_KEY]: null,
        [SINGLE_FILE_KEY]: null,
    });
    const validationSchema = Yup.object().shape({
        [NAME_KEY]: Yup.string().required(),
        [DESCRIPTION_KEY]: Yup.string().required(),
    })


    const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
        setState(newValue)
        errors.delete(errorKey)
        setErrors(errors)
    }


    const handleTagsChange = (_: any, value: any) => {
        setTags(value)
    }

    const getCurrentFormDataObject = () => {
        return {
            name,
            description,
            tags,
        }
    }

    const getValidationErrors = async () => {
        const errorsSet = new Set()
        try {
            await validationSchema.validate(getCurrentFormDataObject(), {strict: true, abortEarly: false})
        } catch (exception) {
            for (const e of exception.inner) {
                errorsSet.add(e.path)
            }
        }
        if (activeTab === KEY_DATA_TAB) {
            if (!files[DATA_FILE_KEY]) {
                errorsSet.add(DATA_FILE_KEY)
            }
            if (!files[KEY_FILE_KEY]) {
                errorsSet.add(KEY_FILE_KEY)
            }
        } else {
            if (!files[SINGLE_FILE_KEY]) {
                errorsSet.add(SINGLE_FILE_KEY)
            }
        }

        return errorsSet
    }

    const handleAddFile = (type: string, value: any) => {
        setFiles({...files, [type]: value})
        errors.delete(type)
        setErrors(errors)
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
        if (activeTab === KEY_DATA_TAB) {
            await api.uploadPairFilesExperiment(experiment.id.toString(), files[KEY_FILE_KEY], files[DATA_FILE_KEY])
        } else if (activeTab === SINGLE_FILE_TAB) {
            await api.uploadSingleFileExperiment(experiment.id.toString(), files[SINGLE_FILE_KEY])
        }

        onExperimentCreation(experiment.id)
        handleClose()
    }

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue)
        setErrors(new Set())
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
            <Box display={'flex'}>
                <Tabs value={activeTab} onChange={handleTabChange} className={classes.tabs}>
                    <Tab label="Key + Data"/>
                    <Tab label="Single File"/>
                </Tabs>
            </Box>

            <Box display={'flex'} alignItems="center" justifyContent={'center'} className={classes.fileDrop}>
                {activeTab === KEY_DATA_TAB &&
                    <KeyDataFileDrop keyFile={files[KEY_FILE_KEY]} dataFile={files[DATA_FILE_KEY]}
                                     setKeyFile={(value: any) => handleAddFile(KEY_FILE_KEY, value) }
                                     setDataFile={(value: any) => handleAddFile(DATA_FILE_KEY, value)}
                                     hasKeyErrors={errors.has(KEY_FILE_KEY)}
                                     hasDataErrors={errors.has(DATA_FILE_KEY)}

                    />}
                {activeTab === SINGLE_FILE_TAB && <SingleFileDrop file={files[SINGLE_FILE_KEY]}
                                                                  setFile={(value: any) => handleAddFile(SINGLE_FILE_KEY, value)}
                                                                  hasErrors={errors.has(SINGLE_FILE_KEY)}
                />}
            </Box>

            <Box p={2} pb={5}>
                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Name</Typography>
                    <TextField placeholder="Name" variant="outlined"
                               onChange={(e) =>
                                   handleFormChange(e.target.value, setName, NAME_KEY)}
                               required={true}
                               error={errors.has(NAME_KEY)}
                    />
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Description</Typography>
                    <TextEditor
                        wrapperClassName={`${errors.has(DESCRIPTION_KEY) ? commonClasses.errorBorder : classes.editorWrapper}`}
                        onChange={(editorState: any) =>
                            handleFormChange(editorState.getCurrentContent().getPlainText(), setDescription, DESCRIPTION_KEY)}
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
