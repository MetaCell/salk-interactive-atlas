import React, {useEffect, useState} from 'react';
import {useDispatch, useStore} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import {getLayoutManagerInstance} from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import {addWidget, deleteWidget, updateWidget} from '@metacell/geppetto-meta-client/common/layout/actions';
// @ts-ignore
import Loader from '@metacell/geppetto-meta-ui/loader/Loader'
import {Box} from "@material-ui/core";
import {bodyBgColor, font} from "../theme";
import Sidebar from "../components/ExperimentSidebar";
// @ts-ignore
import {
    AtlasChoice,
    NEURONAL_LOCATIONS_ID,
    POPULATION_FINISHED_STATE,
    PROBABILITY_MAP_ID,
    PULL_TIME_MS
} from "../utilities/constants"
import {getAtlas} from "../service/AtlasService";
import {Experiment, ExperimentPopulations} from "../apiclient/workspaces";
import {areAllSelected} from "../utilities/functions";
import workspaceService from "../service/WorkspaceService";
import Cell from "../models/Cell";
import {threeDViewerWidget, densityWidget, ElectrophysiologyWidget, widgetIds, twoDViewerWidget} from "../widgets";
import {useInterval} from "../utilities/hooks/useInterval";
import twoDViewer from "../components/TwoDViewer";

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

const getDefaultAtlas = () => AtlasChoice.slk10
const getSubdivisions = (sa: AtlasChoice) => {
    const subdivisions: any = {}
    const segments = getAtlas(sa).segments
    segments.forEach(sd => subdivisions[sd.id] = {selected: true})
    return subdivisions
}


/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage = () => {

    const api = workspaceService.getApi()
    const classes = useStyles();
    const store = useStore();
    const [experiment, setExperiment] = useState(null)
    const [selectedAtlas, setSelectedAtlas] = useState(getDefaultAtlas());
    const [subdivisions, setSubdivisions] = useState(getSubdivisions(selectedAtlas));
    const [populations, setPopulations] = useState({} as any);
    const [sidebarPopulations, setSidebarPopulations] = useState({} as any);


    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    const getPopulations = (e: Experiment, sa: AtlasChoice) => {
        const nextPopulations: any = {}
        const filteredPopulations = e.populations.filter((p: ExperimentPopulations) => p.atlas === sa)
        // @ts-ignore
        filteredPopulations.forEach(p => nextPopulations[p.id] = {
            ...p,
            status: p.status,
            selected: populations[p.id]?.selected || false
        })
        return nextPopulations
    }

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
        const areAllPopulationsActive = areAllSelected(sidebarPopulations)
        const nextPopulations: any = {}
        Object.keys(populations)
            .forEach(pId => nextPopulations[pId] = {
                ...sidebarPopulations[pId],
                selected: sidebarPopulations[pId].status !== POPULATION_FINISHED_STATE ? false : !areAllPopulationsActive
            })
        setSidebarPopulations(nextPopulations)
        setPopulations(nextPopulations)
    }


    const handlePopulationSwitch = (populationId: string) => {
        const nextPopulations: any = {...populations}
        nextPopulations[populationId].selected = !nextPopulations[populationId].selected
        setPopulations(nextPopulations)
    };

    const handlePopulationColorChange = async (id: string, color: string, opacity: string) => {
        // @ts-ignore
        await api.partialUpdatePopulation(id, {color, opacity})
        // @ts-ignore
        const nextPopulations = {...populations};
        // @ts-ignore
        nextPopulations[id] = {...nextPopulations[id], color, opacity}
        setPopulations(nextPopulations)
    }


    const getActivePopulations = () => Object.keys(populations)
        // @ts-ignore
        .filter(pId => populations[pId].selected)
        .reduce((obj, key) => {
            // @ts-ignore
            obj[key] = populations[key];
            return obj;
        }, {});


    const getSelectedSubdivisionsSet = () => {
        return new Set(Object.keys(subdivisions).filter(sId => subdivisions[sId].selected));
    }

    useInterval(() => {
        const fetchData = async () => {
            const response = await api.retrieveExperiment(MOCKED_ID)
            const fetchedExperiment = response.data;
            setSidebarPopulations(getPopulations(fetchedExperiment, selectedAtlas))
            // TODO: Handle error status on populations
        }
        fetchData()
            .catch(console.error);
    }, PULL_TIME_MS);


    useEffect(() => {
        const fetchData = async () => {
            const response = await api.retrieveExperiment(MOCKED_ID)
            const data = response.data;
            const cells = await Promise.all(data.populations.map(async (p) => {
                const cellsFile = await api.cellsPopulation(`${p.id}`);
                // @ts-ignore
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
            const experimentPopulations = getPopulations(experiment, selectedAtlas)
            setPopulations(experimentPopulations)
            setSidebarPopulations(experimentPopulations)
            dispatch(addWidget(threeDViewerWidget(selectedAtlas, new Set(), {})));
            dispatch(addWidget(twoDViewerWidget(Object.keys(subdivisions), [], selectedAtlas, true, false));
            dispatch(addWidget(ElectrophysiologyWidget));
        }
    }, [experiment])

    // TODO: Handle selectedAtlas changes

    useEffect(() => {
        const subdivisionsSet = getSelectedSubdivisionsSet()
        if (widgetIds.threeDViewer in store.getState().widgets) {
            dispatch(updateWidget(threeDViewerWidget(selectedAtlas, subdivisionsSet, getActivePopulations(), true)))
        }
    }, [subdivisions])

    useEffect(() => {
        const subdivisionsSet = getSelectedSubdivisionsSet();
        if (widgetIds.threeDViewer in store.getState().widgets) {
            dispatch(updateWidget(threeDViewerWidget(selectedAtlas, subdivisionsSet, getActivePopulations(), false)))
        }
    }, [populations])

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
            <Sidebar selectedAtlas={selectedAtlas} subdivisions={subdivisions}
                     populations={sidebarPopulations}
                     handleAtlasChange={handleAtlasChange}
                     handleSubdivisionSwitch={handleSubdivisionSwitch}
                     handlePopulationSwitch={handlePopulationSwitch}
                     handleShowAllSubdivisions={handleShowAllSubdivisions}
                     handleShowAllPopulations={handleShowAllPopulations}
                     handlePopulationColorChange={handlePopulationColorChange}
                     hasEditPermission={experiment.has_edit_permission}
            />
            <Box className={classes.layoutContainer}>
                {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
            </Box>
        </Box>
    ) : <Loader/>
}

export default ExperimentsPage;
