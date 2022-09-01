import {hexToRgb} from "../utilities/functions";

export function drawImage(canvas: { getContext: (arg0: string) => any; width: number; height: number }, img: HTMLImageElement) {
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, canvas.width / 2 - img.width / 2,
        canvas.height / 2 - img.height / 2);
}


export const drawColoredImage = (canvas: { getContext: (arg0: string) => any; width: number; height: number; },
                                 hCanvas: { getContext: (arg0: string) => any; width: any; height: any; },
                                 img: HTMLImageElement, color: string) => {

    const ctx = canvas.getContext('2d')
    const hctx = hCanvas.getContext('2d')
    const colorRGB = hexToRgb(color)

    if (colorRGB) {
        clearCanvas(hCanvas)
        hctx.drawImage(img, hCanvas.width / 2 - img.width / 2,
            hCanvas.height / 2 - img.height / 2);
        const imageData = hctx.getImageData(0, 0, hCanvas.width, hCanvas.height);
        const data = imageData.data;

        const A = 4
        for (let i = 0; i < data.length; i++) {
            const opacityIndex = i * A - 1;
            if (data[opacityIndex] === 0) {
                continue
            }
            data[opacityIndex - 3] = colorRGB.r
            data[opacityIndex - 2] = colorRGB.g
            data[opacityIndex - 1] = colorRGB.b
        }
        hctx.putImageData(imageData, 0, 0);

        ctx.drawImage(hCanvas, canvas.width / 2 - hCanvas.width / 2,
            canvas.height / 2 - hCanvas.height / 2)
    }
}

export const clearCanvas = (canvas: { getContext: (arg0: string) => any; width: any; height: any; }) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


export const loadImages = (imagesToLoad: any[]) => {
    const promises = []
    for (const itl of imagesToLoad) {
        promises.push(
            new Promise((resolve, reject) => {
                const img = new Image();
                img.src = itl.src;
                img.addEventListener('load', () => {
                    resolve({img, draw: itl.draw});
                });
            })
        )
    }
    return promises
}
