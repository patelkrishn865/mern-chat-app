const multer = require('multer');

// Define storage and other multer configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify your uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload; // Export the multer instance
