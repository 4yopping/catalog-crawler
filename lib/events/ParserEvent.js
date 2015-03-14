var Parser = require('../Parser'),
    Link = require('../../model/Link')

var ParserEvent = function ParserEvent(p,o,i,l){
    this.parser = p;
    this.origin = o;
    if(i == null){
        this.items = [];
    } else {
        this.items = i;
    }
    if(l == null){
        this.links = [];
    } else {
        this.links = i;
    }
}

module.exports = ParserEvent;
