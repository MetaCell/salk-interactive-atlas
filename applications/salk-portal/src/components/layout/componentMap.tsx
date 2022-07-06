import ThreeDViewer from "../viewers/threeD/ThreeDViewer";
import TwoDViewer from "../viewers/twoD/TwoDViewer";
import ElectrophysiologyViewer from "../viewers/ElectrophysiologyViewer";
import {widgetIds} from "../../widgets";


const componentMap = {
    [widgetIds.threeDViewer]: ThreeDViewer,
    [widgetIds.twoDViewer]: TwoDViewer,
    'electrophysiologyViewer': ElectrophysiologyViewer
};

export default componentMap;