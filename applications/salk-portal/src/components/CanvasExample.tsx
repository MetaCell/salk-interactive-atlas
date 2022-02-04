// @ts-nocheck

import React, {Component} from 'react';
import * as THREE from 'three';
import {withStyles} from '@material-ui/core';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import {augmentInstancesArray} from '@metacell/geppetto-meta-core/Instances';
import Resources from '@metacell/geppetto-meta-core/Resources';
import ocord from '../assets/atlas_meshes/simplified/open_cord_simp.obj'
import icord from '../assets/atlas_meshes/simplified/inside_cord_simp.obj'
import DummyCameraControls from "./dummy/DummyCameraControls";
import DummyCaptureControls from "./dummy/DummyCaptureControls";

const COLOR_MAP = {
    'OpenCordOBJ': {r: 0.25, g: 0.06, b: 0.25, a: 0.5},
    'InsideCordOBJ': {r: 0.25, g: 0.06, b: 0.25, a: 0.5},
}

const YELLOW = 0xffff00
const GREEN = 0x00FF00
const BLUE = 0x0000FF

const SPHERE_COLORS = [YELLOW, GREEN, BLUE]
const SPHERES_COUNT = 1000


function mapToCanvasData(data) {
    return data.map(item => (
        {
            instancePath: item.instancePath,
            color: item.instancePath in COLOR_MAP ? COLOR_MAP[item.instancePath] : null
        }
    ))
}


const instance2spec = {
    "eClass": "SimpleInstance",
    "id": "OpenCordOBJ",
    "name": "Open Cord OBJ",
    "type": {"eClass": "SimpleType"},
    "visualValue": {
        "eClass": Resources.OBJ,
        'obj': ocord
    }
}

const instance3spec = {
    "eClass": "SimpleInstance",
    "id": "InsideCordOBJ",
    "name": "Inside Cord OBJ",
    "type": {"eClass": "SimpleType"},
    "visualValue": {
        "eClass": Resources.OBJ,
        'obj': icord
    }
}

function loadInstances() {
    const instance2 = new SimpleInstance(instance2spec)
    const instance3 = new SimpleInstance(instance3spec)
    window.Instances = [instance2, instance3]
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
            near: 0.000001,
            far: 5000,
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
        for (const color of SPHERE_COLORS) {
            const geometry = new THREE.SphereGeometry(1, 32, 16);
            const dummy = new THREE.Object3D();
            const position = new THREE.Vector3();
            const material = new THREE.MeshBasicMaterial({color});
            const amount = 10
            const mesh = new THREE.InstancedMesh(geometry, material, Math.pow(amount, 3));
            mesh.frustumCulled = false
            for (let i = 0; i < mesh.count; i++) {
                position.set(
                    Math.random() * 800,
                    50 + Math.random() * 40,
                    80 + Math.random() * 60
                )

                dummy.position.copy(position)
                dummy.updateMatrix()

                mesh.setMatrixAt(i, dummy.matrix);
            }
            scene.add(mesh);

        }
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
                backgroundColor={0x000000}
                onSelection={this.onSelection}
                onMount={this.onMount}
                hoverListeners={[this.hoverHandler]}
            />
        </div>)
    }
}

export default withStyles(styles)(CanvasExample);