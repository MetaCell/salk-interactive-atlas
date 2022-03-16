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
import {eqSet} from "../utilities/functions";
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
    private scene: Scene;
    private readonly populationsMap: {};

    // @ts-ignore
    constructor(props) {
        super(props);
        const instancesIds = this.getInstancesToShow()
        this.scene = null
        this.populationsMap = {}
        this.state = {
            data: instancesIds,
        };
        this.onMount = this.onMount.bind(this)
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

    updatePopulations(){
        // @ts-ignore
        const {activePopulations} = this.props
        const activePopulationsIds = Object.keys(activePopulations)
        // @ts-ignore
        const currentActivePopulations = Object.keys(this.populationsMap).filter(pId => this.populationsMap[pId].active)
        const populationsToRemove = currentActivePopulations
            // @ts-ignore
            .filter(x => !activePopulationsIds.includes(x));
        for (const ptr of populationsToRemove){
            this.removePopulation(ptr)
        }
        // @ts-ignore
        const populationsToAdd = activePopulationsIds.filter(x => !currentActivePopulations.includes(x));
        for (const pta of populationsToAdd){
            this.addPopulation(activePopulations[pta])
        }
    }

    removePopulation(populationId : string){
        // @ts-ignore
        this.populationsMap[populationId].active = false
        if (this.scene){
            // @ts-ignore
            this.scene.remove(this.populationsMap[populationId].mesh)
        }
    }

    addPopulation(population : ExperimentPopulations){
        let mesh = null
        // @ts-ignore
        // Fixme: Can't cache mesh if populations can be updated
        if (Object.keys(this.populationsMap).includes(population.id.toString(10))){
            // @ts-ignore
            mesh = this.populationsMap[population.id].mesh
        }else{
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const material = new THREE.MeshBasicMaterial({color: population.color, transparent: true, opacity: 0.5});
        mesh = new THREE.InstancedMesh(geometry, material, population.cells.length);
        mesh.frustumCulled = false
        for (let i = 0; i < population.cells.length; i++) {
            const cell = population.cells[i]
            position.set(
                cell.x,
                cell.y,
                cell.z
            )

            dummy.position.copy(position)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix);
        }}
        if (this.scene){
            // @ts-ignore
            this.populationsMap[population.id.toString(10)] = {mesh, active: true}
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
        // @ts-ignore
        const {data} = this.state
        const {cameraOptions, captureOptions} = getDefaultOptions()
        const canvasData: any = mapToCanvasData(data)
        this.updatePopulations()
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