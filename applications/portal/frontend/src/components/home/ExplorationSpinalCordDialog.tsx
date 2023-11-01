import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import * as Yup from 'yup';
import { headerButtonBorderColor } from "../../theme";
// @ts-ignore
import WorkspaceService from "../../service/WorkspaceService";
import { common } from "../header/ExperimentDialog/Common";
import Modal from "../common/BaseDialog";
import { TagsAutocomplete } from "../common/ExperimentDialogs/TagsAutocomplete";
import { TextEditor } from "../common/ExperimentDialogs/TextEditor";

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
  const classes = useStyles();
  const commonClasses = common();
  const api = WorkspaceService.getApi();
  const { experimentId, experiment, tagsOptions, open, handleClose, refreshExperimentList, setExperimentMenuEl } = props;

  const [name, setName] = React.useState<string>(experiment.name);
  const [description, setDescription] = React.useState<string>(experiment.description);
  const [validationErrors, setValidationErrors] = React.useState(new Set([]));
  const [tags, setTags] = React.useState(experiment.tags.map((t: any) => t.name));

  const onTagsChange = (e: any, value: string[]) => {
    setTags(value);
  };

  const validationSchema = experimentId
    ? Yup.object().shape({
      [NAME_KEY]: Yup.string().required(),
      [DESCRIPTION_KEY]: Yup.string().required(),
    })
    : Yup.object().shape({});

  const deleteTag = async (tag: any) => {
    try {
      await api.deleteTagExperiment(experiment.id.toString(), tag.name);
    } catch (error) {
      console.error(error);
    }
  };

  const addTags = async (newTags: string[]) => {
    try {
      await api.addTagsExperiment(experiment.id.toString(), newTags);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
    validationErrors.delete(errorKey);
    setValidationErrors(validationErrors);
    setState(newValue);
  };

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
      await validationSchema.validate(getCurrentFormDataObject(), { strict: true, abortEarly: false })
    } catch (exception) {
      for (const e of exception.inner) {
        errorsSet.add(e.path)
      }
    }

    return errorsSet
  }

  const handleAction = async () => {

    const deletedTags = experiment.tags.filter((tag: any) => !tags.includes(tag.name));
    const addedTags = tags.filter((tag: any) => !experiment.tags.some((expTag: any) => expTag.name === tag));

    // API calls tags
    if (deletedTags.length > 0) {
      deletedTags.forEach((tag: any) => deleteTag(tag));
    }
    if (addedTags.length > 0) {
      addTags(addedTags);
    }

    const errorsSet = await getValidationErrors()
    if (errorsSet.size > 0) {
      setValidationErrors(errorsSet)
      return
    }

    if (experimentId) {
      try {
        const res = await api.updateExperiment(experimentId.toString(), name, description);
        if (res.status === 200) {
          refreshExperimentList()
        }
      } catch (err) {
        console.error(err)
      }
    }
    handleClose();
    setExperimentMenuEl(null)
  };

  return (
    <Modal
      dialogActions={true}
      actionText="Edit"
      disableGutter={true}
      open={open}
      handleClose={handleClose}
      handleAction={handleAction}
      title={experiment.name}
    >
      <Box p={2} pb={5}>
        <Box className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField
            fullWidth={true}
            placeholder="Name"
            variant="outlined"
            value={name}
            onChange={(e) => handleFormChange(e.target.value, setName, NAME_KEY)}
            error={validationErrors.has(NAME_KEY)}
            required={true}
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
          <TagsAutocomplete tags={tags} tagsOptions={tagsOptions.map((t: any) => t.name)} onChange={onTagsChange} />
        </Box>
      </Box>
    </Modal>
  );
};