var Iterator = require('./lib/Iterator'),
    Parser = require('./lib/Parser'),
    connection = require('./connection'),
    Link = require('./model/Link'),
    parser = new Parser('http://usados.autoplaza.com.mx/');

parser.createWebServer()
.on('crawled',function(res){
    var all = res.links.concat(res.items);
    var it = new Iterator(all);
    parseOnce(it);
})
.on('end',function(p){
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
    if(link !== undefined){
        var l = new Link({url:link});
        l.save();
        var prsr = new Parser(link);
        prsr.createWebServer()
        .on('crawled',function(r){
            console.log(r.items);
            parseOnce(it);
        });
    }else{
        //var rit = new Iterator(links);
        //parseOnce(rit);
    }
};
