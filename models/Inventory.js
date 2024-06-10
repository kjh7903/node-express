const mongoose = require('mongoose');

const timestampSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    quantity: { type: Number, required: true },
    changeQuantity: { type: Number, required: true },
    user: { type: String, required: true, default: 'Unknown' } // 기록하는 사람 기본값 설정
});

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    timestamps: [timestampSchema]
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
