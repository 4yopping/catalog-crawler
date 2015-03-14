var cluster = require('cluster'),
    Crawler = require('./Crawler');

var workers = {},
    count = require('os').cpus().length;

function spawn(){
    var worker = cluster.fork();
    workers[worker.pid] = worker;
    return worker;
}

if (cluster.isMaster) {
    for (var i = 0; i < count; i++) {
        spawn();
        break;
    }
    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died. spawning a new process...');
        delete workers[worker.pid];
        spawn();
    });
} else {
    var c = new Crawler('http://usados.autoplaza.com.mx/');
}
