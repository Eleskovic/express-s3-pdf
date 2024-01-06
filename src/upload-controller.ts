// controllers/FileController.ts

import express, { Request, Response, NextFunction } from 'express';
import upload from './upload';
import multer from "multer";
import generateMd5Hash from "./utils";
import fs from "fs";
import path from "node:path";
import AWS from 'aws-sdk';




const uploadRouter = express.Router();

uploadRouter.post('/', function (req: Request, res: Response) {
    upload(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            // You can handle specific errors: https://www.npmjs.com/package/multer#errors
            res.status(400).send({message: err.message});
        } else if (err) {
            // An unknown error occurred when uploading.
            res.status(400).send({message: err.message});
        }

        if (!req.file) {
            throw new Error(`File is not recognized`)
        }

        const { filename, mimetype, size, originalname}  = req.file;
        const md5 =  generateMd5Hash(req.file.path)

        const dirPath = path.join(__dirname, '..', 'uploads');
        const filePath = path.join(dirPath, `${filename}_meta.json`);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        const metadata = {
            name: filename,
            mime: mimetype,
            size: size,
            originalFileName: originalname,
            hash: md5
        }
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));


        const s3 = new AWS.S3({
            accessKeyId: 'test',
            secretAccessKey: 'test',
            endpoint: new AWS.Endpoint('http://localhost:4566'),
            s3ForcePathStyle: true,
        });

        const fileContent = fs.readFileSync(req.file.path);
        const params = {
            Bucket: 'sample-bucket',
            Key: originalname, // File name in S3
            Body: fileContent
        };
        s3.upload(params, function(err: any, data: any) {
            if (err) {
                throw err;
            }
            console.log(`File has been successfully uploaded  to ${data.Location}`);
        });

        const metaFileContent = fs.readFileSync(filePath);
        const metaFileParams = {
            Bucket: 'sample-bucket',
            Key: `${filename}_meta.json`, // File name in S3
            Body: metaFileContent
        };
        s3.upload(metaFileParams, function(err: any, data: any) {
            if (err) {
                throw err;
            }
            console.log(`File has been successfully uploaded  to ${data.Location}`);
        });




        res.send({ message: 'File uploaded successfully' });
    })
});

export default uploadRouter;