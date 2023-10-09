import * as React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { headerButtonBorderColor, secondaryColor } from "../theme";
import workspaceService from "../service/WorkspaceService";
import DeleteDialog from "./common/ExperimentDialogs/DeleteModal";


const useStyles = makeStyles(() => ({
  delete: {
    '& .details': {
      flexGrow: 1,
      '& .detail-block + .detail-block': {
        marginTop: '1.5rem',
      },

      '& .MuiTypography-root': {
        fontSize: '0.75rem',
        lineHeight: '0.9375rem',
        fontWeight: 600,
        color: secondaryColor,
        marginBottom: '0.5rem',
      },

      '& p': {
        '&.MuiTypography-root': {
          color: headerButtonBorderColor,
          fontWeight: 400,
        },
      },

    },
  }
}));



export const DeleteExperimentDialog = (props: any) => {
  const { open, handleClose, experimentId, refreshExperimentList } = props;
  const classes = useStyles();
  const api = workspaceService.getApi();

  const deleteExperiment = async (id: string) => {
    if (id) {
      const response = await api.destroyExperiment(id)
      if (response) {
        refreshExperimentList()
      }
    }
    handleClose();
  }
  return (
    <DeleteDialog open={Boolean(open)}
      handleClose={handleClose}
      title="Are you sure you want to delete the experiment?"
      dialogActions={true}
      actionText="Delete"
      handleAction={() => deleteExperiment(experimentId)}
    >
      <Box display="flex" className={classes.delete}>
        <Box className="details">
          <Typography>The experiment and all the data will be permanently deleted. It will also be deleted from workspaces where it has been shared.
          </Typography>
        </Box>

      </Box>
    </DeleteDialog>
  );
}