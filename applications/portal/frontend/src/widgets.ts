import {AtlasChoice} from "./utilities/constants";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
import {Population} from "./apiclient/workspaces";

export const widgetIds = {
    threeDViewer: 'threeDViewer',
    twoDViewer: 'twoDViewer',
    detailsViewer: 'detailsViewer'
}

export const threeDViewerWidget = (selectedAtlas: AtlasChoice, activePopulations: any, populationDotSizes: any, experiment: any) => {
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
            populationDotSizes,
            experiment
        }
    }
};

export const DetailsWidget = (active: boolean, populationId: string, hasEditPermission: boolean) => {
    return {
        id: widgetIds.detailsViewer,
        name: "Details Viewer",
        component: "detailsViewer",
        panelName: "rightPanel",
        pos: 2,
        enableClose: false,
        status: active ? WidgetStatus.ACTIVE : WidgetStatus.HIDDEN,
        config: {
            populationId,
            hasEditPermission
        }
    }
};

export const twoDViewerWidget = (subdivisions: string[], activePopulations: Population[], selectedAtlas: AtlasChoice,
                                 status: WidgetStatus) => {
    return {
        id: widgetIds.twoDViewer,
        name: "2D Viewer",
        component: widgetIds.twoDViewer,
        panelName: "rightPanel",
        pos: 1,
        enableClose: false,
        status,
        config: {
            subdivisions,
            activePopulations,
            selectedAtlas,
            // TODO: Add population ids that got the cells updated
            invalidCachePopulations: new Set([])
        }
    }
};