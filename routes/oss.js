/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const {addRole, addUserRole} = require("./db/roles");
const {addProject, findProjectNameBucket} = require("./db/projects");
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const Bucket = require("../model/bucket/bucket")
const {BucketsApi, ObjectsApi, PostBucketsPayload} = require('forge-apis');
const auth = require('../middleware/auth.middleware')
const {getClient, getInternalToken} = require('./common/oauth');
const config = require('../config');
const UserBucket = require("../model/bucket/user-bucket");
let router = express.Router();
const {updateUrnInProject} = require("./db/projects");

router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

router.get('/buckets', auth, async (req, res, next) => {
    const bucket_name = req.query.id;
    console.log("buckets GET", bucket_name);
    if (!bucket_name || bucket_name === '#') {
        try {
            const buckets = await new BucketsApi().getBuckets({limit: 100}, req.oauth_client, req.oauth_token);
            buckets.body.items.map(async bucket => {
                const name = bucket.bucketKey.replace(config.credentials.client_id.toLowerCase() + '-', '');
                const findBucket = await Bucket.findOne({
                    nameBucket: name
                });
                if (!!findBucket && !findBucket.idBucket) {
                    await Bucket
                        .updateOne({nameBucket: name}, {$set: {idBucket: bucket.bucketKey}});
                }
            })
            const bucketsUser = await UserBucket
                .find({idUser: req.user.userId})
                .populate("idBucket");
            res.json(bucketsUser);
        } catch (err) {
            next(err);
        }
    } else {
        try {
            const objects = await new ObjectsApi().getObjects(bucket_name, {limit: 100}, req.oauth_client, req.oauth_token);
            objects.body.items.map(async object => {
                const findProject = await findProjectNameBucket(object.objectKey, object.bucketKey);
                if (findProject && !findProject.urn) {
                    await updateUrnInProject(findProject, Buffer.from(object.objectId).toString('base64'))
                }
            })
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch (err) {
            next(err);
        }
    }
});


router.post('/buckets', auth,  async (req, res, next) => {
    let payload = new PostBucketsPayload();
    payload.bucketKey = config.credentials.client_id.toLowerCase() + '-' + req.body.bucketKey;
    payload.policyKey = 'persistent';
    try {
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        const newBucket = new Bucket({
            nameBucket: req.body.bucketKey,
            idOwner: req.user.userId,
        })
        await newBucket.save();
        const newUserBucket = new UserBucket({
            idBucket: newBucket._id,
            idUser: req.user.userId,
        })
        await newUserBucket.save();
        res.status(200).end();
    } catch (err) {
        console.log("err", err)
        next(err);
    }
});

router.post('/objects', auth,  multer({dest: 'uploads/'}).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
            console.log("e")
            next(err);
        }
        try {
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            const newProject = await addProject(req.body.bucketKey, req.file.originalname);
            const newRole = await addRole('admin');
            await addUserRole(newRole._id, req.user.userId, newProject._id);
            res.status(200).end();
        } catch (err) {
            console.log("err2")
            next(err);
        }
    });
});

module.exports = router;
