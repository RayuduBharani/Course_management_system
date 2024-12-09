const db = require('../../Utils/DB/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../Models/RBAC/userModel');
require('dotenv').config()

// signup

const signup = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const ExistedUser = await userModel.findOne({ email: UserInfo.email })
        if (ExistedUser) {
            res.status(409).send({ success: false, message: "User Already Exists" })
        }
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(UserInfo.password, salt);
        const NewUserInfo = new userModel({
            name: UserInfo.name,
            email: UserInfo.email,
            password: hash,
            image: UserInfo.image,
            role: "Empty"
        })
        const SignUpData = await NewUserInfo.save()
        if (SignUpData) {
            res.status(201).send({ success: true, message: " You are Registerd" })
        }
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}

// signin 

const signin = async (req, res) => {
    await db();
    const UserInfo = req.body;
    try {
        const SignInData = await userModel.findOne({ email: UserInfo.email })
        if (SignInData) {
            const CheckPassword = bcrypt.compareSync(UserInfo.password, SignInData.password)
            if (CheckPassword) {
                const token = jwt.sign({
                    email: SignInData.email,
                    name: SignInData.name,
                    userId: SignInData._id,
                    role: SignInData.role,
                    image: SignInData.image
                }, process.env.JWT_KEY)
                res.cookie(process.env.JWT_KEY, token, { httpOnly: true, secure: false , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                    .json({ success: true, token: token, role: SignInData.role, message: "Login Success" , user :SignInData })
            }
            else {
                res.send({ success: false, message: "Password Incorrect" })
            }
        }
        else {
            res.send({ success: false, message: "User not found" })
        }
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message });
        console.log(err)
    }
};

// logout 

const logout = async (req, res) => {
    res.clearCookie(process.env.JWT_KEY).send({
        success : true ,
        message : "Cookie removed"
    })
}

const VerifyToken = async (req, res, next) => {
    const cookiename = process.env.JWT_KEY
    const token = req.cookies[cookiename]
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
}

// Google Auth 
const Google = async (req, res) => {
    await db();
    const userInfo = req.body;

    try {
        let user = await userModel.findOne({ email: userInfo.email })

        if (!user) {
            const generatePass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(generatePass, salt);

            user = new userModel({
                name: userInfo.name,
                email: userInfo.email,
                image: userInfo.image,
                password: hash,
                role: userInfo.role || "Empty"
            });

            await user.save();
        }
        const token = jwt.sign({
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            userId: user._id
        }, process.env.JWT_KEY, { expiresIn: '7d' });
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if (decoded) {
            res.cookie(process.env.JWT_KEY, token, { 
                httpOnly: true, 
                secure: false, 
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            }).json({ 
                success: true, 
                token, 
                role: user.role, 
                message: "Login Success", 
                user 
            })
        }

    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred, please try again!" });
    }
}


// Git Auth 

const GitHub = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const ExistedUser = await userModel.findOne({ email: UserInfo })
        if (ExistedUser) {
            let token = jwt.sign({
                name: ExistedUser.name,
                email: ExistedUser.email,
                image: ExistedUser.image,
                role: ExistedUser.role,
                userId: ExistedUser._id
            }, process.env.JWT_KEY)

            let decoded = jwt.verify(token, process.env.JWT_KEY);
            if (decoded) {
                res.cookie({ token: token, role: ExistedUser.role, message: "Login Success" })
            }
        }
        else {
            const generatePass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(generatePass, salt);
            const NewUserData = new userModel({
                name: UserInfo.name,
                email: UserInfo.email,
                image: UserInfo.image,
                password: hash,
                role: UserInfo.role
            })
            const data = await NewUserData.save()
            if (data) {
                const token = jwt.sign({
                    name: data.name,
                    email: data.email,
                    image: data.image,
                    role: data.role,
                    userId: data._id
                }, process.env.JWT_KEY);
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                if (decoded) {
                    res.cookie("token", token, { httpOnly: true, secure: false })
                        .json({ success: true, message: "Login Success" })
                }
            }
        }
    }
    catch (err) {
        res.send({ success: false, message: "Some err happened please try again !" })
    }
}

module.exports = { signin, signup, logout, Google, GitHub, VerifyToken }