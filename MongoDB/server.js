const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const register = require('./routes/users');
const login = require('./routes/login');
const add_list = require('./routes/add_list');
const get_list = require('./routes/get_list');
const delete_list = require('./routes/delete_list');

const app = express();
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => {
  console.log('MongoDB connection established successfully');
});

app.use(bodyParser.json());

app.use('/register', register);
app.use('/login', login);
app.use('/add-list', add_list);
app.use('/get-list', get_list);
app.use('/delete-list', delete_list);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});