import * as React from "react";
import {
  Box,
  makeStyles,
  FormControlLabel,
  Checkbox,
  TextField
} from "@material-ui/core";
import Modal from "../common/BaseDialog";
import CHECK_ICON from "../../assets/images/icons/checkbox.svg";
import CHECKED_ICON from "../../assets/images/icons/checkbox-filled.svg";
import { ShareExperimentTabs } from "../common/ExperimentDialogs/ShareExperimentTabs";
import { headerBorderColor, headerBg, sidebarTextColor, secondaryColor } from "../../theme";

const useStyles = makeStyles(() => ({
  checkboxGroup: {
    padding: '0.5rem 1rem 4.25rem 0.375rem',
  },

  searchExperiment: {
    padding: '0 1rem',
    boxShadow: `inset 0 -0.0625rem 0 ${headerBorderColor}`,
    height: '2.75rem',
    position: 'sticky',
    top: 0,
    backgroundColor: headerBg,
    zIndex: 99,

    '& .MuiInputBase-input': {
      padding: 0,
      height: '2.75rem',
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: '1.0625rem',
      letterSpacing: '0.005em',
      color: secondaryColor,
      '&:placeholder': {color: sidebarTextColor,},
    },

    '& .MuiInput-underline': {
      '&::before': { display: 'none' },
      '&::after': { display: 'none' },
    },
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
  const experiments = ["Exploration of the spinal cord", "Exploration of the spinal cord", "Exploration of the spinal cord"];
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
        <>
          <Box className={classes.searchExperiment}>
            <TextField fullWidth placeholder="Search for an experiment" />
          </Box>
          <Box className={classes.checkboxGroup}>
            {
              experiments.map((experiment, index) =>(
                <FormControlLabel
                  key={`${experiment}_${index}`}
                  control={
                    <Checkbox
                      icon={<img src={CHECK_ICON} alt="" />}
                      checkedIcon={<img src={CHECKED_ICON} alt="" />}
                    />
                  }
                  label={experiment}
                />
              ))
            }
          </Box>
        </>
      ) : (
         <ShareExperimentTabs value={value} handleChange={handleChange}/>
      )}

    </Modal>
  );
};