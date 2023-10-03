interface WavyProps {
    firstColor?: string;
    secondaryColor?: string;
    palette?: string[];
}

export function Wavy({ firstColor = "#eab308", secondaryColor = "#854d0e", palette }: WavyProps) {
    return (
        <svg version="1.1" viewBox="0 0 1422 800">
            <defs>
                <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="oooscillate-grad">
                    {!!palette ? (
                        palette.map((color, index) => {
                            const offset = `${index * 6.66}%`;
                            return (
                                <stop
                                    key={`${color}-${index}`}
                                    stopColor={color}
                                    stopOpacity="1"
                                    offset={offset}
                                ></stop>
                            );
                        })
                    ) : (
                        <>
                            <stop stopColor={firstColor} stopOpacity="1" offset="0%"></stop>
                            <stop stopColor={secondaryColor} stopOpacity="1" offset="100%"></stop>
                        </>
                    )}
                </linearGradient>
            </defs>
            <g strokeWidth="2.5" stroke="url(#oooscillate-grad)" fill="none" strokeLinecap="round">
                <path
                    d="M 0 323 Q 355.5 -100 711 400 Q 1066.5 900 1422 323"
                    strokeDasharray="4 1"
                    opacity="0.28"
                ></path>
                <path
                    d="M 0 304 Q 355.5 -100 711 400 Q 1066.5 900 1422 304"
                    strokeDasharray="3 1"
                    opacity="0.32"
                ></path>
                <path
                    d="M 0 285 Q 355.5 -100 711 400 Q 1066.5 900 1422 285"
                    strokeDasharray="3 2"
                    opacity="0.36"
                ></path>
                <path
                    d="M 0 266 Q 355.5 -100 711 400 Q 1066.5 900 1422 266"
                    strokeDasharray="3 0"
                    opacity="0.40"
                ></path>
                <path
                    d="M 0 247 Q 355.5 -100 711 400 Q 1066.5 900 1422 247"
                    strokeDasharray="1 3"
                    opacity="0.44"
                ></path>
                <path
                    d="M 0 228 Q 355.5 -100 711 400 Q 1066.5 900 1422 228"
                    strokeDasharray="2 0"
                    opacity="0.48"
                ></path>
                <path
                    d="M 0 209 Q 355.5 -100 711 400 Q 1066.5 900 1422 209"
                    strokeDasharray="3 1"
                    opacity="0.52"
                ></path>
                <path
                    d="M 0 190 Q 355.5 -100 711 400 Q 1066.5 900 1422 190"
                    strokeDasharray="3 2"
                    opacity="0.56"
                ></path>
                <path
                    d="M 0 171 Q 355.5 -100 711 400 Q 1066.5 900 1422 171"
                    strokeDasharray="1 1"
                    opacity="0.60"
                ></path>
                <path
                    d="M 0 133 Q 355.5 -100 711 400 Q 1066.5 900 1422 133"
                    strokeDasharray="1 2"
                    opacity="0.80"
                ></path>

                <path
                    d="M 0 57 Q 355.5 -100 711 400 Q 1066.5 900 1422 57"
                    strokeDasharray="1 0"
                    opacity="0.88"
                ></path>
                <path
                    d="M 0 38 Q 355.5 -100 711 400 Q 1066.5 900 1422 38"
                    strokeDasharray="0 3"
                    opacity="0.96"
                ></path>
            </g>
        </svg>
    );
}
