import React, { useState, useRef } from "react";
import Box from "@material-ui/core/Box";
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/ExplorerSidebar";
import { bodyBgColor } from "../theme";
import ExperimentList from "../components/home/ExperimentList";
import Community from "../components/home/Community";
import { EXPERIMENTS_HASH, SALK_TEAM, ACME_TEAM, COMMUNITY_HASH, SHARED_HASH } from "../constants";
import { CloneExperimentDialog } from "../components/home/CloneExperimentDialog";
import { DeleteExperimentDialog } from "../components/home/DeleteExperimentDialog";
import { ExplorationSpinalCordDialog } from "../components/home/ExplorationSpinalCordDialog";
import { bgLightestShade } from "../theme";

const useStyles = makeStyles((theme) => ({
  layoutContainer: {
    width: 'calc(100% - 15rem)',
    overflow: 'auto',
    height: 'calc(100vh - 3rem)',
    backgroundColor: bodyBgColor,
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: bgLightestShade,
  },

}));


export default (props: any) => {
  const classes = useStyles();
  const myRef = useRef(null);
  const shared = useRef(null);
  const salkteam = useRef(null);
  const acmeteam = useRef(null);
  const communityRef = useRef(null);
  const [selectedRef, setSelectedRef] =  useState(myRef);
  const executeScroll = (selRef: string) => {
    if (selRef === EXPERIMENTS_HASH) {
      setSelectedRef(myRef);
    } else if (selRef === SHARED_HASH) {
      setSelectedRef(shared);
    } else if (selRef === SALK_TEAM) {
      setSelectedRef(salkteam);
    } else if (selRef === ACME_TEAM) {
      setSelectedRef(acmeteam);
    } else if (selRef === COMMUNITY_HASH) {
      setSelectedRef(communityRef);
    }
    selectedRef.current.scrollIntoView();
  }
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDialogToggle = () => {
    setDialogOpen((prevOpen) => !prevOpen);
  };

  const [explorationDialogOpen, setExplorationDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleExplorationDialogToggle = () => {
    setExplorationDialogOpen((prevOpen) => !prevOpen);
  };
  const handleDeleteDialogToggle = () => {
    setDeleteDialogOpen((prevOpen) => !prevOpen);
  };
  return (
    <Box display="flex">
      <Sidebar executeScroll={(r: string) => executeScroll(r)} />
      <Box className={classes.layoutContainer}>
        <div ref={myRef} id={EXPERIMENTS_HASH}>
          <ExperimentList heading={"My experiments"} description={"7 experiments"} type={EXPERIMENTS_HASH} handleExplorationDialogToggle={handleExplorationDialogToggle} handleDeleteDialogToggle={handleDeleteDialogToggle} infoIcon={false} />
        </div>
        <div ref={shared} id={SHARED_HASH}>
          <ExperimentList heading={"Shared with me"} description={"28 experiments"} type={SHARED_HASH} handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={false} />
        </div>
        <div ref={salkteam} id={SALK_TEAM}>
          <ExperimentList heading={"Salk Institute Team"} description={"19 experiments"} type={SALK_TEAM} handleDialogToggle={handleDialogToggle}handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={true} />
        </div>
        <div ref={acmeteam} id={ACME_TEAM}>
          <ExperimentList heading={"Acme Team"} description={"19 experiments"} type={ACME_TEAM} handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={false}/>
        </div>
        <Box p={5}>
          <div ref={communityRef} id={COMMUNITY_HASH}>
            <Community handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} />
          </div>
        </Box>

      </Box>
      <Backdrop
        className={classes.backdrop}
        open={deleteDialogOpen}
        onClick={handleDeleteDialogToggle}
      />
      <CloneExperimentDialog open={dialogOpen} handleClose={handleDialogToggle} user={props?.user} />
      <DeleteExperimentDialog open={deleteDialogOpen} handleClose={handleDeleteDialogToggle}/>
      <ExplorationSpinalCordDialog open={explorationDialogOpen} handleClose={handleExplorationDialogToggle} />
    </Box>
  )
};
