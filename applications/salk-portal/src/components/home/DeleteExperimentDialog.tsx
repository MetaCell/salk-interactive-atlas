import * as React from "react";
import {
  makeStyles,
} from "@material-ui/core";
import { Button, Dialog, DialogActions, DialogContent,  DialogTitle, IconButton, Box, Typography } from "@material-ui/core";
import {orange} from  "../../theme"
import CLOSE from "../../assets/images/icons/close.svg";

const useStyles = makeStyles(() => ({
    info: {
        '& .MuiTypography-root': {
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.001em',
          },
    }, 

}));



interface IDeleteDialog {
    open:boolean;
    handleClose: () => void
}

export const DeleteExperimentDialog: React.FC<IDeleteDialog> = ({open, handleClose}) => {
  const classes = useStyles()

  return (
    <Dialog
      fullWidth={true}
      maxWidth='xs'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
      Delete this experiment?
        <IconButton onClick={handleClose}>
          <img src={CLOSE} alt="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} className={classes.info}>
         <Typography component={"p"}>
        It will also be deleted from workspaces where it has been shared. Duplicated experiments will not be affected.
        </Typography>
      </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor:orange
            }}
            disableElevation={true}
            variant="contained">
           Delete
          </Button>
        </DialogActions>
    </Dialog>
  )
}