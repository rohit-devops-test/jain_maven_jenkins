

/* Convenience Node.js worker used to offload Java calls to another thread. */

function NodePolyglotWorker() {
    const TransferablePromiseCompletion = Java.type("google_package.Services.TransferablePromiseCompletion");
    const { Worker } = require('worker_threads');
    this.worker = new Worker(`
                        const {parentPort} = require('worker_threads');
                        parentPort.on('message', (m) => {
                            var {completion, target, options} = m;
                            var args = [];
                            if (options) {
                                args = options.args ? options.args : [];
                                target = options.method ? target[options.method] : target;
                            }
                            try {
                                var result = Reflect.apply(target, undefined, args);
                                parentPort.postMessage({completion, result});
                            } catch (error) {
                                parentPort.postMessage({completion, error});
                            }
                        });
            `, {
                eval: true
            });
    this.worker.on('message', function(m) {
        const {completion} = m;
        if (m.error) {
            const reject = completion.getPromiseReject();
            reject(m.error);
        } else {
            const resolve = completion.getPromiseResolve();
            resolve(m.result);
        }
    });
    this.submit = function(target, options) {
        const worker = this.worker;
        return new Promise(function(resolve, reject) {
            const completion = new TransferablePromiseCompletion(resolve, reject);
            worker.postMessage({completion, target, options});
        });
    };
    this.terminate = function() {
        this.worker.terminate();
    };
}

module.exports = {
    NodePolyglotWorker : NodePolyglotWorker
}
