import ThreeDViewer from "../reduxconnect/ThreeDViewerConnect";
import TwoDViewer from "../viewers/twoD/TwoDViewer";
import DetailsViewer from "../viewers/detailsViewer/DetailsViewer";
import {widgetIds} from "../../widgets";


const componentMap = {
    [widgetIds.threeDViewer]: ThreeDViewer,
    [widgetIds.twoDViewer]: TwoDViewer,
    [widgetIds.detailsViewer]: DetailsViewer
};

export default componentMap;