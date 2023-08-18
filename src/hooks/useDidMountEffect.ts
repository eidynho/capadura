import { useEffect, useRef } from "react";

export const useDidMountEffect = (execute: () => void, deps: any[]) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) {
            execute();
        } else {
            didMount.current = true;
        }
    }, deps);
};
