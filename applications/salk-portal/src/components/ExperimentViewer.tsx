import React, {Component} from 'react';
import * as THREE from 'three';
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
import {eqSet, getAllowedRanges} from "../utilities/functions";
import {ExperimentPopulations} from "../apiclient/workspaces";
import {Scene} from "three";

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

function mapToCanvasData(data: Set<string>[]) {
    return [...data].map(id => (
        {
            instancePath: id,
            // @ts-ignore
            color: MOCKED_GET_COLOR(id)
        }
    ))
}

class ExperimentViewer extends Component {
    private scene: Scene;
    private readonly populationsMap: {};

    // @ts-ignore
    constructor(props) {
        super(props);
        const instancesIds = this.getInstancesToShow()
        this.scene = null
        this.populationsMap = {}
        this.onMount = this.onMount.bind(this)
    }

    getInstancesToShow() {
        // @ts-ignore
        const {selectedAtlas, activeSubdivisions} = this.props
        const atlas = getAtlas(selectedAtlas)
        return getInstancesIds(atlas, activeSubdivisions)
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        // @ts-ignore
        this.updatePopulations(!eqSet(prevProps.activeSubdivisions, this.props.activeSubdivisions))
    }

    updatePopulations(performCleanUpdate = false) {
        // @ts-ignore
        const {activePopulations} = this.props
        const activePopulationsIds = Object.keys(activePopulations)
        // @ts-ignore
        const currentActivePopulations = Object.keys(this.populationsMap).filter(pId => this.populationsMap[pId].active)

        let populationsToRemove = null
        let populationsToAdd = null

        if (performCleanUpdate) {
            populationsToRemove = currentActivePopulations
            populationsToAdd = activePopulationsIds
        } else {
            populationsToRemove = currentActivePopulations
                // @ts-ignore
                .filter(x => !activePopulationsIds.includes(x));
            populationsToAdd = activePopulationsIds.filter(x => !currentActivePopulations.includes(x));
        }
        for (const ptr of populationsToRemove) {
            this.removePopulation(ptr)
        }
        // @ts-ignore

        for (const pta of populationsToAdd) {
            this.addPopulation(activePopulations[pta])
        }
    }

    removePopulation(populationId: string) {
        // @ts-ignore
        this.populationsMap[populationId].active = false
        // @ts-ignore
        const object = this.scene.getObjectByProperty('uuid', this.populationsMap[populationId].uuid)
        if (this.scene) {
            // @ts-ignore
            this.scene.remove(object)
        }
    }


    addPopulation(population: ExperimentPopulations) {
        // @ts-ignore
        const {selectedAtlas, activeSubdivisions} = this.props
        const ranges = getAllowedRanges(selectedAtlas, activeSubdivisions)
        // @ts-ignore
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const material = new THREE.MeshBasicMaterial({color: population.color, transparent: true, opacity: 0.5});
        const mesh = new THREE.InstancedMesh(geometry, material, population.cells.length);
        mesh.frustumCulled = false
        for (let i = 0; i < population.cells.length; i++) {

            const cell = population.cells[i]
            if (ranges.some((r) => r.includes(cell.x))) {
                position.set(
                    cell.x,
                    cell.y,
                    cell.z
                )

                dummy.position.copy(position)
                dummy.updateMatrix()
                mesh.setMatrixAt(i, dummy.matrix);
            }
        }
        if (this.scene) {
            // @ts-ignore
            this.populationsMap[population.id.toString(10)] = {uuid: mesh.uuid, active: true}
            // @ts-ignore
            this.scene.add(mesh);
        }
    }

    onMount(scene: any) {
        this.scene = scene;
    }


    render() {
        // @ts-ignore
        const {classes} = this.props
        const {cameraOptions, captureOptions} = getDefaultOptions()
        // @ts-ignore
        const canvasData: any = mapToCanvasData(this.getInstancesToShow())
        return (<div className={classes.canvasContainer}>
            <Canvas
                data={canvasData}
                cameraOptions={cameraOptions}
                captureOptions={captureOptions}
                backgroundColor={canvasBg}
                onMount={this.onMount}
            />
        </div>)
    }
}

export default withStyles(styles)(ExperimentViewer);