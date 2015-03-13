var Iterator = require('./lib/Iterator'),
    Parser = require('./lib/Parser'),
    connection = require('./connection'),
    Link = require('./model/Link'),
    parser = new Parser('http://usados.autoplaza.com.mx/');

parser.on('crawled',function(res){
    console.log('-crawled-');
    var all = res.links.concat(res.items);
    console.log('Items length :: %s',res.items.length);
    console.log('Links length :: %s',res.links.length);
    console.log('TOTAL length :: %s',all.length);
    console.log('-------');
    var it = new Iterator(all);
    parseOnce(it);
}).on('end',function(p){
    console.log('crawling ended');
    Link.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
            console.log('Feteched from remote host:');
            console.info(user);
        });
    });
});

function parseOnce(it){
    var link = it.next();
    var all = [];
    if(link !== undefined){
        var l = new Link({url:link});
        l.save();
        var prsr = new Parser(link);
        prsr.createWebServer()
        .on('crawled',function(r){
            console.log(r.items);
            all = all.concat(r.items).concat(r.links);
            parseOnce(it);
        });
    }else{
        console.log('list ended');
        //var rit = new Iterator(all);
        //parseOnce(rit);
    }
};
module.exports = parser;
