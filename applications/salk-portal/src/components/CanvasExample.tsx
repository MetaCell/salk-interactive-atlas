// @ts-nocheck

import React, {Component} from 'react';
import * as THREE from 'three';
import {withStyles} from '@material-ui/core';
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import CaptureControls from "@metacell/geppetto-meta-ui/capture-controls/CaptureControls";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import {augmentInstancesArray} from '@metacell/geppetto-meta-core/Instances';
import Resources from '@metacell/geppetto-meta-core/Resources';
// import ocord from '../assets/atlas_meshes/simplified/open_cord_simp.obj'
import icord from '../assets/atlas_meshes/simplified/inside_cord_simp.obj'
import ccord from '../assets/atlas_meshes/simplified/closed_cord_simp.obj'
import cells from '../assets/atlas_meshes/transformed_cells.json'
import { canvasBg } from "../theme";

const COLOR_MAP = {
    'ClosedCordOBJ': {r: 0.30, g: 0.54, b: 0.59, a: 0.5},
    'OpenCordOBJ': {r: 0.30, g: 0.54, b: 0.59, a: 0.5},
    'InsideCordOBJ': {r: 0.4525, g: 0.2624, b: 0.2852, a: 0.7},
}

const YELLOW = 0xffff00

function mapToCanvasData(data) {
    return data.map(item => (
        {
            instancePath: item.instancePath,
            color: item.instancePath in COLOR_MAP ? COLOR_MAP[item.instancePath] : null
        }
    ))
}

const instance1spec = {
    "eClass": "SimpleInstance",
    "id": "ClosedCordOBJ",
    "name": "Closed Cord OBJ",
    "type": {"eClass": "SimpleType"},
    "visualValue": {
        "eClass": Resources.OBJ,
        'obj': ccord
    }
}

// const instance2spec = {
//     "eClass": "SimpleInstance",
//     "id": "OpenCordOBJ",
//     "name": "Open Cord OBJ",
//     "type": {"eClass": "SimpleType"},
//     "visualValue": {
//         "eClass": Resources.OBJ,
//         'obj': ocord
//     }
// }

const instance3spec = {
    "eClass": "SimpleInstance",
    "id": "InsideCordOBJ",
    "name": "Inside Cord OBJ",
    "type": {"eClass": "SimpleType"},
    "visualValue": {
        "eClass": Resources.OBJ,
        'obj': icord,
    }
}

function loadInstances() {
    const instance1 = new SimpleInstance(instance1spec)
    // const instance2 = new SimpleInstance(instance2spec)
    const instance3 = new SimpleInstance(instance3spec)
    window.Instances = [instance1, instance3]
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


class CanvasExample extends Component {
    constructor(props) {
        super(props);
        loadInstances()
        this.state = {
            data: getProxyInstances(),
        };
        this.onMount = this.onMount.bind(this);
        this.updateEnded = this.updateEnded.bind(this);
    }
    updateEnded(){
        this.scene.children[4].children[0].material.side = THREE.DoubleSide;
        this.scene.children[4].children[0].material.needsUpdate = true;
        this.scene.children[4].children[0].renderOrder = 1;
        this.scene.children[5].children[0].material.side = THREE.DoubleSide;
        this.scene.children[5].children[0].material.needsUpdate = true;
    }

    onMount(scene) {
        this.scene = scene;
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const material = new THREE.MeshBasicMaterial({color: YELLOW, transparent: true, opacity: 0.5});
        const mesh = new THREE.InstancedMesh(geometry, material, cells.length);
        mesh.frustumCulled = false
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            position.set(
                cell.x,
                cell.y,
                cell.z
            )

            dummy.position.copy(position)
            dummy.updateMatrix()

            mesh.setMatrixAt(i, dummy.matrix);
        }
        scene.add(mesh);
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

export default withStyles(styles)(CanvasExample);