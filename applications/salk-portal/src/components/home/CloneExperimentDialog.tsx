import * as React from "react";
import {
  Box,
  makeStyles,
  Typography,
  Avatar,
  TextField,
  Chip,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { tagsColorOptions, headerBorderColor, headerButtonBorderColor, secondaryChipBg, sidebarTextColor, switchActiveColor } from "../../theme";
import USER from "../../assets/images/icons/user.svg";
import CHECK from "../../assets/images/icons/check.svg";
import BOLD from "../../assets/images/icons/bold.svg";
import LINK from "../../assets/images/icons/link.svg";
import ITALIC from "../../assets/images/icons/italic.svg";
import UNDERLINE from "../../assets/images/icons/underline.svg";
import UNORDERED from "../../assets/images/icons/unordered_list.svg";
import ORDERED from "../../assets/images/icons/ordered_list.svg";
import Modal from "../common/BaseDialog";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';


const tags = [
  { title: 'Project A' },
  { title: 'Label B' },
  { title: 'Label XYZ' },
  { title: 'Project C' },
];

const useStyles = makeStyles(() => ({
  fileDrop: {
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    padding: '1rem',
    minHeight: '8.25rem',
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

  icon: {
    width: '0.75rem',
    height: '0.75rem',
    marginRight: '0.5rem',
    borderRadius: '0.1875rem',
  },

  mlAuto: {
    marginLeft: 'auto',
  },

  progress: {
    maxWidth: '13rem',
    width: '100%',

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

}));

export const CloneExperimentDialog = (props: any) => {
  const classes = useStyles();
  const { open, handleClose, user } = props;
  const [files, setFiles] = React.useState<any>([]);
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
  const [uploaded, setUploaded] = React.useState(false);
  const fileUpload = (file: any) => {
    if(file.length > 0) {
      setFiles(file);
      setUploaded(true);
    }
  };

  const onEditorStateChange = (updatedEditorState: any) => {
    setEditorState(updatedEditorState)
  }
  return (
    <Modal
      dialogActions
      actionText="Create"
      disableGutter
      open={open}
      handleClose={handleClose}
      title="Clone experiment"
    >
      <Box p={2} pb={5}>
        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Name</Typography>
          <TextField placeholder="Name" variant="outlined" />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Description</Typography>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: ['inline', 'list', 'link'],
              inline: {
                options: ['bold', 'italic', 'underline'],
                bold: { icon: BOLD },
                italic: { icon: ITALIC },
                underline: { icon: UNDERLINE },
              },
              list: {
                inDropdown: false,
                options: ['unordered', 'ordered'],
                unordered: { icon: UNORDERED },
                ordered: { icon: ORDERED },
              },
              link: {
                inDropdown: false,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_blank',
                options: ['link'],
                link: { icon: LINK },
              },
            }}
          />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Tags</Typography>
          <Autocomplete
            multiple
            closeIcon={false}
            popupIcon={false}
            fullWidth
            id="tags-filled"
            options={tags.map((option) => option.title)}
            defaultValue={[tags[2].title]}
            freeSolo
            limitTags={3}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} style={{...tagsColorOptions[index]}} onDelete={() => console.log(option)} label={option} {...getTagProps({ index })} />
              ))
            }
            renderOption={(option, { selected }) => (
              <>
                <Box className={classes.icon} style={{backgroundColor: secondaryChipBg}}/>
                {option}
                {selected && <img src={CHECK} className={classes.mlAuto} alt="check" />}
              </>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Search or Create a new tag" />
            )}
          />
        </Box>

        <Box display="flex" alignItems={"center"} className={classes.formGroup}>
          <Typography component="label">Owner</Typography>
          <Box display="flex" alignItems={"center"} className={classes.ownerInfo}>
            <Avatar title={user?.username} src={USER} />
            <Typography>
              {`${user?.firstName} ${user?.lastName}`} <Typography component="span">(You)</Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};