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
    OVERLAYS,
    POPULATION_FINISHED_STATE,
    PROBABILITY_MAP_ID,
    PULL_TIME_MS
} from "../utilities/constants"
import {getAtlas} from "../service/AtlasService";
import {Experiment, ExperimentPopulations} from "../apiclient/workspaces";
import {areAllSelected} from "../utilities/functions";
import workspaceService from "../service/WorkspaceService";
import Cell from "../models/Cell";
import {canvasWidget, densityWidget, ElectrophysiologyWidget, widgetIds} from "../widgets";
import {useInterval} from "../utilities/hooks/useInterval";

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

const getDefaultOverlays = () => {
    const overlaysSwitchState: { [key: string]: boolean } = {}
    // @ts-ignore
    Object.keys(OVERLAYS).forEach(k => overlaysSwitchState[k] = false)
    return overlaysSwitchState
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
    const [overlaysSwitchState, setOverlaysSwitchState] = useState(getDefaultOverlays())


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

    const handleWidgets = () => {
        const switchableWidgets = new Set()
        // if the widget is not active
        for (const overlay of Object.keys(overlaysSwitchState)) {
            // @ts-ignore
            const widgetId = OVERLAYS[overlay].widgetId
            // if switch is active but widget is not added
            if (overlaysSwitchState[overlay] && !(widgetId in store.getState().widgets)) {
                dispatch(addWidget(getOverlayWidget(widgetId)))
            }
            switchableWidgets.add(widgetId)
        }

        for (const wId of Object.keys(store.getState().widgets)) {
            // if widget is visible but no switch is on
            if (switchableWidgets.has(wId) && !hasActiveSwitch(wId)) {
                dispatch(deleteWidget(wId))
            }
        }
    }

    const hasActiveSwitch = (widgetId: string) => {
        for (const overlayId of Object.keys(overlaysSwitchState)) {
            // @ts-ignore
            if (OVERLAYS[overlayId].widgetId === widgetId) {
                if (overlaysSwitchState[overlayId]) {
                    return true
                }
            }
        }
        return false
    }

    const handleOverlaySwitch = (overlayId: string) => {
        setOverlaysSwitchState({...overlaysSwitchState, [overlayId]: !overlaysSwitchState[overlayId]})
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

    const getOverlayWidget = (widgetId: string) => {
        switch (widgetId) {
            case widgetIds.densityMap:
                return densityWidget(Object.keys(subdivisions), Object.values(getActivePopulations()),
                    selectedAtlas, overlaysSwitchState[PROBABILITY_MAP_ID], overlaysSwitchState[NEURONAL_LOCATIONS_ID])
            default:
                return null
        }
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
            dispatch(addWidget(canvasWidget(selectedAtlas, new Set(), {})));
            dispatch(addWidget(ElectrophysiologyWidget));
        }
    }, [experiment])


    useEffect(() => {
        handleWidgets()
        if (widgetIds.densityMap in store.getState().widgets) {
            dispatch(updateWidget(getOverlayWidget(widgetIds.densityMap)))
        }
    }, [overlaysSwitchState])

    // TODO: Handle selectedAtlas changes

    useEffect(() => {
        const subdivisionsSet = getSelectedSubdivisionsSet()
        if (widgetIds.canvas in store.getState().widgets) {
            dispatch(updateWidget(canvasWidget(selectedAtlas, subdivisionsSet, getActivePopulations(), true)))
        }
    }, [subdivisions])

    useEffect(() => {
        const subdivisionsSet = getSelectedSubdivisionsSet();
        if (widgetIds.canvas in store.getState().widgets) {
            dispatch(updateWidget(canvasWidget(selectedAtlas, subdivisionsSet, getActivePopulations(), false)))
        }
        if (widgetIds.densityMap in store.getState().widgets) {
            dispatch(updateWidget(getOverlayWidget(widgetIds.densityMap)))
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
                     populations={sidebarPopulations} overlays={Object.keys(overlaysSwitchState)}
                     handleAtlasChange={handleAtlasChange}
                     handleSubdivisionSwitch={handleSubdivisionSwitch}
                     handlePopulationSwitch={handlePopulationSwitch}
                     handleShowAllSubdivisions={handleShowAllSubdivisions}
                     handleShowAllPopulations={handleShowAllPopulations}
                     handlePopulationColorChange={handlePopulationColorChange}
                     handleOverlaySwitch={handleOverlaySwitch}
                     hasEditPermission={experiment.has_edit_permission}
            />
            <Box className={classes.layoutContainer}>
                {LayoutComponent === undefined ? <CircularProgress/> : <LayoutComponent/>}
            </Box>
        </Box>
    ) : <Loader/>
}

export default ExperimentsPage;
