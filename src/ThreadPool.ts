class Thread extends Worker {
    constructor(...parameters: ConstructorParameters<typeof Worker>) {
        super(...parameters);
    }
}

export default class ThreadPool<T = unknown, K = unknown> {
    readonly queue: Array<ThreadPayload<T>>;

    constructor(
        readonly scriptURL: URL,
        readonly maxThreads = navigator.hardwareConcurrency
    ) {
        this.queue = [];
    }

    submit(
        tasks: Array<ThreadPayload<T>>,
        callback: (event: MessageEvent<K>) => void = null
    ) {
        const { promise, resolve } = Promise.withResolvers();
        const controller = new AbortController();

        let threadsUsed = Math.min(tasks.length, this.maxThreads);

        tasks.forEach((task, index) => {
            if (index >= this.maxThreads) {
                this.queue.push(task);

                return;
            }

            const thread = new Thread(this.scriptURL, { name: index.toString() });

            thread.postMessage(task.data, task.transfer || []);

            thread.addEventListener('message', (event) => {
                if (typeof callback === 'function') {
                    callback(event);
                }

                if (this.queue.length > 0) {
                    const newTask = this.queue.shift();

                    thread.postMessage(newTask.data, newTask.transfer || []);

                    return;
                }

                threadsUsed--;

                thread.terminate();

                if (threadsUsed <= 0) {
                    resolve(true);

                    controller.abort();
                }
            }, { signal: controller.signal });
        });

        return promise;
    }
}
