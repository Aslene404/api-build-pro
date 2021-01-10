var mongoose = require('mongoose');
const projects=require('./e_projects-schemas');
const user=require('./user-schema');
//Define a schema
const Schema = mongoose.Schema;

const entrepriseSchema = new Schema({
    logo_url:{
        type:String,
        trim: true,
        default :'uploads/photos/well-logo.jpg'

    },
    name: {
        type: String,
        trim: true
        
    },
    owner: { 
        type:Schema.Types.ObjectId,
        ref: "user"
    },

    about: {
        type: String,
        trim: true
    },
    services: [{ 
        type:String,
        trim: true
    }],
    projects: [{ 
        type:Schema.Types.ObjectId,
        ref: "e_projects"
    }],
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    fb: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Entreprise', entrepriseSchema);