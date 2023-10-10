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
import {ExperimentOwner, ExperimentTagsInner} from "../../../apiclient/workspaces";
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

interface CreateUpdateExperimentDialogProps {
    open: boolean;
    handleClose: () => void;
    user: {
        username: string;
        avatarUrl: string | null;
    };
    onExperimentAction: (id: string) => void;
    onError: (error: any) => void;
    experimentId?: string;
}

/**
 * CreateUpdateExperimentDialog component for creating or updating an experiment.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open or not.
 * @param {Function} props.handleClose - Function to handle dialog close action.
 * @param {Object} props.user - The user object.
 * @param {Function} props.onExperimentAction - Function to handle experiment creation.
 * @param {string} props.experimentId - The experiment ID.
 */

export const CreateUpdateExperimentDialog = ({
                                                 open,
                                                 handleClose,
                                                 user,
                                                 onExperimentAction,
                                                 onError,
                                                 experimentId,
                                             }: CreateUpdateExperimentDialogProps) => {
    const classes = useStyles();
    const commonClasses = common();
    const api = workspaceService.getApi()
    const [name, setName] = useState<string>(null);
    const [description, setDescription] = useState<string>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsOptions, setTagsOptions] = useState<ExperimentTagsInner[]>([]);
    const [validationErrors, setValidationErrors] = useState(new Set([]));
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<number>(KEY_DATA_TAB);
    const [files, setFiles] = useState<any>({
        [KEY_FILE_KEY]: null,
        [DATA_FILE_KEY]: null,
        [SINGLE_FILE_KEY]: null,
    });
    const validationSchema = !experimentId
        ? Yup.object().shape({
            [NAME_KEY]: Yup.string().required(),
            [DESCRIPTION_KEY]: Yup.string().required(),
        })
        : Yup.object().shape({});


    /**
     * Handles form field value changes and updates the corresponding state and error set.
     *
     * @param {any} newValue - The new value of the form field.
     * @param {Function} setState - The state setter function.
     * @param {string} errorKey - The error key for the form field.
     */
    const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
        setState(newValue)
        validationErrors.delete(errorKey)
        setValidationErrors(validationErrors)
    }


    /**
     * Handles tags change event.
     *
     * @param {Event} _ - The event object (not used).
     * @param {any} value - The new value of the tags.
     */
    const handleTagsChange = (_: any, value: any) => {
        setTags(value)
    }

    /**
     * Returns an object containing the current form data.
     *
     * @returns {Object} An object with keys 'name', 'description', and 'tags'.
     */
    const getCurrentFormDataObject = () => {
        return {
            name,
            description,
            tags,
        }
    }

    /**
     * Validates the current form data and returns a set of error keys.
     *
     * @returns {Promise<Set<string>>} A promise that resolves to a set of error keys.
     */
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

    /**
     * Handles file addition event.
     *
     * @param {string} type - The type of file (KEY_FILE_KEY, DATA_FILE_KEY, or SINGLE_FILE_KEY).
     * @param {any} value - The file data.
     */
    const handleAddFile = (type: string, value: any) => {
        setFiles({...files, [type]: value})
        validationErrors.delete(type)
        setValidationErrors(validationErrors)
    }


    /**
     * Handles the main action (create or update) for the experiment.
     */
    const handleAction = async () => {
        setIsLoading(true)
        const errorsSet = await getValidationErrors()
        if (errorsSet.size > 0) {
            setValidationErrors(errorsSet)
            setIsLoading(false)
            return
        }
        let id = experimentId
        if (!experimentId) {
            id = (await handleCreateAction()).toString();
        }
        try {
            if (activeTab === KEY_DATA_TAB) {
                await api.uploadPairFilesExperiment(id, files[KEY_FILE_KEY], files[DATA_FILE_KEY]);
            } else if (activeTab === SINGLE_FILE_TAB) {
                await api.uploadSingleFileExperiment(id, files[SINGLE_FILE_KEY]);
            }
        } catch (error) {
            onError(error)
        }
        onExperimentAction(id)
        handleClose()
        setIsLoading(false)
    };

    /**
     * Handles the creation action for the experiment.
     */
    const handleCreateAction = async () => {
        const experimentOwner: ExperimentOwner = {
            username: user.username,
            avatar: user.avatarUrl,
        };

        const res = await api.createExperiment(name, description, null, true,
            null, null, experimentOwner, null, null, null, null)
        const experiment = res.data
        if (tags.length > 0) {
            await api.addTagsExperiment(experiment.id.toString(), tags)
        }
        return experiment.id
    }

    /**
     * Handles the tab change event.
     *
     * @param {Event} event - The event object.
     * @param {any} newValue - The new value of the active tab.
     */
    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue)
        setValidationErrors(new Set())
    }

    useEffect(() => {
        const fetchTagOptions = async () => {
            const res = await api.listTags()
            setTagsOptions(res.data)
        }

        fetchTagOptions().catch(console.error)
    }, []);

    const modalTitle = experimentId ? "Add populations to experiment" : "Create a new experiment"
    const actionText = experimentId ? "Update" : "Create"
    // @ts-ignore
    return !isLoading ? (
        <Modal
            dialogActions={true}
            actionText={actionText}
            disableGutter={true}
            open={open}
            handleClose={handleClose}
            handleAction={handleAction}
            title={modalTitle}
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
                                     setKeyFile={(value: any) => handleAddFile(KEY_FILE_KEY, value)}
                                     setDataFile={(value: any) => handleAddFile(DATA_FILE_KEY, value)}
                                     hasKeyErrors={validationErrors.has(KEY_FILE_KEY)}
                                     hasDataErrors={validationErrors.has(DATA_FILE_KEY)}

                    />}
                {activeTab === SINGLE_FILE_TAB && <SingleFileDrop file={files[SINGLE_FILE_KEY]}
                                                                  setFile={(value: any) => handleAddFile(SINGLE_FILE_KEY, value)}
                                                                  hasErrors={validationErrors.has(SINGLE_FILE_KEY)}
                />}
            </Box>

            {!experimentId && (<Box p={2} pb={5}>
                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Name</Typography>
                    <TextField placeholder="Name" variant="outlined"
                               onChange={(e) =>
                                   handleFormChange(e.target.value, setName, NAME_KEY)}
                               required={true}
                               error={validationErrors.has(NAME_KEY)}
                    />
                </Box>

                <Box display="flex" alignItems={"center"} className={classes.formGroup}>
                    <Typography component="label">Description</Typography>
                    <TextEditor
                        wrapperClassName={`${validationErrors.has(DESCRIPTION_KEY) ? commonClasses.errorBorder : classes.editorWrapper}`}
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
            </Box>)}
        </Modal>) : <Loader/>
};
