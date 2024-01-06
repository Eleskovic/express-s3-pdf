// services/upload.ts

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        if(ext !== '.pdf') {
            return callback(new Error('Only pdfs are allowed'))
        }

        callback(null, true)
    },
    limits: {
        fileSize: 20 * 1024 * 1024 // Limit file size to 20MB
    }
}).single('file');

export default upload;
