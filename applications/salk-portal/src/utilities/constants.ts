import Atlas from "../models/Atlas";
import OverlayMetadata from "../models/OverlayMetadata";

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

export const OVERLAYS = {
    densityMap: new OverlayMetadata("densityMap", "Density Map"),
    neuronalLocations:  new OverlayMetadata("neuronalLocations", "Neuronal Locations"),
}

export enum REQUEST_STATE {
    NO_CONTENT ,
    SUCCESS,
    ERROR
}