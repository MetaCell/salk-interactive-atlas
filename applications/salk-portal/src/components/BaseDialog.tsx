import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import CLOSE from "../assets/images/icons/close.svg";
import { Modal as IModal } from "../types/modal";

const Modal: React.FC<IModal> = ({
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
  return (
    <Dialog
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {title}
        <IconButton onClick={handleClose}>
          <img src={CLOSE} alt="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ padding: disableGutter ? 0 : '' }}>{children}</DialogContent>
      {dialogActions ?
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disableElevation
            onClick={handleAction}
            variant="contained" color="primary">
            {actionText}
          </Button>
        </DialogActions>
        : null}
    </Dialog>
  )
};

Modal.defaultProps = {
  maxWidth: "sm",
}

export default Modal;
