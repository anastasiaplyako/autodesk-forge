const express = require('express');
let router = express.Router();
const nodemailer = require('nodemailer');
const config = require("../config");
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const Folder = require("../model/Documentation/folders");
const Project = require("../model/project/project");
// /api/forge/email

const s3 = new AWS.S3({
    accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
})

router.post('/', async (req, res ) => {
    const notesObject = req.body.notesObject;
    const notes = req.body.notes;
    const idProject = req.body.idProject
    let textNotesObject = '';
    let textNote = '';
    notesObject.map(note => {
        textNotesObject += note.note + '\n';
    });
    await Promise.all(notes.map(async note => {
        const folder = await Folder.findOne({_id: note.idFolder});
        textNote += `${folder.nameFolder}:  ${note.note} \n`;
    }))
    const project = await Project.findOne({_id: idProject});
    sendEmail(project.email, textNote + textNotesObject, project.number, res);
})

const sendEmail = (email, textNotes, number, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        auth: {
            user: config.email.login,
            pass: config.email.pass
        },
    });
    const key = `${uuid()}-${number}.txt`
    const params = {Bucket: config.aws.AWS_BUCKET_NAME, Key: key, Body: textNotes};
    s3.upload(params, (error, data) => {
        if (error) {
            console.log("error", error);
        } else {
            console.log("data", data);
        }
    });
    const options = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: key,
    };
    s3.getSignedUrl('getObject', options, (err, url) => {
        if (err) console.log(err);
        let result = transporter.sendMail({
            from: config.email.login,
            to: `${email}`,
            subject: "Экспертиза",
            attachments: [
                {
                    filename: 'result_Expert.txt',
                    path: `${url}`
                }
            ],
            text: "Результаты экспертизы",
            html: `<p> Результаты экспертизы. </p> 
            <p> Регистрационный номер экспертизы ${number} </p>`
        })
        res.send({url: url});
    });
}

module.exports = router;