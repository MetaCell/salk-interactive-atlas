import React, { useEffect, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-ignore
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
// @ts-ignore
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
// @ts-ignore
import { addWidget, deleteWidget, updateWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
// @ts-ignore
import Loader from '@metacell/geppetto-meta-ui/loader/Loader'
import { Box } from "@material-ui/core";
import { bodyBgColor, font } from "../theme";
import Sidebar from "../components/sidebar/ExperimentSidebar";
// @ts-ignore
import {
    AtlasChoice,
    POPULATION_FINISHED_STATE,
    PULL_TIME_MS
} from "../utilities/constants"
import { hasNoAtSign, isNameUnknown } from '../utils';
import { getAtlas } from "../service/AtlasService";
import { Experiment, ExperimentPopulationsInner, Population } from "../apiclient/workspaces";
import { areAllPopulationsWithChildrenSelected } from "../utilities/functions";
import workspaceService from "../service/WorkspaceService";
import { DetailsWidget, threeDViewerWidget, twoDViewerWidget, widgetIds } from "../widgets";
import { useInterval } from "../utilities/hooks/useInterval";
import { useParams } from "react-router";
import { getCells } from "../helpers/CellsHelper";
import NeuronDotSize from '../components/common/ExperimentDialogs/NeuronDotSize';
import SnackMessage from '../components/snackbar/SnackMessage';


type PopulationDataType = {
    [key: string]: {
        selected: boolean;
        status: string;
    };
};

type DotSizeType = {
    [key: number]: number;
};

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

const getDefaultAtlas = () => AtlasChoice.slk10
const getSubdivisions = (sa: AtlasChoice) => {
    const subdivisions: any = {}
    const segments = getAtlas(sa).segments
    segments.forEach(sd => subdivisions[sd.id] = { selected: true })
    return subdivisions
}


/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const ExperimentsPage: React.FC<{ residentialPopulations: any }> = ({ residentialPopulations }) => {

    const api = workspaceService.getApi()
    const classes = useStyles();
    const store = useStore();
    const params = useParams();
    const [experiment, setExperiment] = useState(null)
    const [selectedAtlas, setSelectedAtlas] = useState(getDefaultAtlas());
    const [populations, setPopulations] = useState<PopulationDataType>({});
    const subdivisions = getSubdivisions(selectedAtlas);
    const [dialogPopulationsSelected, setDialogPopulationsSelected] = useState(null);
    const [populationDotSizes, setPopulationDotSizes] = useState<DotSizeType>({})
    const [errorMessage, setErrorMessage] = React.useState('');

    const dispatch = useDispatch();
    const [LayoutComponent, setLayoutManager] = useState(undefined);

    const getPopulations = (e: Experiment, sa: AtlasChoice) => {
        const nextPopulations: any = {}
        const filteredPopulations = e.populations.filter((p: Population) => p.atlas === sa)
        filteredPopulations.forEach(p => nextPopulations[p.id] = {
            ...p,
            status: p.status,
            selected: populations[p.id]?.selected || false,
        });


        Object.values(residentialPopulations).forEach((p: any) => {
            if (!nextPopulations[p.id]) {
                nextPopulations[p.id] = {
                    ...p,
                    selected: populations[p.id]?.selected || false
                }
            }
        })

        Object.values(residentialPopulations).forEach((p: any) => {
            if (!nextPopulations[p.id]) {
                nextPopulations[p.id] = {
                    ...p,
                    selected: populations[p.id]?.selected || false
                }
            }
        })

        return nextPopulations
    }

    const handleAtlasChange = (atlasId: AtlasChoice) => {
        setSelectedAtlas(atlasId)
    };
    const handleShowAllPopulations = (pops: {
        [x: string]: {
            children?: {
                [childId: string]: {
                    selected: any
                }
            }
        }
    }) => {
        const areAllPopulationsActive = areAllPopulationsWithChildrenSelected(pops);
        const nextPopulations = { ...populations };

        Object.values(pops).forEach((parentPopulation: any) => {
            Object.keys(parentPopulation.children).forEach(pId => {
                if (nextPopulations[pId].status === POPULATION_FINISHED_STATE) {
                    nextPopulations[pId].selected = !areAllPopulationsActive;
                }
            })
        });

        setPopulations(nextPopulations);
    };

    const handleChildPopulationSwitch = (populationId: string) => {
        const nextPopulations: any = { ...populations };
        nextPopulations[populationId].selected = !nextPopulations[populationId].selected;

        setPopulations(nextPopulations);
    };


    const handleParentPopulationSwitch = (children: any, newSelectedState: boolean) => {
        const nextPopulations: any = { ...populations };
        if (children) {
            Object.keys(children).forEach(childId => {
                if (nextPopulations[childId]) {
                    nextPopulations[childId].selected = newSelectedState;
                }
            });
        }

        setPopulations(nextPopulations);
    };


    const handleOnEditPopulation = (updatedName: string, isParent: boolean, population: any) => {
        if (isParent) {
            handleRenamePopulation(updatedName, population);
        } else {
            handleRenameSubPopulation(updatedName, population);
        }
    }

    const handleRenamePopulation = async (updatedName: string, population: any) => {
        if (isNameUnknown(updatedName) || !hasNoAtSign(updatedName)) return;

        const subPopulations: any[] = Object.values(population.children);
        const renamePromises = subPopulations.map(subPopulation => {
            const newName = isNameUnknown(subPopulation.name) ? updatedName : (updatedName + "@" + subPopulation?.name);
            // @ts-ignore
            return api.partialUpdatePopulation(subPopulation.id, { name: newName })
                .then(() => ({ id: subPopulation.id, newName }))
                .catch(() => null);
        });

        try {
            const results = await Promise.all(renamePromises);
            const newPopulations = { ...populations };
            results.forEach(result => {
                if (result) {
                    // @ts-ignore
                    newPopulations[result.id].name = result.newName;
                }
            });

            setPopulations(newPopulations);
        } catch (e) {
            setErrorMessage("Error renaming population");
        }
    };


    const handleRenameSubPopulation = async (updatedName: string, population: any) => {
        const newName = population.parent + "@" + updatedName;
        if (isNameUnknown(updatedName) || !hasNoAtSign(updatedName)) { return; }

        try {
            // @ts-ignore
            await api.partialUpdatePopulation(population.id, { name: newName });

            setPopulations(prevPopulations => {
                const newPopulations = { ...prevPopulations };
                if (newPopulations[population.id]) {
                    // @ts-ignore
                    newPopulations[population.id].name = newName;
                }
                return newPopulations;
            });
        } catch (e) {
            setErrorMessage("Error renaming subpopulation");
        }
    };



    const handlePopulationColorChange = async (updates: { id: string, color: string, opacity: number }[]) => {
        const updatePromises = updates.map(update =>
            // @ts-ignore
            api.partialUpdatePopulation(update.id, { color: update.color, opacity: update.opacity })
        );

        try {
            await Promise.all(updatePromises);

            setPopulations((prevPopulations) => {
                const nextPopulations = { ...prevPopulations };
                updates.forEach(({ id, color, opacity }) => {
                    if (nextPopulations[id]) {
                        // @ts-ignore
                        nextPopulations[id] = { ...nextPopulations[id], color, opacity };
                    }
                });
                return nextPopulations;
            });

        } catch (error) {
            setErrorMessage("Couldn't update population color")
        }
    };

    const handleSubPopulationDotSizeChange = (newPopulationDotSizes: DotSizeType) => {
        setPopulationDotSizes(newPopulationDotSizes)
    }

    const getActivePopulations = () => Object.keys(populations)
        // @ts-ignore
        .filter(pId => populations[pId].selected)
        .reduce((obj, key) => {
            // @ts-ignore
            obj[key] = populations[key];
            return obj;
        }, {});


    useInterval(() => {
        const fetchData = async () => {
            // @ts-ignore
            const response = await api.retrieveExperiment(params.id)
            const fetchedExperiment = response.data;
            const cells = await Promise.all(fetchedExperiment.populations.map(async (p) => {
                if (p.status !== POPULATION_FINISHED_STATE) return null;
                const existingPopulation = experiment.populations.find((e: ExperimentPopulationsInner) => e.id === p.id)
                if (existingPopulation !== undefined && typeof existingPopulation.cells !== "string"
                    && existingPopulation.cells !== null) {
                    return existingPopulation.cells
                }
                return getCells(api, p);
            }));
            let shouldUpdateExperiment = false;
            fetchedExperiment.populations.forEach((p, i) => {
                const existingPopulation = experiment.populations.find((e: ExperimentPopulationsInner) => e.id === p.id)
                if (existingPopulation === undefined || typeof existingPopulation.cells === "string" ||
                    (existingPopulation.cells === null && cells[i] !== null)) {
                    // previous population cells !== new population cells --> update the experiment data
                    shouldUpdateExperiment = true;
                }
                fetchedExperiment.populations[i].cells = cells[i]
            });
            if (shouldUpdateExperiment) {
                setExperiment(fetchedExperiment)
                const experimentPopulations = getPopulations(fetchedExperiment, selectedAtlas)
                setPopulations(experimentPopulations)
                // TODO: Handle error status on populations
            }
        }
        fetchData()
            .catch(console.error);
    }, PULL_TIME_MS);


    const setInitialPopulationDotSizes = (initialPopulations: any, initialResidentialPopulations: any) => {
        const dotsizes: any = {}
        Object.values(initialPopulations).forEach((p: any) => {
            dotsizes[p.id] = 1
        })
        Object.values(initialResidentialPopulations).forEach((p: any) => {
            dotsizes[p.id] = 1
        })
        return dotsizes
    }

    useEffect(() => {
        const fetchData = async () => {
            // @ts-ignore
            const response = await api.retrieveExperiment(params.id)
            const data = response.data;
            const cells = await Promise.all(data.populations.map(async (p) => {
                if (p.status !== POPULATION_FINISHED_STATE) {
                    return null;
                }
                return getCells(api, p);
            }));
            data.populations.forEach((p, i) => {
                data.populations[i].cells = cells[i]
            });
            setPopulationDotSizes(setInitialPopulationDotSizes(data.populations, residentialPopulations))
            setExperiment(data)
        }

        fetchData()
            .catch(console.error);
    }, [])

    useEffect(() => {
        if (experiment != null) {
            const experimentPopulations = getPopulations(experiment, selectedAtlas)
            setPopulations(experimentPopulations)
            dispatch(addWidget(threeDViewerWidget(selectedAtlas, {}, populationDotSizes, experiment)));
            dispatch(addWidget(twoDViewerWidget(Object.keys(subdivisions), [], selectedAtlas,
                WidgetStatus.ACTIVE)));
            dispatch(addWidget(DetailsWidget(false, null, experiment.has_edit_permission)));
        }
    }, [experiment])

    // TODO: Handle selectedAtlas changes

    const getWidgetStatus = (widgetId: string) => {
        return store.getState().widgets[widgetId].status
    }

    function getWidget(widgetId: string) {
        switch (widgetId) {
            case widgetIds.threeDViewer:
                return threeDViewerWidget(selectedAtlas, getActivePopulations(), populationDotSizes, experiment)
            case widgetIds.twoDViewer:
                return twoDViewerWidget(Object.keys(subdivisions), Object.values(getActivePopulations()), selectedAtlas,
                    getWidgetStatus(widgetId))
        }

    }



    useEffect(() => {
        for (const widgetId of Object.keys(store.getState().widgets)) {
            const widget = getWidget(widgetId)
            if (widget) {
                dispatch(updateWidget(widget))
            }
        }
    }, [populations, populationDotSizes])

    useEffect(() => {
        if (LayoutComponent === undefined) {
            const myManager = getLayoutManagerInstance();
            if (myManager) {
                setLayoutManager(myManager.getComponent());
            }
        }
    }, [store])

    const [anchorElDotSize, setAnchorElDotSize] = React.useState(null);

    const handleDotSizeClick = (event: any) => {
        setAnchorElDotSize(anchorElDotSize ? null : event.currentTarget);
    };

    const handleCloseDotSizePopover = () => {
        setAnchorElDotSize(null);
    };

    const dotSizeOpen = Boolean(anchorElDotSize);
    const dotSizeId = open ? 'simple-popper' : undefined;

    return experiment != null ? (
        <Box display="flex">
            {/* @ts-ignore */}
            <Sidebar selectedAtlas={selectedAtlas}
                populations={populations}
                handleAtlasChange={handleAtlasChange}
                handleOnEditPopulation={handleOnEditPopulation}
                handleChildPopulationSwitch={handleChildPopulationSwitch}
                handleParentPopulationSwitch={handleParentPopulationSwitch}
                handleShowAllPopulations={handleShowAllPopulations}
                handlePopulationColorChange={handlePopulationColorChange}
                hasEditPermission={experiment.has_edit_permission}
                handleDotSizeClick={handleDotSizeClick}
                setDialogPopulationsSelected={setDialogPopulationsSelected}
                dotSizeId={dotSizeId}
            />
            <Box className={classes.layoutContainer}>
                <NeuronDotSize
                    open={dotSizeOpen}
                    id={dotSizeId}
                    onClose={handleCloseDotSizePopover}
                    populations={populations}
                    anchorElement={anchorElDotSize}
                    activePopulations={getActivePopulations()}
                    handleSubPopulationDotSizeChange={handleSubPopulationDotSizeChange}
                    dialogPopulationsSelected={dialogPopulationsSelected}
                    populationDotSizes={populationDotSizes}
                />
                {LayoutComponent === undefined ? <CircularProgress /> : <LayoutComponent />}
            </Box>
            <SnackMessage
                message={errorMessage}
                setMessage={setErrorMessage}
            />
        </Box>
    ) : <Loader />
}

export default ExperimentsPage;