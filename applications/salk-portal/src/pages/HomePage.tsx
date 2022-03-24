import React, { useState, useRef } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/ExplorerSidebar";
import { bodyBgColor } from "../theme";
import ExperimentList from "../components/home/ExperimentList";
import Community from "../components/home/Community";
import { EXPERIMENTS_HASH, SALK_TEAM, ACME_TEAM, COMMUNITY_HASH, SHARED_HASH } from "../constants";

const useStyles = makeStyles(() => ({
  layoutContainer: {
    width: 'calc(100% - 15rem)',
    overflow: 'auto',
    height: 'calc(100vh - 3rem)',
    backgroundColor: bodyBgColor,
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

  return (
    <Box display="flex">
      <Sidebar executeScroll={(r: string) => executeScroll(r)} />
      <Box className={classes.layoutContainer}>
        <div ref={myRef} id={EXPERIMENTS_HASH}>
          <ExperimentList heading={"My experiments"} description={"1 experiment"} type={EXPERIMENTS_HASH} infoIcon={false} />
        </div>
        {/*<div ref={shared} id={SHARED_HASH}>
          <ExperimentList heading={"Shared with me"} description={"28 experiments"} type={SHARED_HASH} infoIcon={false} />
        </div>
        <div ref={salkteam} id={SALK_TEAM}>
          <ExperimentList heading={"Salk Institute Team"} description={"19 experiments"} type={SALK_TEAM} infoIcon={true}/>
        </div>
        <div ref={acmeteam} id={ACME_TEAM}>
          <ExperimentList heading={"Acme Team"} description={"19 experiments"} type={ACME_TEAM} infoIcon={false} />
        </div>
        <Box p={5}>
          <div ref={communityRef} id={COMMUNITY_HASH}>
            <Community />
          </div>
        </Box>*/}

      </Box>
    </Box>
  )
};
