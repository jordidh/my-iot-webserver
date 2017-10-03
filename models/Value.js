/**
 * Created by jordi on 05/08/17.
 */
// Load mongoose package
var mongoose = require('mongoose');

// Create a schema
var ValueSchema = new mongoose.Schema({
        value: { type: String, default: '' },
        parentKey: { type: String, default: '' },
        timeStamp: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now }
    },
    { strict: false }
);

module.exports = mongoose.model('Value', ValueSchema);