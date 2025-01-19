import Resizer from './Resizer';
import Selector from './Selector';
import ThreadPool from './ThreadPool';

const reField = document.getElementById('re');
const imField = document.getElementById('im');
const centerField = document.getElementById('center');
const renderedField = document.getElementById('rendered');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d', { alpha: false });

const resizer = await Resizer.initialize(canvas.parentElement);

resizer.fit(canvas);

const canvasInverseWidth = 1 / canvas.width;
const canvasInverseHeight = 1 / canvas.height;
const canvasAspectRatio = canvas.width / canvas.height;

const selector = new Selector(canvas);

const threadURL = new URL('./thread.ts', import.meta.url);
const threadpool = new ThreadPool<ChunkInput, ChunkOutput>(threadURL);

const workgroupSizeX = 64;
const workgroupSizeY = 64;
const workgroupsX = Math.ceil(canvas.width / workgroupSizeX);
const workgroupsY = Math.ceil(canvas.height / workgroupSizeY);

let bounds = calculateBounds(-2.25, .75, -1, 1);

reField.innerText = `${bounds.minRe.toFixed(8)}; ${bounds.maxRe.toFixed(8)}`;
imField.innerText = `${bounds.minIm.toFixed(8)}; ${bounds.maxIm.toFixed(8)}`;
centerField.innerText = `${bounds.centerRe.toFixed(8)}; ${bounds.centerIm.toFixed(8)}`;

let beg = performance.now();

await render(bounds);

renderedField.innerText = `${(performance.now() - beg).toFixed(1)}ms`;

selector.addEventListener('pointerdown', async (context) => {
    const {
        startX,
        startY,
        endX,
        endY,
    } = context;

    const {
        minRe,
        maxRe,
        minIm,
        maxIm,
        lengthRe,
        lengthIm,
    } = bounds;

    const newMinRe = minRe + lengthRe * startX * canvasInverseWidth;
    const newMaxRe = maxRe - lengthRe * (canvas.width - endX) * canvasInverseWidth;
    const newMinIm = minIm + lengthIm * startY * canvasInverseHeight;
    const newMaxIm = maxIm - lengthIm * (canvas.height - endY) * canvasInverseHeight;

    bounds = calculateBounds(newMinRe, newMaxRe, newMinIm, newMaxIm);

    beg = performance.now();

    await render(bounds);

    renderedField.innerText = `${(performance.now() - beg).toFixed(1)}ms`;
});

selector.addEventListener('pointermove', (context) => {
    const {
        startX,
        startY,
        endX,
        endY,
    } = context;

    const {
        minRe,
        maxRe,
        minIm,
        maxIm,
        lengthRe,
        lengthIm,
    } = bounds;

    const newMinRe = minRe + lengthRe * startX * canvasInverseWidth;
    const newMaxRe = maxRe - lengthRe * (canvas.width - endX) * canvasInverseWidth;
    const newMinIm = minIm + lengthIm * startY * canvasInverseHeight;
    const newMaxIm = maxIm - lengthIm * (canvas.height - endY) * canvasInverseHeight;

    const newBounds = calculateBounds(newMinRe, newMaxRe, newMinIm, newMaxIm);

    reField.innerText = `${newBounds.minRe.toFixed(8)}; ${newBounds.maxRe.toFixed(8)}`;
    imField.innerText = `${newBounds.minIm.toFixed(8)}; ${newBounds.maxIm.toFixed(8)}`;
    centerField.innerText = `${newBounds.centerRe.toFixed(8)}; ${newBounds.centerIm.toFixed(8)}`;
});

function calculateBounds(minRe: number, maxRe: number, minIm: number, maxIm: number) {
    const centerRe = (minRe + maxRe) / 2;
    const centerIm = (minIm + maxIm) / 2;

    let lengthRe = maxRe - minRe;
    let lengthIm = maxIm - minIm;

    if (lengthRe / lengthIm < canvasAspectRatio) {
        lengthRe = lengthIm * canvasAspectRatio;
    }
    else {
        lengthIm = lengthRe / canvasAspectRatio;
    }

    const halfLengthRe = lengthRe / 2;
    const halfLengthIm = lengthIm / 2;

    return {
        minRe: centerRe - halfLengthRe,
        maxRe: centerRe + halfLengthRe,
        minIm: centerIm - halfLengthIm,
        maxIm: centerIm + halfLengthIm,
        centerRe,
        centerIm,
        lengthRe,
        lengthIm,
    };
}

function render(bounds: ReturnType<typeof calculateBounds>) {
    const chunks: ThreadPayload<ChunkInput>[] = [];

    for (let j = 0; j < workgroupsY; j++) {

        for (let i = 0; i < workgroupsX; i++) {
            const chunkStartX = i * workgroupSizeX;
            const chunkStartY = j * workgroupSizeY;
            const chunkSizeX = Math.min(workgroupSizeX, canvas.width - chunkStartX);
            const chunkSizeY = Math.min(workgroupSizeY, canvas.height - chunkStartY);

            chunks.push({
                data: {
                    canvasInverseWidth,
                    canvasInverseHeight,
                    chunkStartX,
                    chunkStartY,
                    chunkSizeX,
                    chunkSizeY,
                    maxIterations: 2 * 1024,
                    ...bounds,
                },
            });
        }
    }

    return threadpool.submit(chunks, (event) => {
        const {
            chunkData,
            chunkStartX,
            chunkStartY,
        } = event.data;

        context.putImageData(chunkData, chunkStartX, chunkStartY);
    });
}
