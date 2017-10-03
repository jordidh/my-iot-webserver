/**
 * Created by jordi on 31/07/17.
 */
// Load mongoose package
var mongoose = require('mongoose');

// Create a schema
var KeySchema = new mongoose.Schema({
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        unit: {
            code: { type: String, default: '' },
            description: { type: String, default: '' }
        },
        parentKey: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
    },
    { strict: false }
);

module.exports = mongoose.model('Key', KeySchema);