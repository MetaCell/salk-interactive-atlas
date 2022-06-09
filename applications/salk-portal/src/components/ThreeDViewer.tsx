import React, {Component} from 'react';
import * as THREE from 'three';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    withStyles
} from '@material-ui/core';
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
import {Population} from "../apiclient/workspaces";
import {AtlasChoice} from "../utilities/constants";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// @ts-ignore
import SWITCH_ICON from "../assets/images/icons/switch_icon.svg";

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
            initialFlip: ['y']
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
    container: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: canvasBg,
    },
    canvasContainer: {
        width: '100%',
        height: '100%',
    },
    accordionContainer: {
        width: '100%',
        position: "absolute",
        top: "16px",
        left: "calc(85% - 16px)",
        backgroundColor: canvasBg,
    },
    accordion: {
        width: '15%',
        backgroundColor: "rgba(255, 255, 255, 0.05)",
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

const getColorOpacityPair = (color: string, opacity: number) => {
    return `${color}-${opacity}`
}

const getSubdivisions = (sa: AtlasChoice) => {
    const subdivisions: any = {}
    const segments = getAtlas(sa).segments
    segments.forEach(sd => subdivisions[sd.id] = {selected: true})
    return subdivisions
}

const getActiveSubdivisionsSet = (subdivisions: any) => {
    return new Set(Object.keys(subdivisions).filter(sId => subdivisions[sId].selected));
}


class ThreeDViewer extends Component {
    private scene: THREE.Scene;
    private readonly populationsMap: {};

    // @ts-ignore
    constructor(props) {
        super(props);
        this.scene = null
        this.populationsMap = {}
        this.onMount = this.onMount.bind(this)
        this.onUpdateEnd = this.onUpdateEnd.bind(this)

        // @ts-ignore
        const {selectedAtlas} = this.props
        this.state = {
            subdivisions: getSubdivisions(selectedAtlas),
        }
    }

    getInstancesToShow() {
        // @ts-ignore
        const {selectedAtlas} = this.props
        // @ts-ignore
        const {subdivisions} = this.state
        const activeSubdivisions = getActiveSubdivisionsSet(subdivisions)
        const atlas = getAtlas(selectedAtlas)
        return getInstancesIds(atlas, activeSubdivisions)
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        this.updatePopulations(
            // @ts-ignore
            !eqSet(getActiveSubdivisionsSet(prevState.subdivisions), getActiveSubdivisionsSet(this.state.subdivisions))
            || !eqSet(
                // @ts-ignore
                new Set(Object.keys(prevProps.activePopulations)
                    .map(pId => getColorOpacityPair(
                        // @ts-ignore
                        prevProps.activePopulations[pId].color,
                        // @ts-ignore
                        prevProps.activePopulations[pId].opacity)
                    )),
                // @ts-ignore
                new Set(Object.keys(this.props.activePopulations)
                    .map(pId => getColorOpacityPair(
                        // @ts-ignore
                        this.props.activePopulations[pId].color,
                        // @ts-ignore
                        this.props.activePopulations[pId].opacity)
                    ))
            ))
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


    addPopulation(population: Population) {
        // @ts-ignore
        const {selectedAtlas, activeSubdivisions} = this.props
        const ranges = getAllowedRanges(selectedAtlas, activeSubdivisions)
        // @ts-ignore
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const material = new THREE.MeshBasicMaterial(
            {color: population.color, transparent: true, opacity: population.opacity}
        );
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
        const light = new THREE.AmbientLight(0x404040);
        scene.add(light);
    }

    onUpdateEnd() {
        // TODO: This is being called before the onMount
        if (this.scene) {
            if (this.scene.children.length > 3) {
                for (let i = 3; i < this.scene.children.length; i++) {
                    const object = this.scene.children[i]
                    // @ts-ignore
                    if (object.instancePath !== undefined) {
                        // @ts-ignore
                        object.children[0].material.side = THREE.DoubleSide;
                        object.renderOrder = 1
                        // @ts-ignore
                        object.children[0].material.needsUpdate = true;
                    }
                }
            }
        }
    }

    render() {
        // @ts-ignore
        const {classes} = this.props
        // @ts-ignore
        const {anchorEl} = this.state
        // tslint:disable-next-line:prefer-const
        let {cameraOptions, captureOptions} = getDefaultOptions()
        // @ts-ignore
        cameraOptions = {...cameraOptions, reset: this.props.shouldCameraReset}
        // @ts-ignore
        const canvasData: any = mapToCanvasData(this.getInstancesToShow())
        return (
            <Box className={classes.container}>
                <Box className={classes.accordionContainer}>
                    <Accordion elevation={0} className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>
                                <img src={SWITCH_ICON} alt=""/>
                                Subdivisions
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box className={classes.canvasContainer}>
                    <Canvas
                        data={canvasData}
                        cameraOptions={cameraOptions}
                        captureOptions={captureOptions}
                        backgroundColor={canvasBg}
                        onMount={this.onMount}
                        onUpdateEnd={this.onUpdateEnd}
                    />
                </Box>
            </Box>)
    }
}

export default withStyles(styles)(ThreeDViewer);