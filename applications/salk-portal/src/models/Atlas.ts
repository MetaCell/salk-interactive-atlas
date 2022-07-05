import AtlasInstance from "./AtlasInstance"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice, DensityImages} from "../utilities/constants";
import AtlasLamina from "./AtlasLamina";



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

    constructInstances(){
        this.instances = []
        const objsContext = require.context("../assets/atlas", true, /^.*\.obj$/)
        for (const filepath of objsContext.keys()){
            if (filepath.includes(this.id)){
                const filename = filepath.replace(/^.*[\\\/]/, '')
                this.instances.push(new AtlasInstance(filename, this.id))
            }
        }
    }

    constructSegments(){
        this.segments = []
        const json = require("../assets/atlas/" + this.id + '/atlas_segments.json')
        for (const entry of json){
            this.segments.push(new AtlasSegment(entry))
        }
    }

    constructLaminas(){
        this.laminas = []
        const json = require("../assets/atlas/" + this.id + '/atlas_laminas.json')
        for (const key of Object.keys(json)){
            this.laminas.push(new AtlasLamina(key, json[key]))
        }
    }

    getImageSrc(imageType: DensityImages, segment: string){
        try{
            return require("../assets/atlas/" + this.id + '/' + imageType + '/' + segment + ".png").default
        }catch (e){
            return null
        }
    }

    getLaminaSrc(laminaName: string, segment: string){
        try{
            return require("../assets/atlas/" + this.id + '/laminas/' + laminaName + '/' + segment + ".png").default
        }catch (e){
            return null
        }
    }
}
