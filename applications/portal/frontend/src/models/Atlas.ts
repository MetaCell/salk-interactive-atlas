import AtlasInstance from "./AtlasInstance"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice, DensityImages, LaminaImageTypes} from "../utilities/constants";
import AtlasLamina from "./AtlasLamina";
import {shadeHexColor} from "../utilities/functions";
import Dimensions from "./Dimensions";

export const DARK_GREY_SHADE = "#232323"

export default class Atlas {
    instances: AtlasInstance[];
    segments: AtlasSegment[]
    laminas: AtlasLamina[]
    name: string
    id: AtlasChoice;
    gridDimensions: Dimensions

    constructor(atlasId: AtlasChoice, name: string) {
        this.name = name
        this.id = atlasId
        this.constructInstances()
        this.constructSegments()
        this.constructLaminas()
        this.gridDimensions = this._geGridDimensions()
    }

    constructInstances() {
        this.instances = []
        const objsContext = require.context("../assets/atlas", true, /^.*\.obj$/)
        for (const filepath of objsContext.keys()) {
            if (filepath.includes(this.id)) {
                const filename = filepath.replace(/^.*[\\\/]/, '')
                this.instances.push(new AtlasInstance(filename, this.id))
            }
        }
    }

    constructSegments() {
        this.segments = []
        const json = require("../assets/atlas/" + this.id + '/atlas_segments.json')
        for (const entry of json) {
            this.segments.push(new AtlasSegment(entry))
        }
    }

    constructLaminas() {
        this.laminas = []
        const json = require("../assets/atlas/" + this.id + '/laminas/atlas_laminas.json')
        for (const key of Object.keys(json)) {
            this.laminas.push(new AtlasLamina(key, json[key]))
        }
        this.laminas.sort((a, b) => a.minY - b.minY);
        getLaminaShades(this.laminas.length).forEach((shade, idx) => this.laminas[idx].setDefaultShade(shade))
    }

    getImageSrc(imageType: DensityImages, segment: string) {
        try {
            return require("../assets/atlas/" + this.id + '/' + imageType + '/' + segment + ".png").default
        } catch (e) {
            return null
        }
    }

    getLaminaSrc(laminaName: string, segment: string, type: LaminaImageTypes) {
        try {
            return require("../assets/atlas/" + this.id + '/laminas/' + laminaName + '/' + type + '/' + segment + ".png").default
        } catch (e) {
            return null
        }
    }

    _geGridDimensions(): Dimensions{
        const gridMetadata = require("../assets/atlas/" + this.id + '/grid/metadata.json')
        return new Dimensions(gridMetadata.width, gridMetadata.height)
    }
}

export function getLaminaShades(laminasLength: number, baseColor = DARK_GREY_SHADE) : string[] {
    const lighterShadeStep = 1 / (laminasLength + 1) // +1 bc WM color follows the same grey pattern
    let currentShade = 0
    const shades = []
    for (let i = 0; i < laminasLength; i++) {
        shades.push(shadeHexColor(baseColor, currentShade))
        currentShade += lighterShadeStep
    }
    return shades
}
