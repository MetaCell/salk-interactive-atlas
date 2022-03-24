import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, bodyBgColor, cardTextColor } from "../../theme";
import Modal from "../common/BaseDialog";
import PREVIEW from "../../assets/images/icons/preview.svg";
import { TagsAutocomplete } from "../common/ExperimentDialogs/TagsAutocomplete";
import { TextEditor } from "../common/ExperimentDialogs/TextEditor";
import { OwnerInfo } from "../common/ExperimentDialogs/OwnerInfo";

const tags = [
  { title: 'Project A' },
  { title: 'Label B' },
  { title: 'Label XYZ' },
  { title: 'Project C' },
];

const useStyles = makeStyles(() => ({
  formGroup: {
    '&:not(:first-child)': { marginTop: '0.75rem', },

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

  experimentInfo: {
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '1rem',
    '& img': {
      width: '4.375rem',
      height: '4.375rem',
      borderRadius: '0.25rem',
    },
    '& > .MuiBox-root': {
      background: bodyBgColor,
      border: `0.03125rem solid ${headerBorderColor}`,
      padding: '0.25rem',
      borderRadius: '0.375rem',

      '& h3': {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        marginBottom: '0.5rem',
        color: cardTextColor,
      },

      '& p': {
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        color: headerButtonBorderColor,
      }
    },
  },
}));

export const CloneExperimentDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose, user } = props;

  return (
    <Modal
      dialogActions
      actionText="Create"
      disableGutter
      open={open}
      handleClose={handleClose}
      title="Clone experiment"
    >
      <Box className={classes.experimentInfo}>
        <Box display={"flex"} alignItems={"center"}>
          <img src={PREVIEW} alt="PREVIEW" />
          <Box pl={2}>
            <Typography component={"h3"}>Initial experiment</Typography>
            <Typography>Exploration of the spinal cord</Typography>
          </Box>
        </Box>
      </Box>
      <Box p={2} pb={5}>
        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField placeholder="Name" variant="outlined" />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Description</Typography>
          <TextEditor />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Tags</Typography>
          <TagsAutocomplete tags={tags} />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Owner</Typography>
          <OwnerInfo user={user} />
        </Box>
      </Box>
    </Modal>
  );
};