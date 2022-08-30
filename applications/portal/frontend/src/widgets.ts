import {AtlasChoice} from "./utilities/constants";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
import {Population} from "./apiclient/workspaces";

export const widgetIds = {
    threeDViewer: 'threeDViewer',
    twoDViewer: 'twoDViewer',
    electrophysiologyViewer: 'epWidget'
}

export const threeDViewerWidget = (selectedAtlas: AtlasChoice, activePopulations: any) => {
    return {
        id: widgetIds.threeDViewer,
        name: "3D Viewer",
        component: widgetIds.threeDViewer,
        panelName: "topLeftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            selectedAtlas,
            activePopulations,
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

export const twoDViewerWidget = (subdivisions: string[], activePopulations: Population[], selectedAtlas: AtlasChoice) => {
    return {
        id: widgetIds.twoDViewer,
        name: "2D Viewer",
        component: widgetIds.twoDViewer,
        panelName: "rightPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            subdivisions,
            activePopulations,
            selectedAtlas,
            // TODO: Add population ids that got the cells updated
            invalidCachePopulations: new Set([])
        }
    }
};