import ExperimentViewer from "../ExperimentViewer";
import ElectrophysiologyViewer from "../ElectrophysiologyViewer";
import DensityMap from "../DensityMap";
import {OVERLAYS} from "../../utilities/constants";


const componentMap = {
    'experimentViewer': ExperimentViewer,
    'electrophysiologyViewer': ElectrophysiologyViewer,
    [OVERLAYS.densityMap.id]: DensityMap
};

export default componentMap;