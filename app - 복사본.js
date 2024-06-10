require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inventoryRouter = require('./routes/inventory');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use('/inventory', inventoryRouter);

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
