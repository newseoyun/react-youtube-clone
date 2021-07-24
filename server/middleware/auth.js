const { User } = require("../models/User");

// 인증처리. 쿠키에서 토큰 가져오고 복호화
let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, err: true })

        req.token = token;
        req.user = user;

        next();
    })
}


module.exports = { auth };