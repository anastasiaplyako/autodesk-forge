const {Router} = require("express");
const router = Router();
const config = require("../config")
const User = require("../model/user");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// /api/forge/auth
router.post("/register",
    [
        check('login', "Некорректный login").exists(),
        check('password', "Минимальная длина пароля 3 ").isLength({min: 3})
    ],
    async (req, res) => {
        try {
            const err = validationResult(req);
            if (!err.isEmpty()) {
                return res.status(400).json({
                    err: err.array(),
                    message: "Некорректный логин / пароль"
                })
            }
            const { login, password } = req.body;
            const user = await User.findOne({ login })
            if (user) {
                res.status(400).json({
                    message: "Already exist"
                })
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({login, password: hashedPassword});
            await newUser.save();
            res.status(201).json({message: 'Ok!'})
        } catch (e) {
            console.log("e = ", e);
            res.status(500).json({message: "Try again" + e.message})
        }
    });


router.post("/login",
    [
        check('login', "Некорректный login").exists(),
        check('password', "Минимальная длина пароля 7 ").isLength({min: 7})
    ],
    async (req, res) => {
        try {
            console.log("login")
            const err = validationResult(req);
            if (!err.isEmpty()) {
                return res.status(400).json({
                    err: err.array(),
                    message: "Некорректный логин / пароль"
                })
            }
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (!user) {
                return res.status(400).json({
                    message: "Пользователь не найден"
                })
            }
            const isMatchPassword = await bcrypt.compare(password, user.password)
            if (!isMatchPassword) {
                res.status(400).json({
                    message: "Неверный логин / пароль"
                })
            }
            const token = jwt.sign(
                { userId: user.id },
                config.jwtSecret,
                { expiresIn: '1h' }
            )
            res.json({ token, userId: user.id })
        } catch (e) {
            res.status(500).json({message: "Try again"})
        }
    });


module.exports = router