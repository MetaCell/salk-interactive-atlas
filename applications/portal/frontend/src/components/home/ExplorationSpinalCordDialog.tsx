import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import * as Yup from 'yup';
import { headerButtonBorderColor } from "../../theme";
import Modal from "../common/BaseDialog";
import { TagsAutocomplete } from "../common/ExperimentDialogs/TagsAutocomplete";
import { TextEditor } from "../common/ExperimentDialogs/TextEditor";
import { common } from "../header/ExperimentDialog/Common";
// @ts-ignore
import WorkspaceService from "../../service/WorkspaceService";
// @ts-ignore
import Loader from "@metacell/geppetto-meta-ui/loader/Loader";

const useStyles = makeStyles(() => ({
  formGroup: {
    '&:not(:first-child)': { marginTop: '0.75rem', },

    '& label': {
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      display: 'block',
      letterSpacing: '0.005em',
      color: headerButtonBorderColor,
      marginBottom: '0.75rem'
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

const NAME_KEY = "name";
const DESCRIPTION_KEY = "description";

export const ExplorationSpinalCordDialog = (props: any) => {

  const api = WorkspaceService.getApi();
  const classes = useStyles();
  const commonClasses = common();
  const { open, handleClose, experiment, tagsOptions, onExperimentChange, setExperimentMenuEl } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState<string>(experiment.name);
  const [description, setDescription] = React.useState<string>(experiment.description);
  const [initialTags, setInitialTags] = React.useState(experiment.tags.map((t: any) => t.name));
  const [tags, setTags] = React.useState(experiment.tags.map((t: any) => t.name));
  const [validationErrors, setValidationErrors] = React.useState(new Set([]));

  const validationSchema = experiment.id
    ? Yup.object().shape({
      [NAME_KEY]: Yup.string().required(),
      [DESCRIPTION_KEY]: Yup.string().required(),
    })
    : Yup.object().shape({});

  const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
    validationErrors.delete(errorKey);
    setValidationErrors(validationErrors);
    setState(newValue);
  };

  const onTagsChange = (e: any, value: string[]) => {
    setTags(value);
  };

  const getCurrentFormDataObject = () => {
    return {
      name,
      description,
      tags,
    }
  }

  const deleteTag = async (tag: string) => {
    try {
      await api.deleteTagExperiment(experiment.id.toString(), tag);
    } catch (error) {
      console.error(error);
    }
  };

  const addTags = async (tags: string[]) => {
    try {
      await api.addTagsExperiment(experiment.id.toString(), tags);
    } catch (error) {
      console.error(error);
    }
  }

  const getValidationErrors = async () => {
    const errorsSet = new Set()
    try {
      await validationSchema.validate(getCurrentFormDataObject(), { strict: true, abortEarly: false })
    } catch (exception) {
      for (const e of exception.inner) {
        errorsSet.add(e.path)
      }
    }

    return errorsSet
  }

  const handleAction = async () => {
    setIsLoading(true)
    const errorsSet = await getValidationErrors()
    console.log("errorset: ", errorsSet)
    if (errorsSet.size > 0) {
      setValidationErrors(errorsSet)
      setIsLoading(false)
      return
    }
    let id = experiment.id
    if (experiment.id) {
      id = (await handleEditAction()).toString();
    }
    onExperimentChange(id);
    setInitialTags(tags);
    handleClose();
    setExperimentMenuEl(null);
    setIsLoading(false);
  };

  const handleEditAction = async () => {

    const deletedTags = initialTags.filter((tag: any) => !tags.includes(tag));
    const addedTags = tags.filter((tag: any) => !initialTags.includes(tag));

    // API calls accordingly
    if (deletedTags.length > 0) {
      deletedTags.forEach((tag: any) => deleteTag(tag));
    }
    if (addedTags.length > 0) {
      addTags(addedTags);
    }
    // update the experiment
    const res = await api.updateExperiment(experiment.id.toString(), name, description);
    return res.data.id
  }

  return !isLoading ? (
    <Modal
      dialogActions={true}
      actionText="Edit"
      disableGutter={true}
      open={open}
      handleClose={handleClose}
      handleAction={handleAction}
      title={experiment.name}
    >
      <Box p={2} pb={5} component="form">
        <Box className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField
            value={name}
            fullWidth={true}
            onChange={(e) => handleFormChange(e.target.value, setName, NAME_KEY)}
            required={true}
            error={validationErrors.has(NAME_KEY)}
            variant="outlined"
          />
        </Box>

        <Box className={classes.formGroup}>
          <Typography component="label">Description</Typography>
          <TextEditor
            value={description}
            wrapperClassName={`${validationErrors.has(DESCRIPTION_KEY) ? commonClasses.errorBorder : classes.editorWrapper}`}
            onChange={(editorState: any) =>
              handleFormChange(editorState.getCurrentContent().getPlainText(), setDescription, DESCRIPTION_KEY)}
            required={true}
          />
        </Box>

        <Box className={classes.formGroup}>
          <Typography component="label">Tags</Typography>
          <TagsAutocomplete tagsOptions={tagsOptions.map((t: any) => t.name)} tags={tags} onChange={onTagsChange} />
        </Box>
      </Box>
    </Modal>
  ) : <Loader/>
};