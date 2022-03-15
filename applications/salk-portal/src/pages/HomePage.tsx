import React, { useState, useRef } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/ExplorerSidebar";
import { bodyBgColor } from "../theme";
import ExperimentList from "../components/home/ExperimentList";
import Community from "../components/home/Community";

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
    if(selRef === 'experiments') {
      setSelectedRef(myRef);
    } else if(selRef === 'shared') {
      setSelectedRef(shared);
    } else if(selRef === 'salkteam') {
      setSelectedRef(salkteam);
    } else if(selRef === 'acmeteam') {
      setSelectedRef(acmeteam);
    } else if(selRef === 'community') {
      setSelectedRef(communityRef);
    }
    selectedRef.current.scrollIntoView();
  }

  return (
    <Box display="flex">
      <Sidebar executeScroll={(r: string) => executeScroll(r)} />
      <Box className={classes.layoutContainer}>
        <div ref={myRef} id="experiments">
          <ExperimentList heading={"My experiments"} description={"7 experiments"} />
        </div>
        <div ref={shared} id="shared">
          <ExperimentList heading={"Shared with me"} description={"28 experiments"} />
        </div>
        <div ref={salkteam} id="salkteam">
          <ExperimentList heading={"Salk Institute Team"} description={"19 experiments"} />
        </div>
        <div ref={acmeteam} id="acmeteam">
          <ExperimentList heading={"Acme Team"} description={"19 experiments"} />
        </div>
        
        <Box p={5}>
          <div ref={communityRef} id="community">
            <Community />
          </div>
        </Box>

      </Box>
    </Box>
  )
};
