var mongoose = require('mongoose'),
    Joi = require('joi')

var LinkSchema = mongoose.Schema({
    url         : String,
    type        : {type: String , default: 'link'   }, 
    lastStatus  : {type: Number , default: 200      },
    crawled     : {type: Boolean, default: false    },
    dynamic     : {type: Boolean, default: false    },
    created     : {type: String , default: Date.now }
});

LinkSchema.methods.joiValidate = function(next) {
    var schema = {
        url: Joi.string().uri().required(),
        type: Joi.string().valid('link','item','index','doc','other').required().default('link'),
        lastStatus: Joi.number().min(100).max(700).required().default(200),
        crawled: Joi.boolean().required().default(false),
        dynamic: Joi.boolean().required().default(false),
        created: Joi.date().required().default(Date.now, 'time of creation')
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
