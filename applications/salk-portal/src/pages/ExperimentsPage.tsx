import React, {useEffect, useState} from 'react';
import {useDispatch, useStore} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import {getLayoutManagerInstance} from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import {addWidget, updateWidget} from '@metacell/geppetto-meta-client/common/layout/actions';
// @ts-ignore
import Loader from '@metacell/geppetto-meta-ui/loader/Loader'

import {Box} from "@material-ui/core";
import {bodyBgColor, font} from "../theme";
import Sidebar from "../components/ExperimentSidebar";
// @ts-ignore
import {AtlasChoice} from "../utilities/constants"
import {getAtlas} from "../service/AtlasService";
import {Experiment, ExperimentPopulations} from "../apiclient/workspaces";
import {areAllSelected} from "../utilities/functions";
import workspaceService from "../service/WorkspaceService";
import Cell from "../models/Cell";


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

const MOCKED_ID = "1"

export const CanvasWidget = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>, activePopulations: any) => {
    return {
        id: 'canvasWidget',
        name: "Spinal Cord Atlas",
        component: "experimentViewer",
        panelName: "leftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            selectedAtlas,
            activeSubdivisions,
            activePopulations,
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


const getDefaultAtlas = () => AtlasChoice.slk10
const getSubdivisions = (sa: AtlasChoice) => {
    const subdivisions: any = {}
    const segments = getAtlas(sa).segments
    segments.forEach(sd => subdivisions[sd.id] = {selected: true})
    return subdivisions
}
const getPopulations = (e: Experiment, sa: AtlasChoice) => {
    const populations: any = {}
    const filteredPopulations = e.populations.filter((p: ExperimentPopulations) => p.atlas === sa)
    filteredPopulations.forEach(p => populations[p.id] = {...p, selected: false})
    return populations
}


/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage = () => {

    const classes = useStyles();
    const store = useStore();
    const [experiment, setExperiment] = useState(null)
    const [selectedAtlas, setSelectedAtlas] = useState(getDefaultAtlas());
    const [subdivisions, setSubdivisions] = useState(getSubdivisions(selectedAtlas));
    const [populations, setPopulations] = useState({});

    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    const handleAtlasChange = (atlasId: AtlasChoice) => {
        setSelectedAtlas(atlasId)
    };

    const handleSubdivisionSwitch = (subdivisionId: string) => {
        const nextSubdivisions: any = {...subdivisions}
        nextSubdivisions[subdivisionId].selected = !nextSubdivisions[subdivisionId].selected
        setSubdivisions(nextSubdivisions)
    };

    const handleShowAllSubdivisions = () => {
        const areAllSubdivisionsActive = areAllSelected(subdivisions)
        const nextSubdivisions: any = {}
        Object.keys(subdivisions)
            .forEach(sId => nextSubdivisions[sId] = {...subdivisions[sId], selected: !areAllSubdivisionsActive})
        setSubdivisions(nextSubdivisions)
    }

    const handleShowAllPopulations = () => {
        const areAllPopulationsActive = areAllSelected(populations)
        const nextPopulations: any = {}
        Object.keys(populations)
            // @ts-ignore
            .forEach(pId => nextPopulations[pId] = {...populations[pId], selected: !areAllPopulationsActive})
        setPopulations(nextPopulations)
    }


    const handlePopulationSwitch = (populationId: string) => {
        const nextPopulations: any = {...populations}
        nextPopulations[populationId].selected = !nextPopulations[populationId].selected
        setPopulations(nextPopulations)
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await workspaceService.getApi().retrieveExperiment(MOCKED_ID)
            const data = response.data;
            const cells = await Promise.all(data.populations.map(async (p) => {
                const cellsFile = await workspaceService.getApi().cellsPopulation(`${p.id}`);
                return cellsFile.data.split('\r\n').map(csv => new Cell(csv));
            }));
            data.populations.forEach((p, i) => {
                data.populations[i].cells = cells[i]
            });
            setExperiment(data)
        }

        fetchData()
            .catch(console.error);
    }, [])

    useEffect(() => {
        if (experiment != null) {
            setPopulations(getPopulations(experiment, selectedAtlas))
            dispatch(addWidget(CanvasWidget(selectedAtlas, new Set(), {})));
            dispatch(addWidget(ElectrophysiologyWidget));
        }
    }, [experiment])

    useEffect(() => {
        const subdivisionsSet = new Set(Object.keys(subdivisions).filter(sId => subdivisions[sId].selected))
        // @ts-ignore
        const activePopulations = Object.keys(populations)
            // @ts-ignore
            .filter(pId => populations[pId].selected)
            .reduce((obj, key) => {
                // @ts-ignore
                obj[key] = populations[key];
                return obj;
            }, {});
        dispatch(updateWidget(CanvasWidget(selectedAtlas, subdivisionsSet, activePopulations)))
    }, [subdivisions, populations, selectedAtlas])

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
            <Sidebar selectedAtlas={selectedAtlas} subdivisions={subdivisions} populations={populations}
                     handleAtlasChange={handleAtlasChange} handleSubdivisionSwitch={handleSubdivisionSwitch}
                     handlePopulationSwitch={handlePopulationSwitch}
                     handleShowAllSubdivisions={handleShowAllSubdivisions}
                     handleShowAllPopulations={handleShowAllPopulations}
            />
            <Box className={classes.layoutContainer}>
                {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
            </Box>
        </Box>
    ) : <Loader/>
}

export default ExperimentsPage;
