import {useEffect, useRef} from "react";

export function useDidUpdateEffect(fn: () => any, inputs: any) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) {
            return fn();
        }
        didMountRef.current = true;
    }, inputs);
}