import {AtlasChoice} from "./utilities/constants";
// @ts-ignore
import {WidgetStatus} from "@metacell/geppetto-meta-client/common/layout/model";
import {Population} from "./apiclient/workspaces";

export const CanvasWidget = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>, activePopulations: any,
                             shouldCameraReset: boolean = false) => {
    return {
        id: 'canvasWidget',
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
    id: 'epWidget',
    name: "Electrophysiology",
    component: "electrophysiologyViewer",
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
};

export const DensityWidget = (experimentId: string, subdivisions: string[], activePopulations: Population[], selectedAtlas: AtlasChoice,
                              selectedValue: string, showProbabilityMap: boolean, showNeuronalLocations: boolean,
                              handleDensityMapChange: (value: string) => void) => {
    return {
        id: 'densWidget',
        name: "Density Map",
        component: "densityMap",
        panelName: "bottomLeftPanel",
        enableClose: false,
        status: WidgetStatus.ACTIVE,
        config: {
            experimentId,
            subdivisions,
            activePopulations,
            selectedAtlas,
            selectedValue,
            showProbabilityMap,
            showNeuronalLocations,
            onChange: handleDensityMapChange
        }
    }
};