const mongoose = require('mongoose');


const registrationSchema = mongoose.Schema
({ 
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    tc: { type: Boolean, required: true }
})

module.exports = mongoose.model('registration', registrationSchema);


