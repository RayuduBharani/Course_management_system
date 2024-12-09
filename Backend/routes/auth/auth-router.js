const express = require('express');
const { signin,
    signup,
    Google,
    GitHub,
    VerifyToken,
    logout } = require('../../Controllers/auth/Auth-controller');
const router = express.Router()

// signin and signup routers

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", Google)
router.post("/github", GitHub)
router.get("/logout", logout)
router.get("/check-auth", VerifyToken, (req, res) => {
    const user = req.user
    res.send({
        success: true,
        message: "User Authenticated",
        user: user
    })
})

module.exports = router;