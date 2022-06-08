import {AtlasChoice} from "./utilities/constants";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
import {Population} from "./apiclient/workspaces";

export const widgetIds = {
    threeDViewer: 'threeDViewer',
    twoDViewer: 'twoDViewer',
    electrophysiologyViewer: 'epWidget'
}

export const threeDViewerWidget = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>, activePopulations: any,
                                   shouldCameraReset: boolean = false) => {
    return {
        id: widgetIds.threeDViewer,
        name: "3D Viewer",
        component: widgetIds.threeDViewer,
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

export const twoDViewerWidget = (subdivisions: string[], activePopulations: Population[], selectedAtlas: AtlasChoice,
                                 showProbabilityMap: boolean, showNeuronalLocations: boolean) => {
    return {
        id: widgetIds.twoDViewer,
        name: "2D Viewer",
        component: widgetIds.twoDViewer,
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