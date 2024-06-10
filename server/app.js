require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Inventory = require('./models/Inventory');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/inventory', async (req, res) => {
    const { name, quantity } = req.body;
    const timestamp = new Date();

    const existingItem = await Inventory.findOne({ name });
    if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.timestamps.push({ timestamp, quantity });
        await existingItem.save();
        res.json(existingItem);
    } else {
        const newItem = new Inventory({ name, quantity, timestamps: [{ timestamp, quantity }] });
        await newItem.save();
        res.json(newItem);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
