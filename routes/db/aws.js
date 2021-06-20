const config = require('../../config');
const AWS = require('aws-sdk');
const xlsx = require('node-xlsx');

const Table = require("../../model/table");

const s3 = new AWS.S3({
    accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
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

const createFileAWS = (params) => {
    s3.upload(params, (error, data) => {
        if (error) {
            console.log(error)
        }
        console.log("successfull");
    })
}

module.exports = {
    getSignedUrl, createFileAWS
};