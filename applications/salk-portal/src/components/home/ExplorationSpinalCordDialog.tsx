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
import { ExperimentTags } from "../../apiclient/workspaces";

const tags: ExperimentTags[] = [
  { name: 'Project A', id: 1 },
  { name: 'Label B', id: 2},
  { name: 'Label XYZ', id: 3},
  { name: 'Project C', id: 4 },
  { name: 'Project d', id: 5 },
  { name: 'Label e', id: 6},
  { name: 'Label XeYZ', id: 7},
  { name: 'Project Ce', id: 8},
];

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
}));

export const ExplorationSpinalCordDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose } = props;

  return (
    <Modal
      dialogActions={true}
      actionText="Create"
      disableGutter={true}
      open={open}
      handleClose={handleClose}
      title="Exploration of the spinal cord"
    >
      <Box p={2} pb={5}>
        <Box className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField fullWidth={true} placeholder="Name" variant="outlined" />
        </Box>

        <Box className={classes.formGroup}>
          <Typography component="label">Description</Typography>
          <TextEditor />
        </Box>

        <Box className={classes.formGroup}>
          <Typography component="label">Tags</Typography>
          <TagsAutocomplete tags={tags} />
        </Box>
      </Box>
    </Modal>
  );
};