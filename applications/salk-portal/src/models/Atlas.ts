import AtlasInstance from "./AtlasInstance"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice, DensityImages, LaminaImageTypes} from "../utilities/constants";
import AtlasLamina from "./AtlasLamina";
import {shadeHexColor} from "../utilities/functions";

const DARK_GREY_SHADE = "#212425"

export default class Atlas {
    instances: AtlasInstance[];
    segments: AtlasSegment[]
    laminas: AtlasLamina[]
    name: string
    id: AtlasChoice;

    constructor(atlasId: AtlasChoice, name: string) {
        this.name = name
        this.id = atlasId
        this.constructInstances()
        this.constructSegments()
        this.constructLaminas()
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
        const json = require("../assets/atlas/" + this.id + '/atlas_laminas.json')
        for (const key of Object.keys(json)) {
            this.laminas.push(new AtlasLamina(key, json[key]))
        }
        this.laminas.sort((a, b) => a.minY - b.minY);
        const lighterShadeStep = 1 / this.laminas.length
        let currentShade = 0
        for (const lamina of this.laminas) {
            lamina.setDefaultShade(shadeHexColor(DARK_GREY_SHADE, currentShade))
            currentShade += lighterShadeStep
        }
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
}
