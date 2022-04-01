import * as React from "react";
import {
  Box,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Modal from "../common/BaseDialog";
import CHECK_ICON from "../../assets/images/icons/checkbox.svg";
import CHECKED_ICON from "../../assets/images/icons/checkbox-filled.svg";
import { ShareExperimentTabs } from "../common/ExperimentDialogs/ShareExperimentTabs";

const useStyles = makeStyles(() => ({
  checkboxGroup: {
    padding: '0.5rem 1rem 4.25rem 0.375rem',
  },
}));

export const ShareMultipleExperimentDialog = (props) => {
  const classes = useStyles();
  const { open, handleClose } = props;
  const [value, setValue] = React.useState(0);
  const [tabsView, setTabsView] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Modal
      dialogActions={!tabsView || (tabsView && value!== 0)}
      actionText={!tabsView ? "Next" : value === 1 ? "Publish to Salk team" :  "Publish to Community" }
      disableGutter
      open={open}
      handleClose={handleClose}
      handleAction={!tabsView ? () => setTabsView(true) : () => {}}
      title="Share multiple experiments"
    >
      {!tabsView ? (
        <Box className={classes.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<img src={CHECK_ICON} alt="" />}
                checkedIcon={<img src={CHECKED_ICON} alt="" />}
              />
            }
            label="Exploration of the spinal cord"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<img src={CHECK_ICON} alt="" />}
                checkedIcon={<img src={CHECKED_ICON} alt="" />}
              />
            }
            label="Exploration of the spinal cord"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<img src={CHECK_ICON} alt="" />}
                checkedIcon={<img src={CHECKED_ICON} alt="" />}
              />
            }
            label="Exploration of the spinal cord"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<img src={CHECK_ICON} alt="" />}
                checkedIcon={<img src={CHECKED_ICON} alt="" />}
              />
            }
            label="Exploration of the spinal cord"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<img src={CHECK_ICON} alt="" />}
                checkedIcon={<img src={CHECKED_ICON} alt="" />}
              />
            }
            label="Exploration of the spinal cord"
          />
        </Box>
      ) : (
         <ShareExperimentTabs value={value} handleChange={handleChange}/>
      )}

    </Modal>
  );
};