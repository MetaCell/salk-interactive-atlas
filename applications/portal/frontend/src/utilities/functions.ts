import {getAtlas} from "../service/AtlasService";
import {ARROW_KEY_LEFT, ARROW_KEY_RIGHT, AtlasChoice} from "./constants";
import Range from "../models/Range";


export const areAllSelected = (obj: {
    [x: string]: {
        selected: any
    }
}): boolean => {
    return Object.keys(obj).reduce((acc, pId) => obj[pId].selected && acc, true)
}

export const areSomeSelected = (obj: {
    [x: string]: {
        selected: any
    }
}): boolean => {
    for (const key of Object.keys(obj)) {
        if (obj[key].selected) {
            return true
        }
    }
    return false
}

export function eqSet(set1: Set<any>, set2: Set<any>): boolean {
    if (set1.size !== set2.size) return false;
    for (const x of set1) if (!set2.has(x)) return false;
    return true;
}

export function differenceSet(set1: Set<any>, set2: Set<any>): Set<any> {
    return new Set([...set1].filter(x => !set2.has(x)));
}

export const getAllowedRanges = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>): Range[] => {
    const ranges: Range[] = []
    const atlas = getAtlas(selectedAtlas)
    activeSubdivisions.forEach(subdivisionId => {
        const atlasSegment = atlas.segments.find(as => as.id === subdivisionId)
        ranges.push(atlasSegment.range)
    });
    return ranges
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function getRGBAFromHexAlpha(hex: string, opacity: number) {
    const rgb = hexToRgb(hex)
    return rgb ? {...rgb, a: opacity} : {r: 0, g: 0, b: 0, a: 1}
}

export function getRGBAString(rgba: { r: number; g: number; b: number; a: number; }) {
    return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
}

export function areEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

export function scrollStop(element: any, onEvent: (arg0: any) => void, callback: () => void, refresh = 300) {

    // Make sure a valid callback was provided
    if (!callback || typeof callback !== 'function') return;

    // Setup scrolling variable
    let isScrolling: any;

    // Listen for wheel events
    element.addEventListener('wheel', (event: any) => {
        onEvent(event)

        // Clear our timeout throughout the scroll
        clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => callback(), refresh);

    }, false);

}

export const onWheel = (event: { preventDefault: () => void; deltaY: number; }, currentRef: { current: number; }, len: number, callback: (arg0: number) => void) => {
    event.preventDefault()
    const direction = Math.sign(event.deltaY) * -1
    const nextCursor = mod(currentRef.current + direction, len)
    callback(nextCursor)
    currentRef.current = nextCursor
}

export const onKeyboard = (event: { keyCode: number; }, currentRef: { current: number; }, len: number, callback: (arg0: number) => void) => {
    const direction = event.keyCode === ARROW_KEY_RIGHT ? 1 : event.keyCode === ARROW_KEY_LEFT ? -1 : null
    if (!direction) {
        return
    }
    const nextCursor = mod(currentRef.current + direction, len)
    callback(nextCursor)
    currentRef.current = nextCursor
}

export function shadeHexColor(color: string, percent: number) {
    const f = parseInt(color.slice(1), 16)
    const t = percent < 0 ? 0 : 255
    const p = percent < 0 ? percent * -1 : percent
    // tslint:disable-next-line:no-bitwise
    const R = f >> 16
    // tslint:disable-next-line:no-bitwise
    const G = f >> 8 & 0x00FF
    // tslint:disable-next-line:no-bitwise
    const B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

export function capitalize(word: string) {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}

export function dictZip(keys: string[], values: any[]) {
    if (keys.length !== values.length) {
        return
    }
    return keys.reduce((o, currentValue, currentIndex) => ({...o, [currentValue]: values[currentIndex]}), {})
}