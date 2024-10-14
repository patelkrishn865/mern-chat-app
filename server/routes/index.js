const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');
const upload = require('../utils/upload'); // Import your multer upload middleware
const { uploadImage, getImage } = require('../controller/image-controller'); // Import your image controller

const router = express.Router();

// Create user API
router.post('/register', registerUser);
// Check user email
router.post('/email', checkEmail);
// Check user password
router.post('/password', checkPassword);
// Login user details
router.get('/user-details', userDetails);
// Logout user
router.get('/logout', logout);
// Update user details
router.post('/update-user', updateUserDetails);
// Search user
router.post('/search-user', searchUser);

// File upload routes
router.post('/uploads', upload.single('file'), uploadImage); // Route for uploading files
router.get('/file/:fileId', getImage); // Route for retrieving files

module.exports = router;
