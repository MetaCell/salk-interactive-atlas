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

export const CONTOUR_PLOT_ID = 'contourPlot'
export const NEURONAL_LOCATIONS_ID = 'neuronalLocations'

export const OVERLAYS = {
    [CONTOUR_PLOT_ID]: new OverlayMetadata(CONTOUR_PLOT_ID, "Contour Plot"),
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
    CONTOUR_DATA = "contourData",
    CENTROIDS_DATA = "centroidsData"
}

export const PULL_TIME_MS = 30 * 1000
export const POPULATION_FINISHED_STATE = "finished"
export const MAX_STR_LENGTH_SIDEBAR = 15

export enum DensityImages {
    GREY_AND_WHITE_MATTER = "background",
    CANAL = "canal",
    GRID = "grid",
}

export const ARROW_KEY_RIGHT = 39
export const ARROW_KEY_LEFT = 37

export enum LaminaImageTypes {
    FILLED = "filled",
    CONTOUR = "contour",
    DASHED = "dashed",
}

export const GridTypes = {
    OFF : {value: "Grid Off", folder: ''},
    FRAME : {value: "Grid Frame", folder: 'frame'},
    COMPLETE : {value: "Complete Grid", folder: 'complete'},
}

export enum Details {
    ELECTROPHYSIOLOGY = 'Electrophysiology',
    BEHAVIOUR = 'Behaviour',
    IO = 'IO',
}

export const POPULATION_V1 = "V1"
export const POPULATION_V2A = "V2a"
export const alphanumericCollator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
export const COMING_SOON = "(coming soon)"

export const HEADER_TITLE = "Salk Mouse Cord Atlas";
export const EXPERIMENTS_ROUTE = '/experiments/:id'

export const SNACKBAR_TIMEOUT = 5000
export const POPULATION_ICONS_OPACITY = 0.4
