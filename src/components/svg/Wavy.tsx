interface WavyProps {
    firstColor?: string;
    secondaryColor?: string;
}

export function Wavy({ firstColor = "#84cc16", secondaryColor = "#365314" }: WavyProps) {
    return (
        <svg version="1.1" viewBox="0 0 1422 800">
            <defs>
                <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="oooscillate-grad">
                    <stop stop-color={firstColor} stop-opacity="1" offset="0%"></stop>
                    <stop stop-color={secondaryColor} stop-opacity="1" offset="100%"></stop>
                </linearGradient>
            </defs>
            <g
                stroke-width="2.5"
                stroke="url(#oooscillate-grad)"
                fill="none"
                stroke-linecap="round"
            >
                <path
                    d="M 0 323 Q 355.5 -100 711 400 Q 1066.5 900 1422 323"
                    stroke-dasharray="4 1"
                    opacity="0.28"
                ></path>
                <path
                    d="M 0 304 Q 355.5 -100 711 400 Q 1066.5 900 1422 304"
                    stroke-dasharray="3 1"
                    opacity="0.32"
                ></path>
                <path
                    d="M 0 285 Q 355.5 -100 711 400 Q 1066.5 900 1422 285"
                    stroke-dasharray="3 2"
                    opacity="0.36"
                ></path>
                <path
                    d="M 0 266 Q 355.5 -100 711 400 Q 1066.5 900 1422 266"
                    stroke-dasharray="3 0"
                    opacity="0.40"
                ></path>
                <path
                    d="M 0 247 Q 355.5 -100 711 400 Q 1066.5 900 1422 247"
                    stroke-dasharray="1 3"
                    opacity="0.44"
                ></path>
                <path
                    d="M 0 228 Q 355.5 -100 711 400 Q 1066.5 900 1422 228"
                    stroke-dasharray="2 0"
                    opacity="0.48"
                ></path>
                <path
                    d="M 0 209 Q 355.5 -100 711 400 Q 1066.5 900 1422 209"
                    stroke-dasharray="3 1"
                    opacity="0.52"
                ></path>
                <path
                    d="M 0 190 Q 355.5 -100 711 400 Q 1066.5 900 1422 190"
                    stroke-dasharray="3 2"
                    opacity="0.56"
                ></path>
                <path
                    d="M 0 171 Q 355.5 -100 711 400 Q 1066.5 900 1422 171"
                    stroke-dasharray="1 1"
                    opacity="0.60"
                ></path>
                <path
                    d="M 0 133 Q 355.5 -100 711 400 Q 1066.5 900 1422 133"
                    stroke-dasharray="1 2"
                    opacity="0.80"
                ></path>

                <path
                    d="M 0 57 Q 355.5 -100 711 400 Q 1066.5 900 1422 57"
                    stroke-dasharray="1 0"
                    opacity="0.88"
                ></path>
                <path
                    d="M 0 38 Q 355.5 -100 711 400 Q 1066.5 900 1422 38"
                    stroke-dasharray="0 3"
                    opacity="0.96"
                ></path>
            </g>
        </svg>
    );
}
