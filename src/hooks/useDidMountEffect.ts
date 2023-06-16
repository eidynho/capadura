import { useEffect, useRef } from "react";

const useDidMountEffect = (execute: () => void, deps: any[]) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) {
            execute();
        } else {
            didMount.current = true;
        }
    }, deps);
};

export default useDidMountEffect;
