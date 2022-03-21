import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  Avatar,
  TextField,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, sidebarTextColor } from "../../theme";
import USER from "../../assets/images/icons/user.svg";
import UPLOAD from "../../assets/images/icons/upload.svg";
import Modal from "../common/BaseDialog";
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles(() => ({
  fileDrop: {
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '1rem',
  },

  formGroup: {
    '&:not(:first-child)': {marginTop: '0.75rem',},

    '& label': {
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.005em',
      color: headerButtonBorderColor,
      width: '8rem',
    },
  },

  ownerInfo: {
    '& .MuiTypography-root': {
      fontWeight: '400',
      fontSize: '0.75rem',
      lineHeight: '0.9375rem',
      color: headerButtonBorderColor,
    },

    '& .MuiAvatar-root': {
      width: '1.5rem',
      height: '1.5rem',
      marginRight: '0.8rem',
    },

    '& span.MuiTypography-root': {color: sidebarTextColor,},
  },

}));

export const CreateExperimentDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose, user } = props;
  const [files, setFiles] = React.useState<any>([]);
  const fileUpload = (file: any) => {
    setFiles(file);
  };
  return (
    <Modal
      dialogActions
      actionText="Create"
      disableGutter
      open={open}
      handleClose={handleClose}
      title="Create a new experiment"
    >
      <Box className={classes.fileDrop}>
        <DropzoneArea
          onChange={(e: any, file: any) => fileUpload(file)}
          dropzoneText="Drop files here to upload…"
          Icon={() => <img src={UPLOAD} alt="upload" />}
          showPreviews={false}
          showPreviewsInDropzone={false}
          classes={{ icon: "MuiButton-outlined primary" }}
        />
      </Box>

      <Box p={2}>
        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField placeholder="Name" variant="outlined" />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Description</Typography>
          <TextField placeholder="Description" variant="outlined" />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Tags</Typography>
          <TextField placeholder="Tags" variant="outlined" />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Owner</Typography>
          <Box display="flex" alignItems={"center"} className={classes.ownerInfo}>
            <Avatar alt={"Owner"} title={"Owner"} src={USER} />
            <Typography>
              Quinn Silverman <Typography component="span">(You)</Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};