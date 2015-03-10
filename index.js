var Iterator = require('./lib/Iterator'),
    Parser = require('./lib/Parser'),
    parser = new Parser('http://usados.autoplaza.com.mx/'),
    autos = [],
    links = [];


parser.createWebServer()
.on('crawled',function(res){
    var all = res.links.concat(res.items);
    links = links.concat(all);
    autos = autos.concat(res.items);
    var it = new Iterator(all);
    parseOnce(it);
})
.on('end',function(p){
    console.log(autos);
    console.log(autos.length);
});

function parseOnce(it){
    var link = it.next();
    if(link !== undefined){
        var prsr = new Parser(link);
        prsr.createWebServer()
        .on('crawled',function(r){
            console.log(r.items);
            links = links.concat(r.links).concat(r.items);
            autos = autos.concat(r.items);
            parseOnce(it);
        });
    }else{
        var rit = new Iterator(links);
        parseOnce(rit);
    }
};
