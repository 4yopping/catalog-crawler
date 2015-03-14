var phantom = require('phantom'),
    inherits = require('util').inherits,
    uri = require('url'),
    EventEmitter = require('events').EventEmitter,
    ParserEvent = require('./events/ParserEvent');

var Parser = function(l){
    //console.log('new Parser(',l.url,')');
    this.page;
    this.ws;
    this.link = l;
    this.createWebServer = function(){
        phantom.create(function(ph){ 
            this.ws = ph;
            ph.createPage(this.createPage.bind(this));
        }.bind(this),{loadImages:false,onStdout:function(data){},onExit:this.exitCallback.bind(this)});
        return this;
    }

    this.createPage = function(p) {
        this.page = p;
        //Commented because the server didn't respond when called with these headers
        //this.page.set('settings', {userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'});
        //console.log('this.link.url',this.link.url);
        p.open(this.link.url,this.pageOpen.bind(this));
    }

    this.pageOpen = function(status) {
        this.page.evaluate(this.pageEvaluate,this.evaluateCallback.bind(this));
    }

    this.pageEvaluate = function(){
        var itms = [];
        $('a[href*="http://auto.autoplaza.com.mx"]').each(function() {
           itms.push($(this).attr('href'));
        });
        var lnks = [];
        $('a[href*="autoplaza.com.mx/"]').each(function(){
            var l = $(this).attr('href');
            if(l.indexOf('autoplaza.com.mx') > 17)
                lnks.push($(this).attr('href'));
        });
        return {
            i: itms,
            l: lnks
        }
    }

    this.evaluateCallback = function (result) {
        var e = new ParserEvent(this,this.link,[],[]);
        if(result != null){
            e.items = this.undup(result.i);
            e.links = this.undup(result.l);
        }
        this.emit('crawled',e);
        //this.ws.exit();
    }
    this.exitCallback = function(exitcode){
        this.emit('end',exitcode);
    }


    this.undup = function (source){
        var newArray = []; 
        for(var i= 0; i < source.length; i++){   
            var ft = true;   
            for(var o=0; o < newArray.length; o++){        
                ft = ft && (source[i] != newArray[o]);     
                var s = uri.parse(source[i]).href;         
                var n = uri.parse(source[o]).href;         
                ft = ft && (s != n);                       
            }                
            if(ft)newArray.push(source[i]);      
        }          
        return newArray;     
    }
};

inherits(Parser,EventEmitter);

module.exports = Parser;
