var mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    opinion: {
        type: String,
        trim: true,
        required: true
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);