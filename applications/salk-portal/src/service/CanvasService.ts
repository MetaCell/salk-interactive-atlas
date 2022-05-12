export const drawImage = (ctx : CanvasRenderingContext2D , src: string, dx: number = 0, dy: number = 0) => {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, dx, dy);
    };
    img.src = src
}

export const clearCanvas = (canvas: { getContext: (arg0: string) => any; width: any; height: any; }) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}