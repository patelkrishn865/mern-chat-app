const File = require('../models/file'); // Adjust the path as necessary

// Function to upload image
const uploadImage = async (req, res) => {
    const fileObj = {
        path: req.file.path,
        name: req.file.originalname,
    };

    try {
        const file = await File.create(fileObj);
        res.status(200).json({ path: `http://localhost:${process.env.PORT}/file/${file._id}` });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get image
const getImage = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ msg: 'File not found' });
        }

        file.downloadCount++;
        await file.save();
        res.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// Export the functions
module.exports = {
    uploadImage,
    getImage,
};
