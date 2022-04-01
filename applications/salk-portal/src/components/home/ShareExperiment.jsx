import * as React from "react";
import Modal from "../common/BaseDialog";
import { ShareExperimentTabs } from "../common/ExperimentDialogs/ShareExperimentTabs";

export const ShareExperimentDialog = (props) => {
  const { open, handleClose } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSalkTeam = () => {
    console.log("Publish to Salk team")
  };

  const handleCommunity = () => {
    console.log("Publish to Community")
  };

  return (
    <Modal
      dialogActions={value !== 0}
      actionText={value === 1 ? "Publish to Salk team" : "Publish to Community" }
      disableGutter
      open={open}
      handleClose={handleClose}
      handleAction={value === 1 ? handleSalkTeam : handleCommunity}
      title="Share"
    >
      <ShareExperimentTabs value={value} handleChange={handleChange}/>
    </Modal>
  );
};