import React, {useState, useRef, useEffect} from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/ExplorerSidebar";
import { bodyBgColor } from "../theme";
import ExperimentList from "../components/home/ExperimentList";
import Community from "../components/home/Community";
import {
  EXPERIMENTS_HASH,
  SALK_TEAM,
  ACME_TEAM,
  COMMUNITY_HASH,
  SHARED_HASH,
  PULL_TIME_MS
} from "../utilities/constants";
import { CloneExperimentDialog } from "../components/home/CloneExperimentDialog";
import { ExplorationSpinalCordDialog } from "../components/home/ExplorationSpinalCordDialog";
import { ShareExperimentDialog } from "../components/home/ShareExperiment";
import { ShareMultipleExperimentDialog } from "../components/home/ShareMultipleExperiment";
import workspaceService from "../service/WorkspaceService";

const useStyles = makeStyles(() => ({
  layoutContainer: {
    width: 'calc(100% - 15rem)',
    overflow: 'auto',
    height: 'calc(100vh - 3rem)',
    backgroundColor: bodyBgColor,
  },

}));


export default (props: any) => {
  const api = workspaceService.getApi()
  const classes = useStyles();
  const myRef = useRef(null);
  const shared = useRef(null);
  const salkteam = useRef(null);
  const acmeteam = useRef(null);
  const communityRef = useRef(null);
  const [selectedRef, setSelectedRef] =  useState(myRef);
  const [experiments, setExperiments] =  useState([]);
  const {latestExperimentId} = props;

  const fetchExperiments = async () => {
    const response = await api.listExperiments()
    setExperiments(response.data)
  }

  const executeScroll = (selRef: string) => {
    // if (selRef === EXPERIMENTS_HASH) {\
    //   setSelectedRef(myRef);
    // } else if (selRef === SHARED_HASH) {
    //   setSelectedRef(shared);
    // } else if (selRef === SALK_TEAM) {
    //   setSelectedRef(salkteam);
    // } else if (selRef === ACME_TEAM) {
    //   setSelectedRef(acmeteam);
    // } else if (selRef === COMMUNITY_HASH) {
    //   setSelectedRef(communityRef);
    // }
    // selectedRef.current.scrollIntoView();
  }
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDialogToggle = () => {
    setDialogOpen((prevOpen) => !prevOpen);
  };

  const [explorationDialogOpen, setExplorationDialogOpen] = React.useState(false);

  const handleExplorationDialogToggle = () => {
    setExplorationDialogOpen((prevOpen) => !prevOpen);
  };

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const handleShareDialogToggle = () => {
    setShareDialogOpen((prevOpen) => !prevOpen);
  };

  const [shareMultipleDialogOpen, setShareMultipleDialogOpen] = React.useState(false);

  const handleShareMultipleDialogToggle = () => {
    setShareMultipleDialogOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    fetchExperiments().catch(console.error);
  }, [latestExperimentId])

  return (
    <Box display="flex">
      <Sidebar experiments={experiments} executeScroll={(r: string) => executeScroll(r)} />
      <Box className={classes.layoutContainer}>
        <div ref={myRef} id={EXPERIMENTS_HASH}>
          <ExperimentList experiments={experiments} heading={"My experiments"} description={`${experiments.length} experiments`} type={EXPERIMENTS_HASH} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={false} handleShareDialogToggle={handleShareDialogToggle} handleShareMultipleDialogToggle={handleShareMultipleDialogToggle}/>
        </div>
        {/*<div ref={shared} id={SHARED_HASH}>*/}
        {/*  <ExperimentList heading={"Shared with me"} description={"28 experiments"} type={SHARED_HASH} handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={false} handleShareDialogToggle={handleShareDialogToggle} handleShareMultipleDialogToggle={handleShareMultipleDialogToggle} />*/}
        {/*</div>*/}
        {/*<div ref={salkteam} id={SALK_TEAM}>*/}
        {/*  <ExperimentList heading={"Salk Institute Team"} description={"19 experiments"} type={SALK_TEAM} handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={true} handleShareDialogToggle={handleShareDialogToggle} handleShareMultipleDialogToggle={handleShareMultipleDialogToggle} />*/}
        {/*</div>*/}
        {/*<div ref={acmeteam} id={ACME_TEAM}>*/}
        {/*  <ExperimentList heading={"Acme Team"} description={"19 experiments"} type={ACME_TEAM} handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} infoIcon={false}handleShareDialogToggle={handleShareDialogToggle} handleShareMultipleDialogToggle={handleShareMultipleDialogToggle} />*/}
        {/*</div>*/}
        {/*<Box p={5}>*/}
        {/*  <div ref={communityRef} id={COMMUNITY_HASH}>*/}
        {/*    <Community handleDialogToggle={handleDialogToggle} handleExplorationDialogToggle={handleExplorationDialogToggle} handleShareDialogToggle={handleShareDialogToggle} handleShareMultipleDialogToggle={handleShareMultipleDialogToggle} />*/}
        {/*  </div>*/}
        {/*</Box>*/}
      </Box>
      <CloneExperimentDialog open={dialogOpen} handleClose={handleDialogToggle} user={props?.user} />
      <ExplorationSpinalCordDialog open={explorationDialogOpen} handleClose={handleExplorationDialogToggle} />
      <ShareExperimentDialog open={shareDialogOpen} handleClose={handleShareDialogToggle} />
      <ShareMultipleExperimentDialog open={shareMultipleDialogOpen} handleClose={handleShareMultipleDialogToggle} />
    </Box>
  )
};
