import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  TextField,
  Grid,
  Button,
} from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, switchActiveColor, filesBg } from "../../theme";
import UPLOAD from "../../assets/images/icons/upload.svg";
import CHECK_FILLED from "../../assets/images/icons/check_filled.svg";
import Modal from "../common/BaseDialog";
import { DropzoneArea } from 'material-ui-dropzone';
import LinearProgress from '@material-ui/core/LinearProgress';
import { TagsAutocomplete } from "../common/ExperimentDialogs/TagsAutocomplete";
import { TextEditor } from "../common/ExperimentDialogs/TextEditor";
import { OwnerInfo } from "../common/ExperimentDialogs/OwnerInfo";
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
  fileDrop: {
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '1rem',
  },

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

export const CreateExperimentDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose, user } = props;
  const [file, setFile] = React.useState<any>([]);
  const [uploaded, setUploaded] = React.useState(false);
  const fileUpload = (upload: any) => {
    if (upload.length > 0) {
      setFile(upload);
      setUploaded(true);
    }
  };
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

  return (
    <Modal
      dialogActions={true}
      actionText="Create"
      disableGutter={true}
      open={open}
      handleClose={handleClose}
      title="Create a new experiment"
    >
      <Box display={'flex'} alignItems="center" justifyContent={'center'} className={classes.fileDrop}>
        <Grid container={true} item={true} spacing={3}>
          {!uploaded ? (
            <>
              <Grid item={true} xs={12} sm={6}>
                <Typography className={classes.fileLabel}>Key file</Typography>
                <DropzoneArea
                  onChange={(files: any) => fileUpload(files)}
                  dropzoneText="Select your key file or drop it here"
                  Icon={() => <img src={UPLOAD} alt="upload" />}
                  showPreviews={false}
                  showPreviewsInDropzone={false}
                  dropzoneClass={uploaded && 'hide'}
                  filesLimit={1}
                  showAlerts={['error']}
                  classes={{ icon: "MuiButton-outlined primary" }}
                />
              </Grid>

              <Grid item={true} xs={12} sm={6}>
                <Typography className={classes.fileLabel}>Data file</Typography>
                <DropzoneArea
                  onChange={(files: any) => fileUpload(files)}
                  dropzoneText="Select your data file or drop it here"
                  Icon={() => <img src={UPLOAD} alt="upload" />}
                  showPreviews={false}
                  showPreviewsInDropzone={false}
                  dropzoneClass={uploaded && 'hide'}
                  filesLimit={1}
                  showAlerts={['error']}
                  classes={{ icon: "MuiButton-outlined primary" }}
                />
              </Grid>
            </>) : (
            <>
              <Grid item={true} xs={12} sm={6}>
                <Typography className={classes.fileLabel}>Key file</Typography>
                <Box className={classes.progress}>
                  <Typography>
                    <img src={CHECK_FILLED} alt="check" />
                    data_v2.mca
                  </Typography>
                  <Button disableRipple={true} onClick={() => setUploaded(false)}>Remove</Button>
                </Box>
              </Grid>

              <Grid item={true} xs={12} sm={6}>
                <Typography className={classes.fileLabel}>Data file</Typography>
                <Box className={classes.progress}>
                  <Typography>
                    <img src={CHECK_FILLED} alt="check" />
                    data_v2.mca
                  </Typography>
                  <Button disableRipple={true} onClick={() => setUploaded(false)}>Remove</Button>
                </Box>
              </Grid>
            </>)
          }
        </Grid>
        {/* I am not sure if we are going to use the uploading view, but adding the UI here in case we decide to use it - vidhya */}

        {/* <Grid container item spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.fileLabel}>Key file</Typography>
            <Box className={classes.progress}>
              <Typography>Uploading... {progress.toFixed()}%</Typography>
              <Box className={classes.bar} display={'flex'} alignItems="center">
                <LinearProgress variant="determinate" value={progress} />
                <IconButton disableRipple>
                  <img src={CANCEL} alt="cancel" />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography className={classes.fileLabel}>Data file</Typography>
            <Box className={classes.progress}>
              <Typography>Uploading... {progress.toFixed()}%</Typography>
              <Box className={classes.bar} display={'flex'} alignItems="center">
                <LinearProgress variant="determinate" value={progress} />
                <IconButton disableRipple>
                  <img src={CANCEL} alt="cancel" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid> */}
      </Box>

      <Box className={classes.addSet}>
        <Button disableRipple={true}>+ Add another set of files</Button>
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