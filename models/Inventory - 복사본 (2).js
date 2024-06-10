const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    timestamps: [{
        timestamp: { type: Date, default: Date.now },
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Inventory', inventorySchema);
