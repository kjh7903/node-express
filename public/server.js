const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function getItem(req, res, next) {
    try {
        const item = await Item.findOne({ name: req.params.name }); // Fetch by name
        if (item == null) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.item = item;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Item 스키마
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number },
  description: String,
  history: [{ 
    timestamp: { type: Date, default: Date.now },
    changeQuantity: Number,
    newQuantity: Number,
  }]
});
const Item = mongoose.model('Item', itemSchema);

app.use(bodyParser.json());

// API 엔드포인트
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/items/:name', getItem, (req, res) => {
  res.json(res.item);
});

app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description,
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/items/:name', async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { name: req.params.name },
      { 
        $set: { quantity: req.body.quantity }, 
        $push: { 
          history: { 
            changeQuantity: req.body.quantity - (req.body.previousQuantity || 0),
            newQuantity: req.body.quantity 
          }
        } 
      },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/items/:name', getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 재료의 변경 내역 조회
app.get('/api/items/:name
