import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
// @ts-ignore
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
// @ts-ignore
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
// @ts-ignore
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
import {canvasBg} from "../theme";
import {getAtlas} from "../service/AtlasService"
import {getInstancesIds} from "../utilities/instancesHelper";
import {eqSet} from "../utilities/functions";

const MOCKED_GREY_MATTER = 'GM'
const MOCKED_WHITE_MATTER = 'WM'

const MOCKED_GET_COLOR = (id: string) => {
    return id.includes(MOCKED_WHITE_MATTER) ? {r: 0.30, g: 0.54, b: 0.59, a: 0.5} :
        id.includes(MOCKED_GREY_MATTER) ? {r: 0.4525, g: 0.2624, b: 0.2852, a: 0.7} : null
}

function getDefaultOptions() {
    return {
        'cameraOptions': {
            angle: 50,
            near: 0.000001,
            far: 5000,
            baseZoom: 1,
            cameraControls: {
                instance: CameraControls,
                props: {wireframeButtonEnabled: false},
            },
            reset: false,
            autorotate: false,
            wireframe: false,
        },
        'captureOptions': {
            captureControls: {
                instance: CaptureControls,
                props: {}
            },
            recorderOptions: {
                mediaRecorderOptions: {
                    mimeType: 'video/webm',
                },
                blobOptions: {
                    type: 'video/webm'
                }
            },
            screenshotOptions: {
                resolution: {
                    width: 3840,
                    height: 2160,
                },
                quality: 0.95,
                pixelRatio: 1,
                filter: () => true
            },
        }
    }
}

const styles = () => ({
    canvasContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
});

function mapToCanvasData(data : Set<string>[]) {
    return [...data].map(id => (
        {
            instancePath: id,
            // @ts-ignore
            color: MOCKED_GET_COLOR(id)
        }
    ))
}

class ExperimentViewer extends Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        const instancesIds = this.getInstancesToShow()
        this.state = {
            data: instancesIds,
        };
    }

    shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean {
        // @ts-ignore
        return this.props !== nextProps || !eqSet(this.state.data, nextState.data)
    }

    getInstancesToShow(){
        // @ts-ignore
        const {selectedAtlas, activeSubdivisions} = this.props
        const atlas = getAtlas(selectedAtlas)
        return getInstancesIds(atlas, activeSubdivisions)
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        const instancesIds = this.getInstancesToShow()
        this.setState({data: instancesIds})
    }


    render() {
        // @ts-ignore
        const {classes} = this.props
        // @ts-ignore
        const {data} = this.state
        const {cameraOptions, captureOptions} = getDefaultOptions()
        const canvasData: any = mapToCanvasData(data)
        return (<div className={classes.canvasContainer}>
            <Canvas
                data={canvasData}
                cameraOptions={cameraOptions}
                captureOptions={captureOptions}
                backgroundColor={canvasBg}
            />
        </div>)
    }
}

export default withStyles(styles)(ExperimentViewer);