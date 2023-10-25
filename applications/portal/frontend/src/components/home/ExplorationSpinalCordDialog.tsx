import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import { headerButtonBorderColor } from "../../theme";
import Modal from "../common/BaseDialog";
import { TagsAutocomplete } from "../common/ExperimentDialogs/TagsAutocomplete";
import { TextEditor } from "../common/ExperimentDialogs/TextEditor";
import { common } from "../header/ExperimentDialog/Common";
// @ts-ignore
import WorkspaceService from "../../service/WorkspaceService";

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

const DESCRIPTION_KEY = "description";

export const ExplorationSpinalCordDialog = (props: any) => {

  const api = WorkspaceService.getApi();
  const classes = useStyles();
  const commonClasses = common();
  const { open, handleClose, experiment, tagsOptions, onExperimentChange } = props;

  const [name, setName] = React.useState<string>(experiment.name);
  const [description, setDescription] = React.useState<string>(experiment.description);
  const [initialTags, setInitialTags] = React.useState(experiment.tags.map((t: any) => t.name));
  const [tags, setTags] = React.useState(experiment.tags.map((t: any) => t.name));
  const [validationErrors, setValidationErrors] = React.useState(new Set([]));

  const handleFormChange = (newValue: any, setState: any, errorKey: string) => {
    validationErrors.delete(errorKey);
    setValidationErrors(validationErrors);
    setState(newValue);
  };

  const onTagsChange = (e: any, value: string[]) => {
    setTags(value);
  };

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

  const handleAction = async () => {
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

    onExperimentChange(res.data.id);
    setInitialTags(tags);
    handleClose();
  };

  return (
    <Modal
      dialogActions={true}
      actionText="Edit"
      disableGutter={true}
      open={open}
      handleClose={handleClose}
      handleAction={handleAction}
      title="Exploration of the spinal cord"
    >
      <Box p={2} pb={5} component="form">
        <Box className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth={true} placeholder="Name" variant="outlined" />
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
  );
};