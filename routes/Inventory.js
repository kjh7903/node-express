const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// 최신 재고 수량 가져오기
router.get('/latest/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const item = await Inventory.findOne({ name }).sort({ 'timestamps.timestamp': -1 }).exec();
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ quantity: item.quantity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 재고 추가 또는 업데이트
router.post('/', async (req, res) => {
    const { name, quantity, changeQuantity, user } = req.body;
    const timestamp = new Date();

    console.log('Received POST /inventory request');
    console.log('Request body:', req.body);

    if (!name || quantity == null || changeQuantity == null || !user) {
        console.log('Bad Request: Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let item = await Inventory.findOne({ name });
        if (item) {
            item.timestamps.push({ timestamp, quantity, changeQuantity, user });
            item.quantity = quantity;
        } else {
            item = new Inventory({ name, quantity, timestamps: [{ timestamp, quantity, changeQuantity, user }] });
        }

        await item.save();
        res.json({ message: '재료명 수량이 저장되었습니다.', item });
    } catch (err) {
        console.log('Error saving item:', err);
        res.status(400).json({ message: err.message });
    }
});

// 특정 재료의 히스토리 조회 및 테이블 렌더링
router.get('/history', async (req, res) => {
    const { name } = req.query;
    try {
        const item = await Inventory.findOne({ name }).exec();
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.render('inventoryHistory', { item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
