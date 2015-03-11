var mongoose = require('mongoose'),
    Joi = require('joi')

var LinkSchema = mongoose.Schema({
    //{url:'http://usados.autoplaza.com.mx/',type:'link',lastStatus:200,crawled:false,dynamic:true}
    url         : String,
    type        : String,
    lastStatus  : Number,
    crawled     : Boolean,
    dynamic     : Boolean,
    created     : { type: String, default: Date.now }
});

LinkSchema.methods.joiValidate = function(next) {
    var schema = {
        url: Joi.string().uri().required(),
        type: Joi.string().valid('link','item','index','doc','other').default('link'),
        lastStatus: Joi.number().min(100).max(700).default(200),
        crawled: Joi.boolean().default(false),
        dynamic: Joi.boolean().default(false),
        created: Joi.date().default(Date.now, 'time of creation')
    }
    var v = Joi.validate(this, schema);
    if(v == null){
        return next();
    }else{
        console.info(v);
        throw v;
    }
};
 
module.exports = mongoose.model('Link', LinkSchema);
