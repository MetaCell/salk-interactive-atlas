import { connect } from 'react-redux';
import {default as Viewer} from '../viewers/threeD/ThreeDViewer' ;
import {updateWidget} from "@metacell/geppetto-meta-client/common/layout/actions";

const ThreeDViewer = connect(
    null,
    (dispatch) => ({
        updateWidget: (widget) => dispatch(updateWidget(widget)),
    }),
)(Viewer);

export default ThreeDViewer;