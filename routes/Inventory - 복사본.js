const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// 모든 재고 가져오기
router.get('/', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 재고 추가 또는 업데이트
router.post('/', async (req, res) => {
    const { name, quantity } = req.body;
    const timestamp = new Date();

    try {
        let item = await Inventory.findOne({ name });
        if (item) {
            item.quantity = quantity;
            item.timestamps.push({ timestamp, quantity });
        } else {
            item = new Inventory({ name, quantity, timestamps: [{ timestamp, quantity }] });
        }
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
