const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const authRoute = require('./routes/auth');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => { console.log('connected to db');
    });


//Middleware
app.use(express.json());

// Route Middleware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up and running'));