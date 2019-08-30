

/* global Java, Polyglot.*/

if (typeof Java === 'undefined') {
    throw 'Use GraalVM has to support JVM interop!';
}
if (typeof Polyglot === 'undefined') {
    throw new 'GraalVM has to define Polyglot global symbol!';
}
const Worker = require('./polyglot_worker.js').NodePolyglotWorker;

var executor = new Worker();
var className = "google_package.Services";
var servicesClass = Java.type(className);
var services = new servicesClass(require, global, async (work, finish) => {
    var r = await executor.submit(work);
    finish(r);
});
global.quit = function() { process.exit() };
global.cast = function(value, prototype) {
    if (prototype != null) {
        throw "Use null as prototype, was: " + prototype;
    }
    return value;
};
var algorithms = {
    'java' : function(n, worker) {
        return worker ? worker.submit(services, {method:'factorial', args:[n]}) : services.factorial(n);
    },
    'js' : function fac(n) {
        if (n <= 1)
            return 1;
        return n * fac(n - 1);
    },
};
services.postInit(algorithms);

const PORT = 8080;

var http = require("http");
var server = http.createServer(async (request, response) => {
    var url = request.url;
    if (url === "/quit") {
        response.end("Quiting...\n");
        global.quit();
        return;
    }
    if (url.startsWith("/java/")) {
        var res = await algorithms.java(Number.parseInt(url.substring(6)), executor);
        response.end(res.toString() + '\n');
        return;
    }
    if (url.startsWith("/js/")) {
        response.end(algorithms.js(Number.parseInt(url.substring(4))) + "\n");
        return;
    }
    response.end("Received: " + url + "\n");
});
server.listen(PORT);


if (process.argv.length > 2 && process.argv[2] === "org.apache.maven.surefire.booter.ForkedBooter") {
    // run unit tests
    var clazz = process.argv[2];
    var servicesClass = Java.type(clazz);
    servicesClass.main(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
} else {
    console.log("Listening on http://localhost:" + PORT + "/");
}
