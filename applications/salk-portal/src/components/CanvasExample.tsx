// @ts-nocheck

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import {augmentInstancesArray} from '@metacell/geppetto-meta-core/Instances';
import Resources from '@metacell/geppetto-meta-core/Resources';
import obj from '../assets/neuron.obj';
import DummyCameraControls from "./dummy/DummyCameraControls";
import DummyCaptureControls from "./dummy/DummyCaptureControls";


function mapToCanvasData(data) {
    return data.map(item => (
        {
            color: item.color,
            instancePath: item.instancePath
        }
    ))
}

const instance1spec = {
    "eClass": "SimpleInstance",
    "id": "ExampleOBJ",
    "name": "Example OBJ name",
    "type": {"eClass": "SimpleType"},
    "visualValue": {
        "eClass": Resources.OBJ,
        'obj': obj
    }
}

function loadInstances() {
    const instance1 = new SimpleInstance(instance1spec)
    window.Instances = [instance1]
    augmentInstancesArray(window.Instances);
}

function getProxyInstances() {
    return window.Instances.map(i => (
        {instancePath: i.getId(), }))
}

function getDefaultOptions() {
    return {
        'cameraOptions': {
            angle: 50,
            near: 0.01,
            far: 1000,
            baseZoom: 1,
            cameraControls: {
                instance: DummyCameraControls,
                props: {wireframeButtonEnabled: false},
            },
            reset: false,
            autorotate: false,
            wireframe: false,
        },
        'captureOptions': {
            captureControls: {
                instance: DummyCaptureControls,
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
    },
});


class CanvasExample extends Component {
    constructor(props) {
        super(props);
        loadInstances()
        this.state = {
            data: getProxyInstances(),
        };
        this.hoverHandler = this.hoverHandler.bind(this);
        this.onSelection = this.onSelection.bind(this)
        this.onMount = this.onMount.bind(this);
    }


    // tslint:disable-next-line:no-empty
    hoverHandler(objs, canvasX, canvasY) {
    }

    // tslint:disable-next-line:no-empty
    onMount(scene) {
    }

    // tslint:disable-next-line:no-empty
    onSelection(selectedInstances) {
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
                backgroundColor={0x505050}
                onSelection={this.onSelection}
                onMount={this.onMount}
                hoverListeners={[this.hoverHandler]}
            />
        </div>)
    }
}

export default withStyles(styles)(CanvasExample);