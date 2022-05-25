import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        // @ts-ignore
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}