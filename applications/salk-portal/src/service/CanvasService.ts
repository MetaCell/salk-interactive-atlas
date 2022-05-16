import {hexToRgb} from "../utilities/functions";

export const drawImage = (ctx: CanvasRenderingContext2D, src: string, dx: number = 0, dy: number = 0) => {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, dx, dy);
    };
    img.src = src
}

export const drawColoredImage = (canvas: { getContext: (arg0: string) => any; },
                                 hCanvas: { getContext: (arg0: string) => any; width: any; height: any; },
                                 src: string, color: any) => {
    const img = new Image();
    const ctx = canvas.getContext('2d')
    const hctx = hCanvas.getContext('2d')
    const colorRGB = hexToRgb(color)

    img.onload = () => {
        if (colorRGB) {
            clearCanvas(hCanvas)
            hctx.drawImage(img, 0, 0);
            const imageData = hctx.getImageData(0, 0, hCanvas.width, hCanvas.height);
            const data = imageData.data;

            const A = 4
            let count = 0
            for (let i = 0; i < data.length; i++) {
                const opacityIndex = i * A - 1;
                if (data[opacityIndex] === 0) {
                    continue
                }
                data[opacityIndex - 3] = colorRGB.r
                data[opacityIndex - 2] = colorRGB.g
                data[opacityIndex - 1] = colorRGB.b
                count++
            }
            console.log(count)
            hctx.putImageData(imageData, 0, 0);

            ctx.drawImage(hCanvas, 0, 0)
        }

    };
    img.src = src
}

export const clearCanvas = (canvas: { getContext: (arg0: string) => any; width: any; height: any; }) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}