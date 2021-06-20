const AWS = require('aws-sdk');
const express = require('express');
let router = express.Router();
const auth = require('../middleware/auth.middleware');
const config = require('../config');
const uuid = require('uuid/v4');
const multer = require("multer");
const Documentation = require("../model/Documentation/documentation");
const DocumentationFolder = require("../model/Documentation/documentation-folder");

const s3 = new AWS.S3({
    accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('fileToUpload')

router.post('/createFile', auth, upload, async (req, res) => {
    const fileName = req.file.originalname;
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileName}`,
        Body: req.file.buffer
    }
    const newFile = new Documentation({
        originalName: req.file.originalname,
        keyAWS: params.Key,
        idProject: req.body.idProject,
    })
    await newFile.save();
    const newFileFolder = new DocumentationFolder({
        idFolder: req.body.idFolder,
        idDocumentation: newFile._id
    })
    await newFileFolder.save();
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

const getSignedUrl = (file) => {
    const options = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: file.keyAWS,
        ResponseContentType: "application/pdf"
    };
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', options, (err, url) => {
            if (err) reject(err);
            resolve(url);
        });
    })
}

router.get('/getFile', auth, async (req, res) => {
    const files = [];
    const idFolder = req.query.id;
    const folderFiles = await
        DocumentationFolder
            .find({idFolder: idFolder})
            .populate("idDocumentation")
    await Promise.all(folderFiles.map(async item => {
        const url = await getSignedUrl(item.idDocumentation);
        item.idDocumentation.url = url;
        files.push(item.idDocumentation);
    }))
    res.send({
        files: files
    });
})

router.get('/delete', auth, async (req, res) => {
    const idFile = req.query.id;
    try {
        await Documentation.deleteOne({_id: idFile});
        await DocumentationFolder.deleteMany({idDocumentation: idFile});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
    }
})

module.exports = router;