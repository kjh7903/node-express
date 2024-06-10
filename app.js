const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const inventoryRouter = require('./routes/inventory');

mongoose.connect('mongodb://localhost/inventorydb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/inventory', inventoryRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
