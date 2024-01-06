import express from 'express';
import * as fs from "fs";
import path from "node:path";
const app = express();
const port = 3000;
import uploadRouter from "./upload-controller";


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/upload', uploadRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})