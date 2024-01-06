import crypto from 'crypto';
import fs from 'fs';

/**
 * Generate and return the md5 hash of a file.
 *
 * @param {string | Buffer} fileInput - File path or Buffer to the file
 * @return {string} - The generated hash value
 */
const generateMd5Hash = (fileInput: string | Buffer): string => {
    const hash = crypto.createHash('md5');

    // Condition to check if fileInput is Buffer
    if (Buffer.isBuffer(fileInput)) {
        hash.update(fileInput);
    } else {
        // If not a Buffer, consider fileInput as file path
        const data = fs.readFileSync(fileInput);
        hash.update(data);
    }

    return hash.digest('hex');
};

export default generateMd5Hash;