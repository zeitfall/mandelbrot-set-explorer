self.addEventListener('message', (event) => {
    const {
        canvasInverseWidth,
        canvasInverseHeight,
        chunkSizeX,
        chunkSizeY,
        chunkStartX,
        chunkStartY,
        minRe,
        maxRe,
        minIm,
        maxIm,
        lengthRe,
        lengthIm,
        maxIterations,
    } = event.data;

    const chunkDataArray = new Uint8ClampedArray(4 * chunkSizeX * chunkSizeY);

    for (let y = 0; y < chunkSizeY; y++) {
        for (let x = 0; x < chunkSizeX; x++) {
            const pi = 4 * (y * chunkSizeX + x);
            const px = x + chunkStartX;
            const py = y + chunkStartY;

            const cx = px * canvasInverseWidth * lengthRe + minRe;
            const cy = py * canvasInverseHeight * lengthIm + minIm;
            let zx = cx;
            let zy = cy;
            let zx2 = zx * zx;
            let zy2 = zy * zy;
            let d2 = zx2 + zy2;

            let iteration = 0;

            while (d2 <= 16 && iteration < maxIterations) {
                const _zx = zx2 - zy2 + cx;
                const _zy = 2 * zx * zy + cy;

                zx = _zx;
                zy = _zy;
                zx2 = zx * zx;
                zy2 = zy * zy;
                d2 = zx2 + zy2;

                iteration++;
            }

            if (iteration < maxIterations) {
                iteration = 1 + iteration - Math.log(Math.log(d2) / Math.log(2)) / Math.log(2);
            }

            const color = iteration / maxIterations;

            chunkDataArray[pi + 0] = 255 * color;
            chunkDataArray[pi + 1] = 255 * color + 100;
            chunkDataArray[pi + 2] = 255 * color + 50;
            chunkDataArray[pi + 3] = 255;
        }
    }

    const chunkData = new ImageData(chunkDataArray, chunkSizeX, chunkSizeY);

    self.postMessage({
        chunkData,
        chunkStartX,
        chunkStartY,
    });
});
