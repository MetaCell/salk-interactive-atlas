import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import CLOSE from "../assets/images/icons/close.svg";
import { Modal as IModal } from "../types/modal";
// use theme
import { useTheme } from '@mui/material/styles';


const DeleteModal: React.FC<IModal> = ({
  open,
  title,
  maxWidth,
  handleClose,
  children,
  disableGutter,
  dialogActions,
  handleAction,
  actionText
}) => {
  const theme = useTheme();
  const dangerColor = theme.palette.button.danger;
  return (
    <Dialog
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
      style={{ padding: '1rem' }}
    >
      <DialogTitle style={{ boxShadow: 'none' }}>
        <Typography component="h4">{title}</Typography>
        <IconButton onClick={handleClose}>
          <img src={CLOSE} alt="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ boxShadow: 'none', padding: '0.5rem 1rem' }}>{children}</DialogContent>
      {dialogActions ?
        <DialogActions style={{ boxShadow: 'none', paddingBottom: '1rem' }}>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disableElevation={true}
            onClick={handleAction}
            variant="contained" color={dangerColor}>
            {actionText}
          </Button>
        </DialogActions>
        : null}
    </Dialog>
  )
};

DeleteModal.defaultProps = {
  maxWidth: "sm",
}

export default DeleteModal;




import Modal from "./common/BaseDialog";

import { Box, makeStyles, Typography } from "@material-ui/core";
import { headerBorderColor, headerButtonBorderColor, secondaryColor, switchActiveColor } from "../theme";

const useStyles = makeStyles(() => ({
  about: {
    '& .MuiAvatar-root': {
      width: '5rem',
      // height: '5rem',
    },
    '& .details': {
      flexGrow: 1,
      '& .detail-block + .detail-block': {
        marginTop: '1.5rem',
      },

      '& .MuiButton-text': {
        fontWeight: 400,
        padding: 0,
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        minWidth: '0.0625rem',
        color: switchActiveColor,
        textTransform: 'none',

        '&:hover': {
          background: 'transparent'
        },
      },

      '& .MuiTypography-root': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        fontWeight: 600,
        color: secondaryColor,
        marginBottom: '0.5rem',
      },

      '& .MuiFormControlLabel-root': {
        margin: '0.5rem 0 0',
        display: 'flex',
      },

      '& .MuiButton-outlined': {
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.01em',
        color: headerButtonBorderColor,
        borderColor: headerButtonBorderColor,
        textTransform: 'none',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
      },

      '& .MuiFormControlLabel-label': {
        marginBottom: 0,
        marginLeft: '0.5rem',
        color: headerButtonBorderColor,
        fontWeight: 400,
      },

      '& p': {
        '&.MuiTypography-root': {
          color: headerButtonBorderColor,
          fontWeight: 400,
        },
      },

      '& .MuiDivider-root': {
        margin: '1.5rem 0',
        borderColor: headerBorderColor
      },
    },
  },

}));

export const DeleteExperimentDialog = (props: any) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  const deleteExperiment = () => {
    console.log("delete experiment");
    handleClose();
  }
  return (
    <DeleteModal open={Boolean(open)}
      handleClose={handleClose}
      title="Delete this experiment"
      dialogActions={true}
      actionText="Delete"
      handleAction={() => deleteExperiment()}
    >
      <Box display="flex" className={classes.about}>
        <Box className="details">
          <Typography>It will also be deleted from workspaces where it has been shared.
            Duplicated experiments will not be affected. </Typography>
        </Box>

      </Box>
    </DeleteModal>
  );
}