interface ThreadPayload<T> {
    data: T;
    transfer?: Transferable[];
}

interface ChunkInput {
    canvasInverseWidth: number,
    canvasInverseHeight: number,
    chunkStartX: number;
    chunkStartY: number;
    chunkSizeX: number;
    chunkSizeY: number;
    maxIterations: number;
    minRe: number;
    maxRe: number;
    minIm: number;
    maxIm: number;
    centerRe: number,
    centerIm: number,
    lengthRe: number;
    lengthIm: number;
}

interface ChunkOutput {
    chunkData: ImageData;
    chunkStartX: number;
    chunkStartY: number;
}
