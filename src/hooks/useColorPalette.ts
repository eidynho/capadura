"use client";

import { useEffect, useState } from "react";

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Using relative luminance we order the brightness of the colors
 * the fixed values and further explanation about this topic
 * can be found here -> https://en.wikipedia.org/wiki/Luma_(video)
 * and https://en.wikipedia.org/wiki/Relative_luminance
 */
const orderByLuminance = (rgbValues: RGBColor[]) => {
    const calculateLuminance = (p: RGBColor) => {
        return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    };

    return rgbValues.sort((p1, p2) => {
        return calculateLuminance(p2) - calculateLuminance(p1);
    });
};

const buildRgb = (imageData: Uint8ClampedArray): RGBColor[] => {
    const rgbValues = [];
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        };

        rgbValues.push(rgb);
    }

    return rgbValues;
};

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues: RGBColor[]) => {
    /**
     * Min is initialized to the maximum value posible
     * from there we procced to find the minimum value for that color channel
     *
     * Max is initialized to the minimum value posible
     * from there we procced to fin the maximum value for that color channel
     */
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;

    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;

    rgbValues.forEach((pixel: RGBColor) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);

        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
    });

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    // determine which color has the biggest difference
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
        return "r";
    } else if (biggestRange === gRange) {
        return "g";
    } else {
        return "b";
    }
};

/**
 * Median cut implementation
 * can be found here -> https://en.wikipedia.org/wiki/Median_cut
 */
const quantization = (rgbValues: RGBColor[], depth: number): RGBColor[] => {
    const MAX_DEPTH = 4;

    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
            (prev, curr) => {
                prev.r += curr.r;
                prev.g += curr.g;
                prev.b += curr.b;

                return prev;
            },
            {
                r: 0,
                g: 0,
                b: 0,
            },
        );

        color.r = Math.round(color.r / rgbValues.length);
        color.g = Math.round(color.g / rgbValues.length);
        color.b = Math.round(color.b / rgbValues.length);

        return [color];
    }

    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1: RGBColor, p2: RGBColor) => {
        return p1[componentToSortBy] - p2[componentToSortBy];
    });

    const mid = rgbValues.length / 2;
    return [
        ...quantization(rgbValues.slice(0, mid), depth + 1),
        ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
};

const buildPalette = (colorsList: RGBColor[]): string[] => {
    const orderedByColor = orderByLuminance(colorsList);

    const hexPalette = orderedByColor.map(({ r, g, b }: RGBColor) => {
        if (!r || !g || !b) return;

        function rgbToHex(rgb: number) {
            const hex = rgb.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        const rHex = rgbToHex(r);
        const gHex = rgbToHex(g);
        const bHex = rgbToHex(b);

        return `#${rHex}${gHex}${bHex}`;
    });

    const filteredHexPalette = hexPalette.filter((hex) => !!hex) as string[];

    return filteredHexPalette;
};

export function useColorPalette(originalImageUrl?: string) {
    const [palette, setPalette] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!originalImageUrl) return;

        setTimeout(() => {
            const imageTag = document.getElementById("book-principal-image") as HTMLImageElement;
            const urlAttribute = imageTag?.getAttribute("src");
            if (urlAttribute) {
                setImageUrl(urlAttribute);
            }
        }, 0);

        if (!imageUrl) return;

        const image = new Image();
        image.src = imageUrl;
        image.crossOrigin = "anonymous";

        // Whenever file & image is loaded proceed to extract the information from the image
        image.onload = () => {
            // Set the canvas size to be the same as of the uploaded image
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            if (canvas) {
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(image, 0, 0);

                /**
                 * getImageData returns an array full of RGBA values
                 * each pixel consists of four values: the red value of the color, the green, the blue, and the alpha
                 * (transparency). For array value consistency reasons,
                 * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
                 */
                const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
                if (!imageData?.data) {
                    return [];
                }

                // Convert the image data to RGB values so it's much simpler
                const rgbArray = buildRgb(imageData.data);

                /**
                 * Color quantization
                 * A process that reduces the number of colors used in an image
                 * while trying to visually maintain the original image as much as possible
                 */
                const quantColors = quantization(rgbArray, 0);

                // Create the HTML structure to show the color palette
                const newPalette = buildPalette(quantColors);
                setPalette(newPalette);
            }
        };
    }, [originalImageUrl, imageUrl]);

    return palette;
}
