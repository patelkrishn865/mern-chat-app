// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index'); // Import app and server from socket

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookiesParser());

// API root
app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    });
});

// API routes
app.use('/api', router);
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

const PORT = process.env.PORT || 8080;

// Connect to database and start the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
});
