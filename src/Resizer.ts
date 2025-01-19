export default class Resizer {
    protected _isDeferred: boolean;
    // eslint-disable-next-line no-use-before-define
    protected readonly _deferrer: PromiseWithResolvers<Resizer>;
    protected readonly _observer: ResizeObserver;

    public contentBoxSize: ResizeObserverSize;
    public devicePixelContentBoxSize: ResizeObserverSize;

    constructor(parentElement: HTMLElement) {
        this._isDeferred = false;
        this._deferrer = Promise.withResolvers();

        this._observer = new ResizeObserver((entries) => {
            if (!this._isDeferred) {
                this._deferrer.resolve(this);

                this._isDeferred = true;
            }

            const [entry] = entries;
            const [contentBoxSize] = entry.contentBoxSize;
            const [devicePixelContentBoxSize] = entry.devicePixelContentBoxSize;

            Object.assign(this.contentBoxSize, {
                inlineSize: contentBoxSize.inlineSize,
                blockSize: contentBoxSize.blockSize,
            });

            Object.assign(this.devicePixelContentBoxSize, {
                inlineSize: devicePixelContentBoxSize.inlineSize,
                blockSize: devicePixelContentBoxSize.blockSize,
            });
        });

        this._observer.observe(parentElement);

        this.contentBoxSize = {
            inlineSize: 0,
            blockSize: 0,
        };

        this.devicePixelContentBoxSize = {
            inlineSize: 0,
            blockSize: 0,
        };
    }

    static initialize(parentElement = document.body): Promise<Resizer> {
        const instance = new Resizer(parentElement);

        return instance._deferrer.promise;
    }

    fit<E extends HTMLElement>(elements: E | E[]): void {
        const fitCallback = (element: E) => {
            Object.assign(element.style, {
                width: `${this.contentBoxSize.inlineSize}px`,
                height: `${this.contentBoxSize.blockSize}px`,
            });

            Object.assign(element, {
                width: this.devicePixelContentBoxSize.inlineSize,
                height: this.devicePixelContentBoxSize.blockSize,
            });
        };

        if (elements instanceof Array) {
            elements.forEach(fitCallback);

            return;
        }

        fitCallback(elements);
    }
}
