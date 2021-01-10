var mongoose = require('mongoose');
const Entreprise=require('./entreprise-schemas');
//Define a schema
const Schema = mongoose.Schema;

const e_projectsSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    photo_url: {
        type: String,
        trim: true,
        default :'uploads/photos/project_image.jpg'
    
    },
    entreprise:{type:Schema.Types.ObjectId,ref:"Entreprise"}
    

},{
    timestamps: true
});

module.exports = mongoose.model('E_projects', e_projectsSchema);