const db = require('../../Utils/DB/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../Models/RBAC/userModel');
require('dotenv').config()

// signup

const signup = async (req, res) => {
    await db()
    const UserInfo = req.body
    
    // Validate required fields
    if (!UserInfo.email || !UserInfo.password || !UserInfo.name) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all required fields", 
            error: "auth/missing-fields" 
        });
    }

    try {
        const ExistedUser = await userModel.findOne({ email: UserInfo.email })
        if (ExistedUser) {
            return res.status(409).json({ 
                success: false, 
                message: "An account with this email already exists", 
                error: "auth/email-already-exists" 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(UserInfo.email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a valid email address", 
                error: "auth/invalid-email" 
            });
        }

        // Password strength validation
        if (UserInfo.password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 6 characters long", 
                error: "auth/weak-password" 
            });
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(UserInfo.password, salt);
        
        const NewUserInfo = new userModel({
            name: UserInfo.name,
            email: UserInfo.email.toLowerCase(), // Store email in lowercase
            password: hash,
            image: UserInfo.image || "", // Default empty string if no image
            role: "Empty"
        })
        
        const SignUpData = await NewUserInfo.save()
        if (SignUpData) {
            res.status(201).json({ 
                success: true, 
                message: "Account created successfully",
                user: {
                    name: SignUpData.name,
                    email: SignUpData.email,
                    role: SignUpData.role
                }
            });
        }
    }
    catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during registration",
            error: "auth/registration-failed"
        });
    }
}

// signin 

const signin = async (req, res) => {
    await db();
    const UserInfo = req.body;
    try {
        const SignInData = await userModel.findOne({ email: UserInfo.email });
        if (SignInData) {
            const CheckPassword = bcrypt.compareSync(UserInfo.password, SignInData.password);
            if (CheckPassword) {
                const token = jwt.sign({
                    email: SignInData.email,
                    name: SignInData.name,
                    userId: SignInData._id,
                    role: SignInData.role,
                    image: SignInData.image
                }, process.env.JWT_KEY);

                // Ensure only one response is sent
                if (!res.headersSent) {                    
                    res.cookie(process.env.JWT_KEY, token, { 
                        httpOnly: true, 
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'None',
                        path: '/',
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                    }).json({ 
                        success: true, 
                        role: SignInData.role, 
                        message: "Login Success",
                        user: SignInData
                    });
                }            } else {
                // Ensure only one response is sent
                if (!res.headersSent) {
                    res.status(401).json({ 
                        success: false, 
                        message: "Invalid credentials",
                        error: "auth/invalid-password"
                    });
                }
            }
        } else {
            // Ensure only one response is sent
            if (!res.headersSent) {
                res.status(404).json({ 
                    success: false, 
                    message: "Account not found. Please register first.", 
                    error: "auth/user-not-found"
                });
            }
        }
    } catch (err) {
        // Ensure only one response is sent
        if (!res.headersSent) {
            res.status(500).send({ success: false, message: err.message });
        }
        console.log(err);
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
    const cookiename = process.env.JWT_KEY;
    const token = req.cookies[cookiename];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in.",
            error: "auth/no-token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            throw new Error("Invalid token");
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        
        // Handle different types of JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please log in again.",
                error: "auth/token-expired"
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token. Please log in again.",
                error: "auth/invalid-token"
            });
        }

        res.status(401).json({
            success: false,
            message: "Authentication failed. Please log in again.",
            error: "auth/verification-failed"
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
        }        const token = jwt.sign({
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
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite : "None",
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            }).json({ 
                success: true, 
                role: user.role, 
                message: "Successfully logged in with Google",
                user 
            })
        }

    }    catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during Google authentication",
            error: "auth/google-signin-failed"
        });
    }
}


// Git Auth 

const GitHub = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const ExistedUser = await userModel.findOne({ email: UserInfo.email })
        if (ExistedUser) {
            const token = jwt.sign({
                name: ExistedUser.name,
                email: ExistedUser.email,
                image: ExistedUser.image,
                role: ExistedUser.role,
                userId: ExistedUser._id
            }, process.env.JWT_KEY, { expiresIn: '7d' })

            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if (decoded) {
                res.cookie(process.env.JWT_KEY, token, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    sameSite: 'None',
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                }).json({ 
                    success: true, 
                    role: ExistedUser.role, 
                    message: "Successfully logged in with GitHub",
                    user: ExistedUser
                });
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
                    res.cookie("token", token, { httpOnly: true, secure: false , sameSite: 'None'})
                        .json({ success: true, message: "Login Success" })
                }
            }
        }
    }    catch (err) {
        console.error("GitHub Auth Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during GitHub authentication",
            error: "auth/github-signin-failed"
        });
    }
}

module.exports = { signin, signup, logout, Google, GitHub, VerifyToken }