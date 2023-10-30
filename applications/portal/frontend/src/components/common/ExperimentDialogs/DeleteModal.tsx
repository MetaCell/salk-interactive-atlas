import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, makeStyles, Typography, DialogTitle, IconButton } from "@material-ui/core";
import CLOSE from "../../../assets/images/icons/close.svg";
import { Modal as IModal } from "../../../types/modal";

const useStyles = makeStyles(() => ({
  customButton: {
    position: 'relative',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    color: 'red',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      color: 'red',
    },

  },
}));

const DeleteDialog: React.FC<IModal> = ({
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
  const classes = useStyles();

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
      <DialogContent style={{ boxShadow: 'none', padding: '0.5rem 1rem 1rem 1rem' }}>{children}</DialogContent>
      {dialogActions ?
        <DialogActions style={{ boxShadow: 'none', paddingBottom: '1rem' }}>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disableElevation={true}
            onClick={handleAction}
            className={classes.customButton}
            variant="contained" >
            {actionText}
          </Button>
        </DialogActions>
        : null}
    </Dialog>
  )
};

DeleteDialog.defaultProps = {
  maxWidth: "xs",
}

export default DeleteDialog;