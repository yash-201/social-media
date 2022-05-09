const multer = require("multer");

const maxSize = 5 * 1024 * 1024;

const util = require("util");

module.exports = function(path) {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path);
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + "_" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/avif") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const uploadFile = multer({
        storage: fileStorage,
        limits: { fileSize: maxSize },
        fileFilter: fileFilter
    });

    const uploadImage = uploadFile.single('image');

    return uploadImage;
}