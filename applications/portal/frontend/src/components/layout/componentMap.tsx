import ThreeDViewer from "../viewers/threeD/ThreeDViewer";
import TwoDViewer from "../viewers/twoD/TwoDViewer";
import DetailsViewer from "../viewers/DetailsViewer";
import {widgetIds} from "../../widgets";


const componentMap = {
    [widgetIds.threeDViewer]: ThreeDViewer,
    [widgetIds.twoDViewer]: TwoDViewer,
    [widgetIds.detailsViewer]: DetailsViewer
};

export default componentMap;