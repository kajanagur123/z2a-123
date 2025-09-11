const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/students');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
