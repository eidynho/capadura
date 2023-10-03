interface SpiralWavyProps {
    firstColor?: string;
    secondColor?: string;
    palette?: string[];
}

export function SpiralWavy({
    firstColor = "#eab308",
    secondColor = "#854d0e",
    palette,
}: SpiralWavyProps) {
    return (
        <svg version="1.1" viewBox="0 0 800 800">
            <defs>
                <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="cccoil-grad">
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
                            <stop stopColor={secondColor} stopOpacity="1" offset="100%"></stop>
                        </>
                    )}
                </linearGradient>
            </defs>
            <g stroke="url(#cccoil-grad)" fill="none" strokeLinecap="round">
                <circle
                    r="403"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="0 2532"
                    opacity="0.05"
                ></circle>
                <circle
                    r="387.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="97 2435"
                    transform="rotate(14, 400, 400)"
                    opacity="0.09"
                ></circle>
                <circle
                    r="372"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="187 2337"
                    transform="rotate(29, 400, 400)"
                    opacity="0.13"
                ></circle>
                <circle
                    r="356.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="269 2240"
                    transform="rotate(43, 400, 400)"
                    opacity="0.16"
                ></circle>
                <circle
                    r="341"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="343 2143"
                    transform="rotate(58, 400, 400)"
                    opacity="0.20"
                ></circle>
                <circle
                    r="325.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="409 2045"
                    transform="rotate(72, 400, 400)"
                    opacity="0.24"
                ></circle>
                <circle
                    r="310"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="467 1948"
                    transform="rotate(86, 400, 400)"
                    opacity="0.28"
                ></circle>
                <circle
                    r="294.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="518 1850"
                    transform="rotate(101, 400, 400)"
                    opacity="0.32"
                ></circle>
                <circle
                    r="279"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="561 1753"
                    transform="rotate(115, 400, 400)"
                    opacity="0.35"
                ></circle>
                <circle
                    r="263.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="596 1656"
                    transform="rotate(130, 400, 400)"
                    opacity="0.39"
                ></circle>
                <circle
                    r="248"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="623 1558"
                    transform="rotate(144, 400, 400)"
                    opacity="0.43"
                ></circle>
                <circle
                    r="232.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="643 1461"
                    transform="rotate(158, 400, 400)"
                    opacity="0.47"
                ></circle>
                <circle
                    r="217"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="654 1363"
                    transform="rotate(173, 400, 400)"
                    opacity="0.51"
                ></circle>
                <circle
                    r="201.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="658 1266"
                    transform="rotate(187, 400, 400)"
                    opacity="0.54"
                ></circle>
                <circle
                    r="186"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="654 1169"
                    transform="rotate(202, 400, 400)"
                    opacity="0.58"
                ></circle>
                <circle
                    r="170.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="643 1071"
                    transform="rotate(216, 400, 400)"
                    opacity="0.62"
                ></circle>
                <circle
                    r="155"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="623 974"
                    transform="rotate(230, 400, 400)"
                    opacity="0.66"
                ></circle>
                <circle
                    r="139.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="596 877"
                    transform="rotate(245, 400, 400)"
                    opacity="0.70"
                ></circle>
                <circle
                    r="124"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="561 779"
                    transform="rotate(259, 400, 400)"
                    opacity="0.73"
                ></circle>
                <circle
                    r="108.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="518 682"
                    transform="rotate(274, 400, 400)"
                    opacity="0.77"
                ></circle>
                <circle
                    r="93"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="467 584"
                    transform="rotate(288, 400, 400)"
                    opacity="0.81"
                ></circle>
                <circle
                    r="77.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="409 487"
                    transform="rotate(302, 400, 400)"
                    opacity="0.85"
                ></circle>
                <circle
                    r="62"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="343 390"
                    transform="rotate(317, 400, 400)"
                    opacity="0.89"
                ></circle>
                <circle
                    r="46.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="269 292"
                    transform="rotate(331, 400, 400)"
                    opacity="0.92"
                ></circle>
                <circle
                    r="31"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="187 195"
                    transform="rotate(346, 400, 400)"
                    opacity="0.96"
                ></circle>
                <circle
                    r="15.5"
                    cx="400"
                    cy="400"
                    strokeWidth="2.5"
                    strokeDasharray="97 97"
                    transform="rotate(360, 400, 400)"
                    opacity="1.00"
                ></circle>
            </g>
        </svg>
    );
}
