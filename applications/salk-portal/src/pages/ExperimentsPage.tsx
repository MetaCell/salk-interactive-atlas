import React, {useEffect, useState} from 'react';
import {useStore, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import {getLayoutManagerInstance} from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import {addWidget} from '@metacell/geppetto-meta-client/common/layout/actions';
import { Box} from "@material-ui/core";
import { font, bodyBgColor } from "../theme";
import Sidebar from "../components/ExperimentSidebar";


const useStyles = makeStyles({
    layoutContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        background: bodyBgColor,
        padding: '0.5rem',

        '& *': {
          fontFamily: font
        },

        '&> div': {
          height: '100%',
          '&> div': {
            position: 'relative',
          }
        }
    }
});

export const CanvasWidget = {
    id: 'canvasWidget',
    name: "Spinal Cord Atlas",
    component: "experimentViewer",
    panelName: "leftPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

export const ElectrophysiologyWidget = {
    id: 'epWidget',
    name: "Electrophysiology",
    component: "electrophysiologyViewer",
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage = () => {

    const classes = useStyles();
    const store = useStore();
    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    useEffect(() => {
        dispatch(addWidget(CanvasWidget));
        dispatch(addWidget(ElectrophysiologyWidget));
    }, [])

    useEffect(() => {
        if (LayoutComponent === undefined) {
            const myManager = getLayoutManagerInstance();
            if (myManager) {
                setLayoutManager(myManager.getComponent());
            }
        }
    }, [store])

    return (
      <Box display="flex">
        <Sidebar />
        <Box className={classes.layoutContainer}>
          {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
        </Box>
      </Box>
    );
}

export default ExperimentsPage;