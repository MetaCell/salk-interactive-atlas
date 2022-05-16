import {hexToRgb} from "../utilities/functions";

export const drawImage = (canvas: { getContext: (arg0: string) => any; width: number; height: number; } , src: string, ) => {
    const ctx = canvas.getContext('2d')
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2);
    };
    img.src = src
}

export const drawColoredImage = (canvas: { getContext: (arg0: string) => any; width: number; height: number; },
                                 hCanvas: { getContext: (arg0: string) => any; width: any; height: any; },
                                 src: string, color: any) => {

   return new Promise(resolve => {


    const img = new Image();
    const ctx = canvas.getContext('2d')
    const hctx = hCanvas.getContext('2d')
    const colorRGB = hexToRgb(color)

    img.onload = () => {
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
            resolve(true)
        }
    };
    img.src = src
   })
}

export const clearCanvas = (canvas: { getContext: (arg0: string) => any; width: any; height: any; }) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}