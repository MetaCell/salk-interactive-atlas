import {AtlasChoice} from "./utilities/constants";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
import {Population} from "./apiclient/workspaces";

export const widgetIds = {
    canvas: 'canvasWidget',
    electrophysiologyViewer: 'epWidget',
    densityMap: 'densWidget'
}

export const canvasWidget = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>, activePopulations: any,
                             shouldCameraReset: boolean = false) => {
    return {
        id: widgetIds.canvas,
        name: "Spinal Cord Atlas",
        component: "experimentViewer",
        panelName: "topLeftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            selectedAtlas,
            activeSubdivisions,
            activePopulations,
            shouldCameraReset
        }
    }
};

export const ElectrophysiologyWidget = {
    id: widgetIds.electrophysiologyViewer,
    name: "Electrophysiology",
    component: "electrophysiologyViewer",
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

export const densityWidget = (subdivisions: string[], activePopulations: Population[], selectedAtlas: AtlasChoice,
                              showProbabilityMap: boolean, showNeuronalLocations: boolean) => {
    return {
        id: widgetIds.densityMap,
        name: "Density Map",
        component: "densityMap",
        panelName: "bottomLeftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            subdivisions,
            activePopulations,
            selectedAtlas,
            showProbabilityMap,
            showNeuronalLocations,
            // TODO: Add population ids that got the cells updated
            invalidCachePopulations: new Set([])
        }
    }
};