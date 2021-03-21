var mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const trendSchema = new Schema({
    image_url:{
        type:String,
        trim: true,
        default :'uploads/photos/well-logo.jpg'

    },
    name: {
        type: String,
        trim: true
        
    },
    price: {
        type: String,
        trim: true
    }


    

},{
    timestamps: true
});

module.exports = mongoose.model('Trend', trendSchema);