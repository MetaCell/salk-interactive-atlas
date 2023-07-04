import {hexToRgb} from "../utilities/functions";

export function drawImage(canvas: { getContext: (arg0: string) => any; width: number; height: number }, img: HTMLImageElement) {
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, canvas.width / 2 - img.width / 2,
        canvas.height / 2 - img.height / 2);
}


export const drawColoredImage = (canvas: { getContext: (arg0: string) => any; width: number; height: number; },
                                 hiddenCanvas: { getContext: (arg0: string) => any; width: any; height: any; },
                                 img: HTMLImageElement, color: string, considersIntensity: boolean = false) => {

    const ctx = canvas.getContext('2d')
    const hctx = hiddenCanvas.getContext('2d')
    const colorRGB = hexToRgb(color)

    if (colorRGB) {
        clearCanvas(hiddenCanvas)
        hctx.drawImage(img, hiddenCanvas.width / 2 - img.width / 2,
            hiddenCanvas.height / 2 - img.height / 2);
        const imageData = hctx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        const data = imageData.data;

        const A = 4
        for (let i = 0; i < data.length; i++) {
            const opacityIndex = i * A - 1;
            if (data[opacityIndex] === 0) {
                continue
            }
            const r = opacityIndex - 3
            const g = opacityIndex - 2
            const b = opacityIndex - 1
            if (considersIntensity){
                const intensity = data[r] / 255; // In greyscale image rgb have the same values
                data[opacityIndex] = 255 * (1 - intensity);  // where 255 is the maximum alpha value
            }
            else{
                data[opacityIndex] = 255
            }

            data[r] = colorRGB.r
            data[g] = colorRGB.g
            data[b] = colorRGB.b
        }
        hctx.putImageData(imageData, 0, 0);

        ctx.drawImage(hiddenCanvas, canvas.width / 2 - hiddenCanvas.width / 2,
            canvas.height / 2 - hiddenCanvas.height / 2)
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
