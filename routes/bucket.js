const express = require('express');
const auth = require('../middleware/auth.middleware');
let router = express.Router();
const Users = require("../model/user");
const Bucket = require("../model/bucket/bucket");
const UserBucket = require("../model/bucket/user-bucket");

// /api/forge/buckets
router.post('/create', auth, async (req, res, next) => {
    const {idBucket, login} = req.body;
    console.log(idBucket, login);
    try {
        const findBucket =  await Bucket.findOne({idBucket: idBucket});
        const findUser =  await Users.findOne({login: login});
        if (!findUser) {
            return res.status(400).json({
                message: "Такого пользователя не существует"
            })
        }
        const newUserBucket = new UserBucket({
            idBucket: findBucket._id,
            idUser: findUser._id,
        })
        await newUserBucket.save();
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
    }

});

router.get('/', auth, async (req, res, next) => {
    const idBucket = req.query.id;
    const findBucket =  await Bucket.findOne({idBucket: idBucket});
    if (!findBucket) {
        return res.status(400).json({
            message: "this bucket doesn't exist"
        })
    }
    res.json(findBucket)
});

router.get('/delete', auth, async (req, res, next) => {
    const idBucket = req.query.id;
    try {
        await UserBucket.deleteOne({_id: idBucket});
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
    }
});

router.get('/user', auth, async (req, res, next) => {
    const idBucket = req.query.id;
    const findBuckets =  await Bucket.findOne({idBucket: idBucket});
    const userBucket = await UserBucket
        .find({idBucket: findBuckets._id})
        .populate("idUser");
    if (!userBucket) {
        return res.status(400).json({
            message: "this bucket doesn't exist"
        })
    }
    res.json(userBucket)
});

module.exports = router;
