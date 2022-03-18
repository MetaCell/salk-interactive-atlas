// @ts-ignore
import SimpleInstance from '@metacell/geppetto-meta-core/model/SimpleInstance';
import Atlas from "../models/Atlas";

const defaultDepthFilter = (atlasInstanceDepth: number) => {
    return atlasInstanceDepth === 1
}

export const getInstancesIds = (atlas: Atlas,  activeSubdivisions: Set<string>, depthFilter= defaultDepthFilter) => {
    return new Set(atlas.instances.filter((atlasInstance) => activeSubdivisions.has(atlasInstance.segment)
        && depthFilter(atlasInstance.depth)).map(atlasInstance => atlasInstance.id))
}

export const createSimpleInstance = (id: string, name: string, obj: string) => {
    const newInstance = new SimpleInstance({
        eClass: 'SimpleInstance',
        id,
        name,
        type: { eClass: 'SimpleType' },
        visualValue: {
            // @ts-ignore
            eClass: window.GEPPETTO.Resources.OBJ,
            obj,
        }
    });
    // @ts-ignore
    window.Instances.push(newInstance)
    // @ts-ignore
    window.GEPPETTO.Manager.augmentInstancesArray(window.Instances);
};