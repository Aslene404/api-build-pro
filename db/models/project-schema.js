const mongoose = require('mongoose');
const User = require('./user-schema');
const Task = require('./task-schema');
const Material = require('./material-schema');




//Define a schema
const Schema = mongoose.Schema;

/**
 * Project Schema
 */
const ProjectSchema = new Schema({
    projectname: {
        type: String,
        trim: true,
        required: [true, 'project name is required']
    },
    owner:{
		type: Schema.Types.ObjectId,
		trim: true,
        required :[true, 'owner is required'],
        ref:'User'
	},
    status: {
        type: String,
        trim: true,
        required: [true, 'status is required'],
		default: 'in progress'
    },
	tasks:[ { 
        type: Schema.Types.ObjectId,
        ref: "Task"
    }],
	materials: [{ 
        type:Schema.Types.ObjectId,
        ref: "Material"
    }],
	staff:[ { 
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
    
});






module.exports = mongoose.model('Project', ProjectSchema);