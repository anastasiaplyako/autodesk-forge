const config = require('../config');
const express = require('express');
const xlsx = require('node-xlsx');
let router = express.Router();
const AWS = require('aws-sdk');
const auth = require('../middleware/auth.middleware');
const Project = require("../model/project/project");
const uuid = require('uuid/v4');
const Table = require("../model/table");
const {findProject} = require("./db/projects");
const { getSignedUrl } = require("./db/aws");
const multer = require("multer");
const {createFileAWS} = require("./db/aws");
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})
const upload = multer({storage}).single('fileToUpload')

const s3 = new AWS.S3({
    accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
})

router.post('/createTables', auth, upload,  async (req, res) =>{
    const fileName = req.file.originalname;
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileName}`,
        Body: req.file.buffer
    }
    const project = await findProject(req.body.idProject);
    const newTable = new Table({
        originalName: req.file.originalname,
        keyAWS: params.Key,
        idProject: project[0]._id,
    })
    await newTable.save();
    createFileAWS(params);
    res.status(200).end();
})

router.get('/getTables', auth, async (req, res) =>{
    const urn = req.query.id;
    const tables = [];
    const project = await Project.find({urn: urn });
    const tableFiles = await Table.find({
        idProject: project[0]._id
    })
    await Promise.all(tableFiles.map(async item => {
        item.url = await getSignedUrl(item);
        tables.push(item);
    }))
    res.send(tables);
})

router.get('/getTable', auth, async (req, res) =>{
    const id = req.query.id;
    const table = await Table.findOne({_id: id, });
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: table.keyAWS
    };
    let buffers = [];
    const stream = s3.getObject(params).createReadStream();
    stream.on('data', function (data) {
        buffers.push(data);
    });
    stream.on('end', function () {
        const buffer = Buffer.concat(buffers);
        const workbook = xlsx.parse(buffer);
        res.send(workbook);
    });
})

router.post('/updateTable', auth, async (req, res) => {
    const workbook = [req.body.workbook];
    const id = req.body.id;
    const table = await Table.findOne({_id: id });
    let bufferUpdate = xlsx.build(workbook);
    const paramsUpdate = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: table.keyAWS,
        Body: bufferUpdate
    };
    s3.upload(paramsUpdate, (error, data) => {
        if (error) {
            console.log(error)
        }
    })
})

module.exports = router;

