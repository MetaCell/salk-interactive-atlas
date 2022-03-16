import React, {useEffect, useState} from 'react';
import {useDispatch, useStore} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import {getLayoutManagerInstance} from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import {addWidget} from '@metacell/geppetto-meta-client/common/layout/actions';
// @ts-ignore
import Loader from '@metacell/geppetto-meta-ui/loader/Loader'

import {Box} from "@material-ui/core";
import {bodyBgColor, font} from "../theme";
import Sidebar from "../components/ExperimentSidebar";
// @ts-ignore
import {AtlasChoice} from "../utilities/constants"


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

const MOCKED_ID = 1
const MOCKED_SELECTED_ATLAS = AtlasChoice.slk10

export const CanvasWidget = (e: any) => {
    return {
        id: 'canvasWidget',
        name: "Spinal Cord Atlas",
        component: "experimentViewer",
        panelName: "leftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            experiment: e,
            atlas: MOCKED_SELECTED_ATLAS
        }
    }
};

export const ElectrophysiologyWidget = {
    id: 'epWidget',
    name: "Electrophysiology",
    component: "electrophysiologyViewer",
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

const MOCKED_GET_EXPERIMENT = async (id: number) => {
    return new Promise(resolve => {
        // @ts-ignore
        const mockedExperiment = {
            "id": id,
            "name": "Exploration of the Spinal Cord",
            "is_private": true,
            "description": "Description Experiment",
            "date_created": "2022-03-14",
            "last_modified": "2022-03-15",
            "owner": {
                "id": 1,
                "username": "afonso",
                "first_name": "",
                "last_name": "",
                "email": "afonso@metacell.us",
                "groups": []
            },
            "teams": [],
            "collaborators": [],
            "populations": [
                {
                    "id": 1,
                    "name": "Test Population",
                    "color": "#FFFF00",
                    "atlas": "slk10"
                }
            ],
            "tags": [
                {
                    "id": 1,
                    "name": "Test Tag"
                },
            ]
        }
        setTimeout(() => {
            resolve(mockedExperiment);
        }, 10);
    });
};

/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage = () => {

    const classes = useStyles();
    const store = useStore();
    const [experiment, setExperiment] = useState(null)
    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    useEffect(() => {
        MOCKED_GET_EXPERIMENT(MOCKED_ID).then(e => setExperiment(e))
    }, [])

    useEffect(() => {
        if (experiment != null) {
            dispatch(addWidget(CanvasWidget(experiment)));
            dispatch(addWidget(ElectrophysiologyWidget));
        }
    }, [experiment])

    useEffect(() => {
        if (LayoutComponent === undefined) {
            const myManager = getLayoutManagerInstance();
            if (myManager) {
                setLayoutManager(myManager.getComponent());
            }
        }
    }, [store])

    return experiment != null ? (
        <Box display="flex">
            <Sidebar experiment={experiment}/>
            <Box className={classes.layoutContainer}>
                {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
            </Box>
        </Box>
    ) : <Loader/>
}

export default ExperimentsPage;