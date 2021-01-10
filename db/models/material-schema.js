const mongoose = require('mongoose');
const Project = require('./project-schema');




//Define a schema
const Schema = mongoose.Schema;

/**
 * Material Schema
 */
const MaterialSchema = new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:'Project'},

    materialname: {
        type: String,
        trim: true,
        required: [true, 'material name is required']
    },
	quantity: {
        type: Number,
        trim: true,
        required: [true, 'material quantity is required']
    },
	unitprice: {
        type: Number,
        trim: true,
        required: [true, 'material unitprice is required']
    }
    
    
});






module.exports = mongoose.model('Material', MaterialSchema);