import ThreeDViewer from "../ThreeDViewer";
import TwoDViewer from "../TwoDViewer";
import ElectrophysiologyViewer from "../ElectrophysiologyViewer";
import {widgetIds} from "../../widgets";


const componentMap = {
    [widgetIds.threeDViewer]: ThreeDViewer,
    [widgetIds.twoDViewer]: TwoDViewer,
    'electrophysiologyViewer': ElectrophysiologyViewer
};

export default componentMap;