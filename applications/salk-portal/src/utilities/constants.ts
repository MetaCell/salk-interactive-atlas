import Atlas from "../models/Atlas";
import OverlayMetadata from "../models/OverlayMetadata";
import {widgetIds} from "../widgets";

export enum AtlasChoice {
    slk10 = "salk_cord_10um",
    aln20 = "allen_cord_20um",
}

const SLK10 = new Atlas(AtlasChoice.slk10, "Salk Cord 10um")

export const atlasMap = new Map<AtlasChoice, Atlas>([
        [AtlasChoice.slk10, SLK10],
    ]
)

export const EXPERIMENTS_HASH = 'experiments';
export const SHARED_HASH = 'shared';
export const ACME_TEAM = 'acmeteam';
export const SALK_TEAM = 'salkteam';
export const COMMUNITY_HASH = 'community';

export const PROBABILITY_MAP_ID = 'probabilityMap'
export const NEURONAL_LOCATIONS_ID = 'neuronalLocations'

export const OVERLAYS = {
    [PROBABILITY_MAP_ID]: new OverlayMetadata(PROBABILITY_MAP_ID, "Probability Map"),
    [NEURONAL_LOCATIONS_ID]:  new OverlayMetadata(NEURONAL_LOCATIONS_ID, "Neuronal Locations"),
} as any

export enum RequestState {
    NO_CONTENT ,
    SUCCESS,
    ERROR
}

export const ROSTRAL = "Rostral"
export const CAUDAL = "Caudal"

export enum DensityMapTypes {
    PROBABILITY_DATA = "probabilityData",
    CENTROIDS_DATA = "centroidsData"
}

export const PULL_TIME_MS = 30 * 1000
export const POPULATION_FINISHED_STATE = "finished"
export const MAX_STR_LENGTH_SIDEBAR = 15

export const ARROW_KEY_RIGHT = 39
export const ARROW_KEY_LEFT = 37