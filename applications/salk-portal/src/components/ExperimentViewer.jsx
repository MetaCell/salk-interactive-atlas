import React, {Component} from 'react';
import * as THREE from 'three';
import {withStyles} from '@material-ui/core';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import {augmentInstancesArray} from '@metacell/geppetto-meta-core/Instances';
import { canvasBg } from "../theme";
import { getAtlas } from "../service/AtlasService"

const COLOR_MAP = {
    'ClosedCordOBJ': {r: 0.30, g: 0.54, b: 0.59, a: 0.5},
    'OpenCordOBJ': {r: 0.30, g: 0.54, b: 0.59, a: 0.5},
    'InsideCordOBJ': {r: 0.4525, g: 0.2624, b: 0.2852, a: 0.7},
}

function mapToCanvasData(data) {
    return data.map(item => (
        {
            instancePath: item.instancePath,
            color: item.instancePath in COLOR_MAP ? COLOR_MAP[item.instancePath] : null
        }
    ))
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


class ExperimentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    async componentDidMount() {
        const {experiment, selectedAtlas} = this.props
        const atlas = getAtlas(selectedAtlas)
        // get meshes and segments from public folder given atlas -> use service
        // create simpleInstances for each segment
    }

    render() {
        const {classes} = this.props
        const {data} = this.state
        const {cameraOptions, captureOptions} = getDefaultOptions()
        const canvasData = mapToCanvasData(data)
        return (<div className={classes.canvasContainer}>
            <Canvas
                data={canvasData}
                cameraOptions={cameraOptions}
                captureOptions={captureOptions}
                backgroundColor={canvasBg}
                onMount={this.onMount}
                updateEnded={this.updateEnded}
            />
        </div>)
    }
}

export default withStyles(styles)(ExperimentViewer);