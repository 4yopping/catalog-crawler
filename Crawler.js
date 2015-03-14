var Iterator = require('./lib/Iterator'),
    Parser = require('./lib/Parser'),
    connection = require('./connection'),
    Link = require('./model/Link');

function onCrawled(e){
    e.origin.crawled = true;
    e.origin.save(function(err, product, numberAffected){
        var it = new Iterator(e.items.concat(e.links));
        parseList(it);
    });
};

function getMore(){
    console.log('getMore');
    Link.find({crawled:false},function(err,docs){
        console.log('Obteniendo los que no han sido crawleados');
        var urls = [];
        for(var l in docs){
            console.log(docs[l].url);
            urls.push(docs[l].url);
        }
        var it = new Iterator(urls);
        crawlList(it);
    });
}
function parseList(it){
    console.log('parseList');
    var link = it.next();
    if(link == undefined){
        getMore();
        return;
    }
    var l = new Link({url:link});
    Link.count({url:link},function(err,count){
        if(err) console.log(err);
        if(count === 0){
            console.log("Salvando %s",l);
            l.save(function(){
                parseList(it);
            });
        } else {
            console.log('Ya existen %d links %s',count,link);
            parseList(it);
        }

    });
}

function crawlList(it){
    console.log('crawlList');
    var link = it.next();
    if(link == undefined){
        return;
    }
    var l = new Link({url:link});
    var prsr = new Parser(l);
    prsr.createWebServer()
    .on('crawled',onCrawled);
    crawlList(it);
}


function Crawler(u){
    parseList(new Iterator([u]));
}

module.exports = Crawler;
