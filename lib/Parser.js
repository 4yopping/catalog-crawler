var phantom = require('phantom'),
    inherits = require('util').inherits,
    uri = require('url'),
    EventEmitter = require('events').EventEmitter;

var Parser = function(url){
    //console.log('new Parser(',url,')');
    this.page;
    this.ws;
    this.url = url;
    var self = this; 
    this.createWebServer = function(){
        phantom.create(function(ph){ 
            self.ws = ph;
            ph.createPage(self.createPage);
        },{loadImages:false,onStdout:function(data){},onExit:self.exitCallback});
        return self
    }

    this.createPage = function(p) {
        self.page = p;
        self.page.set('settings', {userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'});
        //console.log('self.url',self.url);
        p.open(self.url,self.pageOpen);
    }

    this.pageOpen = function(status) {
        self.page.evaluate(self.pageEvaluate,self.evaluateCallback);
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
        if(result == null){
            self.emit('crawled',{items: [],links:[]});
        }else{
            self.emit('crawled',{items: self.undup(result.i),links:self.undup(result.l)});
        }
        self.ws.exit();
    }
    this.exitCallback = function(some){
        self.emit('end',some);
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
