var mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

const devisSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
     
    },
    email: {
        type: String,
        trim: true,
      
    },
    phone: {
        type: String,
        trim: true,
       
    },
    entreprise: {
        type: String,
        trim: true
    },
    numRegistre: {
        type: String,
        trim: true
    },
    cat: {
        type: String,
        trim: true
    },
    subcat: {
        type: String,
        trim: true
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Devis', devisSchema);